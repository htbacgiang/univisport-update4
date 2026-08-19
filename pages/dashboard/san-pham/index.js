import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import axios from 'axios';
import AdminLayout from '../../../components/layout/AdminLayout';
import Link from 'next/link';
import Image from 'next/image';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Edit, Trash2, X, GripVertical, Eye, EyeOff, ExternalLink, Star, Settings, Video, Upload, Sparkles } from 'lucide-react';
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

  const [featuredConfigProduct, setFeaturedConfigProduct] = useState(null);
  const [featuredConfigForm, setFeaturedConfigForm] = useState({
    customTitle: '',
    customSubtitle: '',
    customDescription: '',
    customImage: '',
    customSecondaryImage: '',
    videoUrl: '',
    badgeText: '',
    soldCount: '',
    recentCustomers: '',
  });
  const [featuredConfigSaving, setFeaturedConfigSaving] = useState(false);

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
  const filteredProducts = useMemo(() => {
    const normalizedSearch = searchTerm.toLowerCase();
    return allProducts.filter(product => {
      const matchesSearch = !searchTerm ||
        (product.name || '').toLowerCase().includes(normalizedSearch) ||
        (product.maSanPham || '').toLowerCase().includes(normalizedSearch) ||
        (product.categoryNameVN || '').toLowerCase().includes(normalizedSearch);

      const matchesCategory = !selectedCategory || product.category === selectedCategory;
      const matchesProductLine = !selectedProductLine || product.productLine === selectedProductLine;
      const matchesCollarType = !selectedCollarType || product.collarType === selectedCollarType;

      return matchesSearch && matchesCategory && matchesProductLine && matchesCollarType;
    });
  }, [allProducts, searchTerm, selectedCategory, selectedProductLine, selectedCollarType]);

  useEffect(() => {
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    setDisplayedProducts(filteredProducts.slice(startIndex, endIndex));
    setTotalPages(Math.ceil(filteredProducts.length / limit) || 1);
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
    const currentValue = product[field] === true;
    const nextValue = !currentValue;
    const productKey = product.id ?? product._id;

    setAllProducts((prev) =>
      prev.map((item) => {
        if (String(item.id ?? item._id) === String(productKey)) {
          return { ...item, [field]: nextValue };
        }
        if (field === 'isFeatured' && nextValue === true && item.category === product.category) {
          return { ...item, isFeatured: false };
        }
        return item;
      })
    );

    try {
      await axios.patch('/api/products/visibility', {
        id: productKey,
        field,
        value: nextValue,
      });
      const message = field === 'isFeatured'
        ? (nextValue ? 'Đã chọn làm sản phẩm nổi bật của danh mục' : 'Đã bỏ sản phẩm nổi bật')
        : (nextValue ? 'Đã bật hiển thị' : 'Đã ẩn sản phẩm');
      toast.success(message, { autoClose: 1200 });
    } catch (error) {
      setAllProducts((prev) =>
        prev.map((item) =>
          String(item.id ?? item._id) === String(productKey)
            ? { ...item, [field]: currentValue }
            : item
        )
      );
    }
  };

  const openFeaturedConfigModal = (product) => {
    setFeaturedConfigProduct(product);
    const secImgDefault = Array.isArray(product.gallery) && product.gallery.length > 0
      ? (typeof product.gallery[0] === 'string' ? product.gallery[0] : product.gallery[0]?.src || product.image)
      : (product.image || '');

    setFeaturedConfigForm({
      customTitle: product.featuredConfig?.customTitle || product.name || '',
      customSubtitle: product.featuredConfig?.customSubtitle || product.categoryNameVN || 'Stylish Polo',
      customDescription: product.featuredConfig?.customDescription || product.description || '',
      customImage: product.featuredConfig?.customImage || product.image || '',
      customSecondaryImage: product.featuredConfig?.customSecondaryImage || secImgDefault,
      videoUrl: product.featuredConfig?.videoUrl || '',
      badgeText: product.featuredConfig?.badgeText || 'NỔI BẬT',
      soldCount: product.featuredConfig?.soldCount || '1.500+ sản phẩm',
      recentCustomers: product.featuredConfig?.recentCustomers || 'California Fitness | /feedback/california-fitness, VNPay | https://vnpay.vn, Techcombank',
    });
  };

  const closeFeaturedConfigModal = () => {
    setFeaturedConfigProduct(null);
  };

  const handleSaveFeaturedConfig = async () => {
    if (!featuredConfigProduct) return;
    setFeaturedConfigSaving(true);
    const productKey = featuredConfigProduct.id ?? featuredConfigProduct._id;
    try {
      await axios.post('/api/products/featured-config', {
        id: productKey,
        featuredConfig: featuredConfigForm,
      });

      setAllProducts((prev) =>
        prev.map((item) =>
          String(item.id ?? item._id) === String(productKey)
            ? { ...item, featuredConfig: featuredConfigForm }
            : item
        )
      );

      toast.success('Đã lưu cấu hình sản phẩm nổi bật!', { autoClose: 1500 });
      closeFeaturedConfigModal();
    } catch (error) {
      console.error(error);
      toast.error('Lỗi khi lưu cấu hình nổi bật');
    } finally {
      setFeaturedConfigSaving(false);
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
                    <th className={styles.tableHeader} scope="col">Nổi bật</th>
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
                            <div className="flex items-center gap-1">
                              <button
                                type="button"
                                onClick={() => handleVisibilityToggle(product, 'isFeatured')}
                                className={`p-1.5 rounded-lg border transition-all inline-flex items-center justify-center ${product.isFeatured
                                  ? 'bg-amber-50 border-amber-300 text-amber-500 hover:bg-amber-100'
                                  : 'bg-gray-50 border-gray-200 text-gray-400 hover:bg-gray-100 hover:text-amber-500'
                                  }`}
                                aria-label={`${product.isFeatured ? 'Bỏ' : 'Chọn'} sản phẩm nổi bật`}
                                title={product.isFeatured ? 'Đang là sản phẩm nổi bật của danh mục' : 'Chọn làm sản phẩm nổi bật của danh mục'}
                              >
                                <Star size={16} fill={product.isFeatured ? '#f59e0b' : 'none'} />
                              </button>
                              {product.isFeatured && (
                                <button
                                  type="button"
                                  onClick={() => openFeaturedConfigModal(product)}
                                  className="p-1.5 rounded-lg border border-blue-200 bg-blue-50 text-blue-600 hover:bg-blue-100 transition-all inline-flex items-center justify-center"
                                  title="Cấu hình nội dung tùy chọn (Video, Ảnh, Tiêu đề...)"
                                >
                                  <Settings size={16} />
                                </button>
                              )}
                            </div>
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
                            <div className="flex items-center gap-1">
                              <button
                                type="button"
                                onClick={() => handleVisibilityToggle(product, 'isFeatured')}
                                className={`p-1.5 rounded-lg border transition-all inline-flex items-center justify-center ${product.isFeatured
                                  ? 'bg-amber-50 border-amber-300 text-amber-500 hover:bg-amber-100'
                                  : 'bg-gray-50 border-gray-200 text-gray-400 hover:bg-gray-100 hover:text-amber-500'
                                  }`}
                                aria-label={`${product.isFeatured ? 'Bỏ' : 'Chọn'} sản phẩm nổi bật`}
                                title={product.isFeatured ? 'Đang là sản phẩm nổi bật của danh mục' : 'Chọn làm sản phẩm nổi bật của danh mục'}
                              >
                                <Star size={16} fill={product.isFeatured ? '#f59e0b' : 'none'} />
                              </button>
                              {product.isFeatured && (
                                <button
                                  type="button"
                                  onClick={() => openFeaturedConfigModal(product)}
                                  className="p-1.5 rounded-lg border border-blue-200 bg-blue-50 text-blue-600 hover:bg-blue-100 transition-all inline-flex items-center justify-center"
                                  title="Cấu hình nội dung tùy chọn (Video, Ảnh, Tiêu đề...)"
                                >
                                  <Settings size={16} />
                                </button>
                              )}
                            </div>
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

        {/* Featured Config Modal */}
        {featuredConfigProduct && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" onClick={closeFeaturedConfigModal}>
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden max-h-[90vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
              <div className="flex justify-between items-center px-6 py-4 border-b bg-gray-50">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                    <Settings size={20} />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-gray-900">
                      Cấu hình Sản phẩm Nổi bật
                    </h3>
                    <p className="text-xs text-gray-500">
                      {featuredConfigProduct.name} ({featuredConfigProduct.maSanPham})
                    </p>
                  </div>
                </div>
                <button onClick={closeFeaturedConfigModal} className="text-gray-400 hover:text-gray-700 p-1 rounded-full hover:bg-gray-200">
                  <X size={20} />
                </button>
              </div>

              <div className="p-6 space-y-4 overflow-y-auto flex-1 text-sm">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">
                    Tiêu đề hiển thị tùy chỉnh (Custom Title)
                  </label>
                  <input
                    type="text"
                    placeholder={`Để trống nếu dùng tên mặc định: "${featuredConfigProduct.name}"`}
                    value={featuredConfigForm.customTitle}
                    onChange={(e) => setFeaturedConfigForm(f => ({ ...f, customTitle: e.target.value }))}
                    className="w-full px-3.5 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold text-gray-700 mb-1">
                      Phụ đề / Tagline tùy chỉnh
                    </label>
                    <input
                      type="text"
                      placeholder="VD: Stylish Polo / Premium Sportswear"
                      value={featuredConfigForm.customSubtitle}
                      onChange={(e) => setFeaturedConfigForm(f => ({ ...f, customSubtitle: e.target.value }))}
                      className="w-full px-3.5 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-gray-700 mb-1">
                      Nhãn Badge tùy chỉnh
                    </label>
                    <input
                      type="text"
                      placeholder="VD: SALE 20%, HOT DEAL, BEST SELLER"
                      value={featuredConfigForm.badgeText}
                      onChange={(e) => setFeaturedConfigForm(f => ({ ...f, badgeText: e.target.value }))}
                      className="w-full px-3.5 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold text-gray-700 mb-1">
                      Số lượng đã bán (VD: 1.500+ hoặc 2.000+)
                    </label>
                    <input
                      type="text"
                      placeholder="VD: 1.200+ sản phẩm"
                      value={featuredConfigForm.soldCount}
                      onChange={(e) => setFeaturedConfigForm(f => ({ ...f, soldCount: e.target.value }))}
                      className="w-full px-3.5 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-gray-700 mb-1">
                      Khách hàng đã đặt & Link (Cú pháp: Tên | Link)
                    </label>
                    <input
                      type="text"
                      placeholder="VD: California Fitness | /feedback/california-fitness, VNPay | https://vnpay.vn, Techcombank"
                      value={featuredConfigForm.recentCustomers}
                      onChange={(e) => setFeaturedConfigForm(f => ({ ...f, recentCustomers: e.target.value }))}
                      className="w-full px-3.5 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                    <p className="text-[11px] text-gray-500 mt-1">Cú pháp: <code className="bg-gray-100 px-1 py-0.5 rounded">Tên | Link</code> (Link có thể là bài viết Univi, Website hoặc Facebook).</p>
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-gray-700 mb-1">
                    Mô tả tùy chỉnh (Custom Description)
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Nhập mô tả giới thiệu hoặc khuyến mãi đặc biệt cho khối nổi bật..."
                    value={featuredConfigForm.customDescription}
                    onChange={(e) => setFeaturedConfigForm(f => ({ ...f, customDescription: e.target.value }))}
                    className="w-full px-3.5 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-gray-700 mb-1 flex items-center gap-1.5">
                    <Video size={16} className="text-blue-600" />
                    URL Video sản phẩm (Video MP4 / Cloudinary / YouTube)
                  </label>
                  <input
                    type="text"
                    placeholder="VD: /video-univi-2-baseline.mp4 hoặc https://res.cloudinary.com/.../video.mp4"
                    value={featuredConfigForm.videoUrl}
                    onChange={(e) => setFeaturedConfigForm(f => ({ ...f, videoUrl: e.target.value }))}
                    className="w-full px-3.5 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                  <p className="text-xs text-gray-500 mt-1">Khi có Video, khối hiển thị trên trang chủ sẽ tự động chạy video phát liên tục mượt mà.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold text-gray-700 mb-1">
                      Ảnh chính tùy chỉnh (Custom Main Image URL)
                    </label>
                    <input
                      type="text"
                      placeholder="Để trống nếu dùng ảnh sản phẩm"
                      value={featuredConfigForm.customImage}
                      onChange={(e) => setFeaturedConfigForm(f => ({ ...f, customImage: e.target.value }))}
                      className="w-full px-3.5 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-xs"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-gray-700 mb-1">
                      Ảnh phụ/Flatlay (Custom Secondary Image URL)
                    </label>
                    <input
                      type="text"
                      placeholder="Để trống nếu dùng ảnh thứ 2"
                      value={featuredConfigForm.customSecondaryImage}
                      onChange={(e) => setFeaturedConfigForm(f => ({ ...f, customSecondaryImage: e.target.value }))}
                      className="w-full px-3.5 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-xs"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 px-6 py-4 border-t bg-gray-50">
                <button
                  type="button"
                  onClick={closeFeaturedConfigModal}
                  className="px-4 py-2 text-gray-700 hover:bg-gray-200 rounded-lg font-medium transition-colors"
                  disabled={featuredConfigSaving}
                >
                  Hủy bỏ
                </button>
                <button
                  type="button"
                  onClick={handleSaveFeaturedConfig}
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold shadow transition-colors flex items-center gap-2"
                  disabled={featuredConfigSaving}
                >
                  <Sparkles size={16} />
                  <span>{featuredConfigSaving ? 'Đang lưu...' : 'Lưu cấu hình'}</span>
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
