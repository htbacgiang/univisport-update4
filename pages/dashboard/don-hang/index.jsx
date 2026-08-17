import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useSession } from "next-auth/react";
import AdminLayout from "../../../components/layout/AdminLayout";
import { orderStatusText, paymentMethodText } from "../../../utils/mappings";

function formatCurrency(amount) {
  return Number(amount || 0).toLocaleString("vi-VN", { style: "currency", currency: "VND" });
}

const STATUS_OPTIONS = [
  { value: "pending",   label: "Đang chờ xử lý" },
  { value: "paid",      label: "Đã thanh toán" },
  { value: "shipped",   label: "Đang giao hàng" },
  { value: "delivered", label: "Đã giao" },
  { value: "cancelled", label: "Đã hủy" },
];

const STATUS_STYLE = {
  pending:   { badge: "bg-yellow-100 text-yellow-800 border border-yellow-300",  dot: "bg-yellow-400" },
  paid:      { badge: "bg-green-100 text-green-800 border border-green-300",    dot: "bg-green-400" },
  shipped:   { badge: "bg-blue-100 text-blue-800 border border-blue-300",       dot: "bg-blue-400" },
  delivered: { badge: "bg-gray-100 text-gray-700 border border-gray-300",       dot: "bg-gray-400" },
  cancelled: { badge: "bg-red-100 text-red-800 border border-red-300",          dot: "bg-red-400" },
};

const FILTER_OPTIONS = [{ value: "", label: "Tất cả trạng thái" }, ...STATUS_OPTIONS];

// ─── Toast ────────────────────────────────────────────────────────────────────
function Toast({ toasts }) {
  return (
    <div className="fixed bottom-5 right-5 z-[100] flex flex-col gap-2">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`px-4 py-3 rounded-lg shadow-lg text-sm font-medium text-white flex items-center gap-2 animate-fade-in ${
            t.type === "success" ? "bg-green-600" : "bg-red-600"
          }`}
        >
          {t.type === "success" ? (
            <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          ) : (
            <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          )}
          {t.message}
        </div>
      ))}
    </div>
  );
}

// ─── Delete Confirm Popup ─────────────────────────────────────────────────────
function DeleteConfirm({ order, onConfirm, onCancel }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-w-sm w-full p-6">
        <div className="flex items-center justify-center w-14 h-14 bg-red-100 rounded-full mx-auto mb-4">
          <svg className="w-7 h-7 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </div>
        <h3 className="text-lg font-bold text-center text-gray-900 dark:text-white mb-1">Xác nhận xóa đơn hàng</h3>
        <p className="text-sm text-center text-gray-500 dark:text-gray-400 mb-1">
          Đơn hàng của <span className="font-semibold text-gray-800 dark:text-gray-200">{order?.name}</span>
        </p>
        <p className="text-xs text-center text-red-500 mb-6">Hành động này không thể hoàn tác.</p>
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          >
            Hủy bỏ
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 py-2.5 rounded-xl bg-red-600 text-white font-medium hover:bg-red-700 transition-colors shadow-md"
          >
            Xóa đơn hàng
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Group order items by product+color, extract sizes from title ─────────────
function groupOrderItems(items = []) {
  const map = new Map();
  items.forEach((item) => {
    // title có thể là "Tên SP (S)" hoặc "Tên SP"
    const sizeMatch = item.title.match(/\(([^)]+)\)$/);
    const size = sizeMatch ? sizeMatch[1] : null;
    const baseTitle = size ? item.title.slice(0, item.title.lastIndexOf(`(${size})`)).trim() : item.title;
    const color = item.unit || "";
    const key = `${baseTitle}||${color}`;

    if (!map.has(key)) {
      map.set(key, { baseTitle, color, image: item.image, price: item.price, totalQty: 0, sizes: [] });
    }
    const group = map.get(key);
    group.totalQty += item.quantity;
    if (size) group.sizes.push({ size, qty: item.quantity });
  });
  return Array.from(map.values());
}

// ─── Order Detail Modal ───────────────────────────────────────────────────────
function OrderDetailModal({ order, onClose, onStatusChange, updatingId }) {
  if (!order) return null;
  const style = STATUS_STYLE[order.status] || STATUS_STYLE.pending;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <div>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">Chi tiết đơn hàng</h2>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 font-mono">
              #{order.orderCode || order.id?.slice(-10).toUpperCase()}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="overflow-y-auto flex-1 px-6 py-4 space-y-5">
          {/* Thông tin khách hàng */}
          <section>
            <h3 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">Thông tin khách hàng</h3>
            <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4 grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
              <InfoRow label="Họ tên" value={order.name} />
              <InfoRow label="Số điện thoại" value={order.phone} />
              <InfoRow label="Địa chỉ giao hàng" value={order.shippingAddress?.address} className="sm:col-span-2" />
              {order.note && <InfoRow label="Ghi chú" value={order.note} className="sm:col-span-2" />}
            </div>
          </section>

          {/* Trạng thái & thanh toán */}
          <section>
            <h3 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">Trạng thái & Thanh toán</h3>
            <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4 grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Trạng thái đơn hàng</p>
                <select
                  value={order.status}
                  disabled={updatingId === order.id}
                  onChange={(e) => onStatusChange(order.id, e.target.value)}
                  className={`text-xs font-semibold px-3 py-1.5 rounded-lg cursor-pointer border-0 outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-60 ${style.badge}`}
                >
                  {STATUS_OPTIONS.map((s) => (
                    <option key={s.value} value={s.value}>{s.label}</option>
                  ))}
                </select>
                {updatingId === order.id && (
                  <span className="text-xs text-blue-500 ml-2 animate-pulse">Đang lưu...</span>
                )}
              </div>
              <InfoRow label="Phương thức thanh toán" value={paymentMethodText[order.paymentMethod] || order.paymentMethod} />
              {order.paymentCode && <InfoRow label="Mã thanh toán" value={order.paymentCode} />}
              <InfoRow
                label="Thời gian đặt hàng"
                value={new Date(order.createdAt).toLocaleString("vi-VN")}
              />
            </div>
          </section>

          {/* Sản phẩm */}
          <section>
            <h3 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
              Sản phẩm ({groupOrderItems(order.orderItems).length} loại)
            </h3>
            <div className="space-y-2">
              {groupOrderItems(order.orderItems).map((group, idx) => (
                <div key={idx} className="flex items-start gap-3 bg-gray-50 dark:bg-gray-800 rounded-xl p-3">
                  {group.image && (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img src={group.image} alt={group.baseTitle} className="w-14 h-14 rounded-lg object-cover border border-gray-200 dark:border-gray-700 shrink-0 mt-0.5" />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">{group.baseTitle}</p>
                    {group.color && (
                      <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">Màu: {group.color}</p>
                    )}
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      Tổng: <span className="font-semibold text-gray-700 dark:text-gray-200">{group.totalQty} cái</span>
                    </p>
                    {group.sizes.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mt-1.5">
                        {group.sizes.map(({ size, qty }) => (
                          <span key={size} className="inline-flex items-center gap-1 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-md px-2 py-0.5 text-xs text-gray-700 dark:text-gray-300">
                            <span className="font-semibold">{size}</span>
                            <span className="text-gray-400">×</span>
                            <span>{qty}</span>
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">{formatCurrency(group.price)}</p>
                    <p className="text-xs text-gray-400 mt-0.5">× {group.totalQty} = {formatCurrency(group.price * group.totalQty)}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Tổng tiền */}
          <section>
            <h3 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">Tổng kết đơn hàng</h3>
            <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4 space-y-2 text-sm">
              <div className="flex justify-between text-gray-600 dark:text-gray-400">
                <span>Tạm tính</span>
                <span>{formatCurrency(order.totalPrice)}</span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Giảm giá {order.coupon && `(${order.coupon})`}</span>
                  <span>- {formatCurrency(order.discount)}</span>
                </div>
              )}
              <div className="flex justify-between text-gray-600 dark:text-gray-400">
                <span>Phí vận chuyển</span>
                <span>{formatCurrency(order.shippingFee)}</span>
              </div>
              <div className="h-px bg-gray-200 dark:bg-gray-700 my-1" />
              <div className="flex justify-between font-bold text-base text-gray-900 dark:text-white">
                <span>Tổng thanh toán</span>
                <span className="text-blue-600 dark:text-blue-400">{formatCurrency(order.finalTotal)}</span>
              </div>
            </div>
          </section>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
}

function InfoRow({ label, value, className = "" }) {
  return (
    <div className={className}>
      <p className="text-xs text-gray-500 dark:text-gray-400">{label}</p>
      <p className="font-medium text-gray-900 dark:text-white mt-0.5">{value || <span className="text-gray-400 italic font-normal">—</span>}</p>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
const PAGE_SIZE = 10;

export default function DonHangPage() {
  const { data: session, status } = useSession();
  const [orders, setOrders]           = useState([]);
  const [loading, setLoading]         = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [deleteTarget, setDeleteTarget]   = useState(null);
  const [statusFilter, setStatusFilter]   = useState("");
  const [search, setSearch]           = useState("");
  const [updatingId, setUpdatingId]   = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [toasts, setToasts]           = useState([]);

  const addToast = (message, type = "success") => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 3500);
  };

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axios.get("/api/orders");
      setOrders(res.data.orders || []);
    } catch (err) {
      addToast("Không thể tải danh sách đơn hàng", "error");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (status === "authenticated") fetchOrders();
  }, [status, fetchOrders]);

  const handleStatusChange = async (orderId, newStatus) => {
    const prev = orders.find((o) => o.id === orderId)?.status;
    setUpdatingId(orderId);
    // optimistic update
    setOrders((list) => list.map((o) => o.id === orderId ? { ...o, status: newStatus } : o));
    if (selectedOrder?.id === orderId) setSelectedOrder((s) => ({ ...s, status: newStatus }));
    try {
      await axios.put(`/api/admin/orders/${orderId}`, { status: newStatus });
      addToast(`Cập nhật trạng thái thành công: ${orderStatusText[newStatus] || newStatus}`);
    } catch (err) {
      // rollback on error
      setOrders((list) => list.map((o) => o.id === orderId ? { ...o, status: prev } : o));
      if (selectedOrder?.id === orderId) setSelectedOrder((s) => ({ ...s, status: prev }));
      const msg = err?.response?.data?.message || "Cập nhật thất bại";
      addToast(msg, "error");
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDeleteConfirm = async () => {
    const id = deleteTarget?.id;
    setDeleteTarget(null);
    try {
      await axios.delete(`/api/admin/orders/${id}`);
      setOrders((list) => list.filter((o) => o.id !== id));
      if (selectedOrder?.id === id) setSelectedOrder(null);
      addToast("Đã xóa đơn hàng thành công");
    } catch (err) {
      addToast("Xóa đơn hàng thất bại", "error");
    }
  };

  // Derived
  const filtered = orders.filter((o) => {
    const matchStatus = !statusFilter || o.status === statusFilter;
    const q = search.toLowerCase();
    const matchSearch = !q ||
      o.name?.toLowerCase().includes(q) ||
      o.phone?.includes(q) ||
      o.orderCode?.toLowerCase().includes(q);
    return matchStatus && matchSearch;
  });

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paged = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const stats = {
    total:     orders.length,
    pending:   orders.filter((o) => o.status === "pending").length,
    delivered: orders.filter((o) => o.status === "delivered").length,
    cancelled: orders.filter((o) => o.status === "cancelled").length,
    revenue:   orders.filter((o) => o.status !== "cancelled").reduce((s, o) => s + (o.finalTotal || 0), 0),
  };

  if (status === "loading") {
    return <AdminLayout title="Quản lý đơn hàng"><p className="p-8">Đang xác thực...</p></AdminLayout>;
  }
  if (!session) {
    return <AdminLayout title="Quản lý đơn hàng"><p className="p-8">Bạn cần đăng nhập.</p></AdminLayout>;
  }

  return (
    <AdminLayout title="Quản lý đơn hàng">
      <div className="p-6 bg-white dark:bg-slate-900 min-h-screen">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Quản lý đơn hàng</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Xem và cập nhật trạng thái tất cả đơn hàng</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
          {[
            { label: "Tổng đơn",   value: stats.total,                  color: "bg-blue-50   text-blue-700   border-blue-200" },
            { label: "Chờ xử lý",  value: stats.pending,                color: "bg-yellow-50 text-yellow-700 border-yellow-200" },
            { label: "Đã giao",    value: stats.delivered,              color: "bg-green-50  text-green-700  border-green-200" },
            { label: "Đã hủy",     value: stats.cancelled,              color: "bg-red-50    text-red-700    border-red-200" },
            { label: "Doanh thu",  value: formatCurrency(stats.revenue), color: "bg-purple-50 text-purple-700 border-purple-200" },
          ].map((s, i) => (
            <div key={i} className={`rounded-xl border p-4 ${s.color}`}>
              <p className="text-xs font-medium opacity-70">{s.label}</p>
              <p className="text-lg font-bold mt-1">{s.value}</p>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3 mb-4">
          <input
            type="text"
            placeholder="Tìm theo tên, SĐT, mã đơn..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
            className="border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 text-sm bg-white dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
          />
          <select
            value={statusFilter}
            onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}
            className="border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 text-sm bg-white dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {FILTER_OPTIONS.map((s) => (
              <option key={s.value} value={s.value}>{s.label}</option>
            ))}
          </select>
          <button
            onClick={fetchOrders}
            className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Làm mới
          </button>
        </div>

        {/* Table */}
        <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            {loading ? (
              <div className="flex items-center justify-center p-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
                <span className="ml-3 text-gray-600 dark:text-gray-300">Đang tải...</span>
              </div>
            ) : paged.length === 0 ? (
              <div className="text-center py-16 text-gray-400 dark:text-gray-500">
                <svg className="mx-auto w-14 h-14 mb-3 opacity-40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                Không có đơn hàng nào
              </div>
            ) : (
              <table className="w-full text-sm">
                <thead className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                  <tr>
                    {["STT", "Mã đơn", "Khách hàng", "SĐT", "Tổng tiền", "Thời gian", "Trạng thái", "Thao tác"].map((h) => (
                      <th key={h} className="px-4 py-3 text-left text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                  {paged.map((order, i) => {
                    const style = STATUS_STYLE[order.status] || STATUS_STYLE.pending;
                    return (
                      <tr key={order.id} className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                        <td className="px-4 py-3 text-gray-400 dark:text-gray-500 text-xs">{(currentPage - 1) * PAGE_SIZE + i + 1}</td>
                        <td className="px-4 py-3 font-mono text-xs text-gray-500 dark:text-gray-400">
                          #{order.orderCode || order.id?.slice(-8).toUpperCase()}
                        </td>
                        <td className="px-4 py-3 font-semibold text-gray-900 dark:text-white whitespace-nowrap">{order.name}</td>
                        <td className="px-4 py-3 text-gray-600 dark:text-gray-300">{order.phone}</td>
                        <td className="px-4 py-3 font-semibold text-gray-900 dark:text-white whitespace-nowrap">
                          {formatCurrency(order.finalTotal)}
                        </td>
                        <td className="px-4 py-3 text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap">
                          {new Date(order.createdAt).toLocaleDateString("vi-VN")}
                          <br />
                          <span className="text-gray-400">{new Date(order.createdAt).toLocaleTimeString("vi-VN")}</span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1.5">
                            <span className={`inline-block w-2 h-2 rounded-full ${style.dot}`} />
                            <select
                              value={order.status}
                              disabled={updatingId === order.id}
                              onChange={(e) => handleStatusChange(order.id, e.target.value)}
                              className="text-xs font-medium bg-transparent border-0 outline-none cursor-pointer text-gray-700 dark:text-gray-300 disabled:opacity-50"
                            >
                              {STATUS_OPTIONS.map((s) => (
                                <option key={s.value} value={s.value}>{s.label}</option>
                              ))}
                            </select>
                            {updatingId === order.id && (
                              <div className="animate-spin w-3 h-3 border border-blue-500 border-t-transparent rounded-full" />
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => setSelectedOrder(order)}
                              className="text-xs px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                            >
                              Chi tiết
                            </button>
                            <button
                              onClick={() => setDeleteTarget(order)}
                              className="text-xs px-3 py-1.5 bg-red-50 text-red-600 border border-red-200 rounded-lg hover:bg-red-100 transition-colors font-medium"
                            >
                              Xóa
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="px-6 py-4 bg-gray-50 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between flex-wrap gap-3">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Hiển thị {(currentPage - 1) * PAGE_SIZE + 1}–{Math.min(currentPage * PAGE_SIZE, filtered.length)} / {filtered.length} đơn hàng
              </span>
              <div className="flex gap-1">
                <button
                  onClick={() => setCurrentPage((p) => p - 1)}
                  disabled={currentPage === 1}
                  className="px-3.5 py-1.5 text-sm border border-gray-300 rounded-full disabled:opacity-40 hover:bg-gray-100 dark:hover:bg-gray-700 dark:border-gray-600 dark:text-gray-300"
                >
                  Trước
                </button>
                {Array.from({ length: totalPages }, (_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentPage(i + 1)}
                    className={`w-9 h-9 flex items-center justify-center text-sm rounded-full border transition-colors ${currentPage === i + 1 ? "bg-blue-600 text-white border-blue-600" : "border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-gray-300"}`}
                  >
                    {i + 1}
                  </button>
                ))}
                <button
                  onClick={() => setCurrentPage((p) => p + 1)}
                  disabled={currentPage === totalPages}
                  className="px-3.5 py-1.5 text-sm border border-gray-300 rounded-full disabled:opacity-40 hover:bg-gray-100 dark:hover:bg-gray-700 dark:border-gray-600 dark:text-gray-300"
                >
                  Sau
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      <OrderDetailModal
        order={selectedOrder}
        onClose={() => setSelectedOrder(null)}
        onStatusChange={handleStatusChange}
        updatingId={updatingId}
      />

      {deleteTarget && (
        <DeleteConfirm
          order={deleteTarget}
          onConfirm={handleDeleteConfirm}
          onCancel={() => setDeleteTarget(null)}
        />
      )}

      <Toast toasts={toasts} />
    </AdminLayout>
  );
}
