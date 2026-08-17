import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import axios from 'axios';
import AdminLayout from '../../../components/layout/AdminLayout';
import Link from 'next/link';
import Image from 'next/image';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Edit, Trash2, X, GripVertical, Eye, EyeOff, ExternalLink } from 'lucide-react';
import styles from '../../../styles/dashboard-products.module.css';
import { ReactSortable } from "react-sortablejs";
import { getProductLineOptions, getCollarTypeOptions, getProductLineLabel, getCollarTypeLabel } from '../../../lib/productTaxonomy';

const CATEGORY_NAMES = {
  'dong-phuc-gym': 'Đồng phục Gym',
  'dong-phuc-yoga-pilates': 'Đồng phục Yoga - Pilates',
  'dong-phuc-pickleball': 'Đồng phục Pickleball',
  'dong-phuc-chay-bo': 'Đồng phục Chạy bộ',
  'dong-phuc-mma': 'Đồng phục MMA',
  'dong-phuc-ao-gio': 'Đồng phục Áo Gió',
  'dong-phuc-golf-tennis': 'Đồng phục Golf - Tennis',
};

const CATEGORY_ORDER = [
  'dong-phuc-gym',
  'dong-phuc-yoga-pilates',
  'dong-phuc-pickleball',
  'dong-phuc-chay-bo',
  'dong-phuc-mma',
  'dong-phuc-ao-gio',
  'dong-phuc-golf-tennis',
];

export default function JSONProductsListPage() {
  const [allProducts, setAllProducts] = useState([]);
  const [displayedProducts, setDisplayedProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedProductLine, setSelectedProductLine] = useState('');
  const [selectedCollarType, setSelectedCollarType] = useState('');
  const [limit, setLimit] = useState(20);
  const [isSorting, setIsSorting] = useState(false);

  const tableContainerRef = useRef(null);
  const containerRef = useRef(null);

  const categoryTabs = useMemo(() => {
    const fromProducts = allProducts.reduce((acc, product) => {
      if (product.category) {
        acc.set(product.category, product.categoryNameVN || CATEGORY_NAMES[product.category] || product.category);
      }
      return acc;
    }, new Map(CATEGORY_ORDER.map((slug) => [slug, CATEGORY_NAMES[slug]])));

    return Array.from(fromProducts.entries()).sort(([a], [b]) => {
      const orderA = CATEGORY_ORDER.indexOf(a);
      const orderB = CATEGORY_ORDER.indexOf(b);
      if (orderA === -1 && orderB === -1) return a.localeCompare(b);
      if (orderA === -1) return 1;
      if (orderB === -1) return -1;
      return orderA - orderB;
    });
  }, [allProducts]);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.get('/api/products');
      const products = response.data.products || [];
      console.log('Products:', products);
      setAllProducts(products);
    } catch (error) {
      console.error('Error fetching products:', error);
      toast.error('Không thể tải danh sách sản phẩm', {
        position: 'top-right',
        autoClose: 3000,
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const productLineFilterOptions = useMemo(
    () => getProductLineOptions(selectedCategory),
    [selectedCategory]
  );
  const collarTypeFilterOptions = useMemo(
    () => getCollarTypeOptions(selectedCategory, selectedProductLine),
    [selectedCategory, selectedProductLine]
  );

  // Filter products based on search, category, product line, collar type
  const filteredProducts = allProducts.filter(product => {
    const normalizedSearch = searchTerm.toLowerCase();
    const matchesSearch = !searchTerm ||
      (product.name || '').toLowerCase().includes(normalizedSearch) ||
      (product.maSanPham || '').toLowerCase().includes(normalizedSearch) ||
      (product.categoryNameVN || '').toLowerCase().includes(normalizedSearch);

    const matchesCategory = !selectedCategory || product.category === selectedCategory;
    const matchesProductLine = !selectedProductLine || product.productLine === selectedProductLine;
    const matchesCollarType = !selectedCollarType || product.collarType === selectedCollarType;

    return matchesSearch && matchesCategory && matchesProductLine && matchesCollarType;
  }); // Note: allProducts is already sorted from API. When dragging, we will re-fetch or manually sort.

  useEffect(() => {
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    setDisplayedProducts(filteredProducts.slice(startIndex, endIndex));
    setTotalPages(Math.ceil(filteredProducts.length / limit));
  }, [filteredProducts, page, limit]);


  const handleDelete = async () => {
    if (!productToDelete) return;

    setLoading(true);
    try {
      await axios.delete(`/api/products?id=${productToDelete}`);
      toast.success('Sản phẩm đã được xóa thành công', {
        position: 'top-right',
        autoClose: 3000,
      });
      // Ensure proper type comparison (handle both number and string IDs)
      const updatedProducts = allProducts.filter((product) =>
        String(product.id) !== String(productToDelete) &&
        String(product._id) !== String(productToDelete)
      );
      setAllProducts(updatedProducts);
      setTotalPages(Math.ceil(updatedProducts.length / limit));
      if (updatedProducts.length > 0 && displayedProducts.length === 1 && page > 1) {
        setPage(page - 1);
      }
    } catch (error) {
      console.error('Error deleting product:', error);
      toast.error(error.response?.data?.err || 'Không thể xóa sản phẩm', {
        position: 'top-right',
        autoClose: 3000,
      });
    } finally {
      setLoading(false);
      setIsModalOpen(false);
      setProductToDelete(null);
    }
  };

  const confirmDelete = (id) => {
    setProductToDelete(id);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setProductToDelete(null);
  };

  const handleSort = async (newList) => {
    if (!selectedCategory || isSorting || searchTerm) return;

    // Check if order actually changed
    const isChanged = newList.some((item, index) => item.id !== displayedProducts[index]?.id);
    if (!isChanged) return;

    setDisplayedProducts(newList);
    setIsSorting(true);

    const startIndex = (page - 1) * limit;
    const newFilteredProducts = [...filteredProducts];
    newFilteredProducts.splice(startIndex, limit, ...newList);

    try {
      await axios.post('/api/products/reorder', { category: selectedCategory, items: newFilteredProducts });
      // Re-fetch to ensure sync with DB
      fetchProducts();
      toast.success('Đã lưu thứ tự mới', { autoClose: 1000 });
    } catch (error) {
      console.error(error);
      toast.error('Lỗi khi lưu thứ tự');
    } finally {
      setIsSorting(false);
    }
  };

  const handleVisibilityToggle = async (product, field) => {
    const currentValue = product[field] !== false;
    const nextValue = !currentValue;
    const productKey = product.id ?? product._id;

    setAllProducts((prev) =>
      prev.map((item) =>
        String(item.id ?? item._id) === String(productKey)
          ? { ...item, [field]: nextValue }
          : item
      )
    );

    try {
      await axios.patch('/api/products/visibility', {
        id: productKey,
        field,
        value: nextValue,
      });
      toast.success(nextValue ? 'Đã bật hiển thị' : 'Đã ẩn sản phẩm', { autoClose: 1000 });
    } catch (error) {
      setAllProducts((prev) =>
        prev.map((item) =>
          String(item.id ?? item._id) === String(productKey)
            ? { ...item, [field]: currentValue }
            : item
        )
      );
      toast.error(error.response?.data?.err || 'Không thể cập nhật hiển thị');
    }
  };

  const renderPagination = () => {
    const pageNumbers = [];
    const maxPagesToShow = 5;
    const ellipsis = "...";

    if (totalPages <= maxPagesToShow) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      let startPage = Math.max(1, page - 2);
      let endPage = Math.min(totalPages, page + 2);

      if (startPage > 1) {
        pageNumbers.push(1);
        if (startPage > 2) pageNumbers.push(ellipsis);
      }

      for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(i);
      }

      if (endPage < totalPages) {
        if (endPage < totalPages - 1) pageNumbers.push(ellipsis);
        pageNumbers.push(totalPages);
      }
    }

    return (
      <div className={styles.pagination}>
        <button
          onClick={() => setPage((p) => Math.max(p - 1, 1))}
          disabled={page === 1}
          className={styles.paginationButton}
        >
          Trước
        </button>
        {pageNumbers.map((num, index) => (
          <button
            key={index}
            onClick={() => typeof num === 'number' && setPage(num)}
            disabled={num === ellipsis}
            className={`${styles.pageNumber} ${num === page
              ? styles.active
              : num === ellipsis
                ? styles.ellipsis
                : ''
              }`}
          >
            {num}
          </button>
        ))}
        <button
          onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
          disabled={page === totalPages}
          className={styles.paginationButton}
        >
          Sau
        </button>
      </div>
    );
  };

  return (
    <AdminLayout title="Quản lý sản phẩm">
      <div className={styles.container} ref={containerRef}>

        {/* Search and Filter */}
        <div className={styles.filterSection} style={{ flexDirection: 'column', alignItems: 'flex-start', gap: '1rem' }}>
          <div className="flex flex-wrap gap-2 mb-2">
            <button
              onClick={() => { setSelectedCategory(''); setSelectedProductLine(''); setSelectedCollarType(''); setPage(1); }}
              className={`px-4 py-2 rounded-md font-medium transition-colors ${selectedCategory === '' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
            >
              Tất cả
            </button>
            {categoryTabs.map(([category, categoryName]) => (
              <button
                key={category}
                onClick={() => { setSelectedCategory(category); setSelectedProductLine(''); setSelectedCollarType(''); setPage(1); }}
                className={`px-4 py-2 rounded-md font-medium transition-colors ${selectedCategory === category ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
              >
                {categoryName}
              </button>
            ))}
          </div>

          {(productLineFilterOptions.length > 0 || selectedProductLine) && (
            <div className="flex flex-wrap gap-2 mb-2 items-center">
              <select
                value={selectedProductLine}
                onChange={(e) => { setSelectedProductLine(e.target.value); setSelectedCollarType(''); setPage(1); }}
                className={styles.pageSizeSelect}
                aria-label="Lọc theo dòng sản phẩm"
              >
                <option value="">Tất cả dòng sản phẩm</option>
                {productLineFilterOptions.map((line) => (
                  <option key={line.value} value={line.value}>{line.label}</option>
                ))}
              </select>

              {(collarTypeFilterOptions.length > 0 || selectedCollarType) && (
                <select
                  value={selectedCollarType}
                  onChange={(e) => { setSelectedCollarType(e.target.value); setPage(1); }}
                  className={styles.pageSizeSelect}
                  aria-label="Lọc theo kiểu cổ"
                >
                  <option value="">Tất cả kiểu cổ</option>
                  {collarTypeFilterOptions.map((collar) => (
                    <option key={collar.value} value={collar.value}>{collar.label}</option>
                  ))}
                </select>
              )}
            </div>
          )}

          <div className="w-full flex justify-between items-center">
            <div className={styles.searchBox} style={{ width: '300px' }}>
              <input
                type="text"
                placeholder="Tìm kiếm theo tên, mã sản phẩm..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={styles.searchInput}
              />
            </div>

          </div>
        </div>

        {/* Pagination Info */}
        <div className={styles.paginationInfo}>
          <div className={styles.paginationStats}>
            Hiển thị {displayedProducts.length > 0 ? (page - 1) * limit + 1 : 0} - {Math.min(page * limit, filteredProducts.length)} trong tổng số {filteredProducts.length} sản phẩm
          </div>
          <div className={styles.paginationControls}>
            <span className="text-sm text-gray-600">Hiển thị:</span>
            <select
              value={limit}
              onChange={(e) => {
                const newLimit = parseInt(e.target.value);
                setLimit(newLimit);
                setPage(1);
              }}
              className={styles.pageSizeSelect}
            >
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
          </div>
        </div>

        {loading && allProducts.length === 0 ? (
          <div className={styles.loading}>Đang tải...</div>
        ) : (
          <div className={styles.mainContent}>
            <div ref={tableContainerRef} className={styles.tableContainer}>
              <table
                className={styles.table}
                role="grid"
                aria-label="Danh sách sản phẩm JSON"
              >
                <thead className={styles.tableHead}>
                  <tr>
                    <th className={styles.tableHeader} scope="col">STT</th>
                    <th className={styles.tableHeader} scope="col" aria-label="Kéo thả"></th>
                    <th className={styles.tableHeader} scope="col">Tên sản phẩm</th>
                    <th className={styles.tableHeader} scope="col">Ảnh</th>
                    <th className={styles.tableHeader} scope="col">Mã SP</th>
                    <th className={styles.tableHeader} scope="col">Danh mục</th>
                    <th className={styles.tableHeader} scope="col">Phân loại</th>
                    <th className={styles.tableHeader} scope="col">Giá</th>
                    <th className={styles.tableHeader} scope="col">Trạng thái</th>
                    <th className={styles.tableHeader} scope="col">Trang chủ</th>
                    <th className={styles.tableHeader} scope="col">Hành động</th>
                  </tr>
                </thead>
                {(selectedCategory && !searchTerm) ? (
                  <ReactSortable
                    list={displayedProducts}
                    setList={handleSort}
                    animation={150}
                    handle=".drag-handle"
                    tag="tbody"
                    className={styles.tableBody}
                  >
                    {displayedProducts.length === 0 ? (
                      <tr>
                        <td
                          colSpan={11}
                          className={styles.emptyState}
                        >
                          {filteredProducts.length === 0 ? 'Không có sản phẩm nào phù hợp' : 'Không có sản phẩm nào'}
                        </td>
                      </tr>
                    ) : (
                      displayedProducts.map((product, index) => (
                        <tr
                          key={product.id ?? product._id}
                          className={styles.tableRow}
                          role="row"
                        >
                          <td className={styles.tableCell}>{(page - 1) * limit + index + 1}</td>
                          <td className={styles.tableCell}>
                            <div className="drag-handle cursor-move text-gray-400 hover:text-gray-600 p-1">
                              <GripVertical size={16} />
                            </div>
                          </td>
                          <td className={styles.tableCell}>
                            <span className={styles.productName}>{product.name || 'N/A'}</span>
                          </td>
                          <td className={styles.tableCell}>
                            <Image
                              src={product.image || '/images/placeholder.jpg'}
                              alt={product.name || 'Sản phẩm'}
                              width={40}
                              height={40}
                              className={styles.productImage}
                            />
                          </td>
                          <td className={styles.tableCell}>
                            <span className={styles.productCode}>{product.maSanPham || 'N/A'}</span>
                          </td>
                          <td className={styles.tableCell}>
                            <span className={styles.category}>
                              {product.categoryNameVN || CATEGORY_NAMES[product.category] || 'Không xác định'}
                            </span>
                          </td>
                          <td className={styles.tableCell}>
                            <span className={styles.category} style={{ fontSize: '0.75rem', color: '#64748b' }}>
                              {[
                                getProductLineLabel(product.category, product.productLine),
                                getCollarTypeLabel(product.category, product.productLine, product.collarType),
                              ].filter(Boolean).join(' · ') || '—'}
                            </span>
                          </td>
                          <td className={styles.tableCell}>
                            <span className={styles.price}>
                              {product.price?.toLocaleString('vi-VN') || 0}đ
                              {product.originalPrice && product.originalPrice > product.price && (
                                <span className={styles.originalPrice}>
                                  {' '}({product.originalPrice.toLocaleString('vi-VN')}đ)
                                </span>
                              )}
                            </span>
                          </td>
                          <td className={styles.tableCell}>
                            <div className={styles.statusContainer}>
                              {product.isNew && (
                                <span className={`${styles.status} ${styles.newStatus}`}>Mới</span>
                              )}
                              {product.isFeatured && (
                                <span className={`${styles.status} ${styles.featuredStatus}`}>Nổi bật</span>
                              )}
                              {!product.isNew && !product.isFeatured && (
                                <span className={`${styles.status} ${styles.normalStatus}`}>Thường</span>
                              )}
                            </div>
                          </td>
                          <td className={styles.tableCell}>
                            <button
                              type="button"
                              onClick={() => handleVisibilityToggle(product, 'visibleOnHome')}
                              className={`${styles.visibilityButton} ${product.visibleOnHome !== false ? styles.visibleButton : styles.hiddenButton}`}
                              aria-label={`${product.visibleOnHome !== false ? 'Ẩn' : 'Hiện'} sản phẩm ở trang chủ`}
                              title={product.visibleOnHome !== false ? 'Đang hiện ở trang chủ' : 'Đang ẩn ở trang chủ'}
                            >
                              {product.visibleOnHome !== false ? <Eye size={16} /> : <EyeOff size={16} />}
                            </button>
                          </td>
                          <td className={styles.tableCell}>
                            <div className={styles.actionButtons}>
                              <a
                                href={`/san-pham/${product.slug}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={`${styles.actionButton} ${styles.viewButton}`}
                                aria-label={`Xem sản phẩm ${product.name || 'Sản phẩm'} ở trang chủ`}
                                title="Xem sản phẩm ở trang chủ"
                              >
                                <ExternalLink size={16} />
                              </a>
                              <Link href={`/dashboard/them-san-pham/?id=${product.id}`}>
                                <button
                                  className={`${styles.actionButton} ${styles.editButton}`}
                                  aria-label={`Sửa sản phẩm ${product.name || 'Sản phẩm'}`}
                                >
                                  <Edit size={16} />
                                </button>
                              </Link>
                              <button
                                onClick={() => confirmDelete(product.id)}
                                className={`${styles.actionButton} ${styles.deleteButton}`}
                                aria-label={`Xóa sản phẩm ${product.name || 'Sản phẩm'}`}
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </ReactSortable>
                ) : (
                  <tbody className={styles.tableBody}>
                    {displayedProducts.length === 0 ? (
                      <tr>
                        <td
                          colSpan={11}
                          className={styles.emptyState}
                        >
                          {filteredProducts.length === 0 ? 'Không có sản phẩm nào phù hợp' : 'Không có sản phẩm nào'}
                        </td>
                      </tr>
                    ) : (
                      displayedProducts.map((product, index) => (
                        <tr
                          key={product.id ?? product._id}
                          className={styles.tableRow}
                          role="row"
                        >
                          <td className={styles.tableCell}>{(page - 1) * limit + index + 1}</td>
                          <td className={styles.tableCell}></td>
                          <td className={styles.tableCell}>
                            <span className={styles.productName}>{product.name || 'N/A'}</span>
                          </td>
                          <td className={styles.tableCell}>
                            <Image
                              src={product.image || '/images/placeholder.jpg'}
                              alt={product.name || 'Sản phẩm'}
                              width={40}
                              height={40}
                              className={styles.productImage}
                            />
                          </td>
                          <td className={styles.tableCell}>
                            <span className={styles.productCode}>{product.maSanPham || 'N/A'}</span>
                          </td>
                          <td className={styles.tableCell}>
                            <span className={styles.category}>
                              {product.categoryNameVN || CATEGORY_NAMES[product.category] || 'Không xác định'}
                            </span>
                          </td>
                          <td className={styles.tableCell}>
                            <span className={styles.category} style={{ fontSize: '0.75rem', color: '#64748b' }}>
                              {[
                                getProductLineLabel(product.category, product.productLine),
                                getCollarTypeLabel(product.category, product.productLine, product.collarType),
                              ].filter(Boolean).join(' · ') || '—'}
                            </span>
                          </td>
                          <td className={styles.tableCell}>
                            <span className={styles.price}>
                              {product.price?.toLocaleString('vi-VN') || 0}đ
                              {product.originalPrice && product.originalPrice > product.price && (
                                <span className={styles.originalPrice}>
                                  {' '}({product.originalPrice.toLocaleString('vi-VN')}đ)
                                </span>
                              )}
                            </span>
                          </td>
                          <td className={styles.tableCell}>
                            <div className={styles.statusContainer}>
                              {product.isNew && (
                                <span className={`${styles.status} ${styles.newStatus}`}>Mới</span>
                              )}
                              {product.isFeatured && (
                                <span className={`${styles.status} ${styles.featuredStatus}`}>Nổi bật</span>
                              )}
                              {!product.isNew && !product.isFeatured && (
                                <span className={`${styles.status} ${styles.normalStatus}`}>Thường</span>
                              )}
                            </div>
                          </td>
                          <td className={styles.tableCell}>
                            <button
                              type="button"
                              onClick={() => handleVisibilityToggle(product, 'visibleOnHome')}
                              className={`${styles.visibilityButton} ${product.visibleOnHome !== false ? styles.visibleButton : styles.hiddenButton}`}
                              aria-label={`${product.visibleOnHome !== false ? 'Ẩn' : 'Hiện'} sản phẩm ở trang chủ`}
                              title={product.visibleOnHome !== false ? 'Đang hiện ở trang chủ' : 'Đang ẩn ở trang chủ'}
                            >
                              {product.visibleOnHome !== false ? <Eye size={16} /> : <EyeOff size={16} />}
                            </button>
                          </td>
                          <td className={styles.tableCell}>
                            <div className={styles.actionButtons}>
                              <a
                                href={`/san-pham/${product.slug}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={`${styles.actionButton} ${styles.viewButton}`}
                                aria-label={`Xem sản phẩm ${product.name || 'Sản phẩm'} ở trang chủ`}
                                title="Xem sản phẩm ở trang chủ"
                              >
                                <ExternalLink size={16} />
                              </a>
                              <Link href={`/dashboard/them-san-pham/?id=${product.id}`}>
                                <button
                                  className={`${styles.actionButton} ${styles.editButton}`}
                                  aria-label={`Sửa sản phẩm ${product.name || 'Sản phẩm'}`}
                                >
                                  <Edit size={16} />
                                </button>
                              </Link>
                              <button
                                onClick={() => confirmDelete(product.id)}
                                className={`${styles.actionButton} ${styles.deleteButton}`}
                                aria-label={`Xóa sản phẩm ${product.name || 'Sản phẩm'}`}
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                )}
              </table>
            </div>
          </div>
        )}

        {totalPages > 1 && renderPagination()}

        {isModalOpen && (
          <div className={styles.modal} onClick={closeModal}>
            <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
              <div className={styles.modalIconWrapper}>

              </div>
              <h3 className="text-xl font-bold text-red-500 mb-3">
                Xác nhận xóa sản phẩm
              </h3>
              <p className={styles.modalText}>
                Bạn có chắc chắn muốn xóa sản phẩm này không? Hành động này không thể hoàn tác.
              </p>
              <div className={styles.modalActions}>
                <button
                  onClick={closeModal}
                  className={`${styles.modalButton} ${styles.cancel}`}
                  disabled={loading}
                >
                  <X size={18} />
                  <span>Hủy bỏ</span>
                </button>
                <button
                  onClick={handleDelete}
                  className={`${styles.modalButton} ${styles.delete}`}
                  disabled={loading}
                >
                  <Trash2 size={18} />
                  <span>{loading ? 'Đang xóa...' : 'Xóa ngay'}</span>
                </button>
              </div>
            </div>
          </div>
        )}

        <ToastContainer />
      </div>
    </AdminLayout>
  );
}
