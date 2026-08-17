// Helper function to get products by category from database
import db from '../utils/db';
import Product from '../models/Product';
import { computeGymTaxonomyCounts } from './gymTaxonomyCounts';
import { computeEnterpriseTaxonomyCounts } from './enterpriseTaxonomyCounts';

const CATEGORY_COUNT_SLUGS = [
  'dong-phuc-gym', 'dong-phuc-yoga-pilates', 'dong-phuc-pickleball',
  'dong-phuc-chay-bo', 'dong-phuc-mma', 'dong-phuc-golf-tennis',
  'dong-phuc-ao-polo', 'dong-phuc-cong-so', 'dong-phuc-team-building',
  'dong-phuc-ao-gio', 'dong-phuc-ao-thun', 'dong-phuc-le-tan', 'dong-phuc-su-kien',
  'dong-phuc-doanh-nghiep',
];

// Keep image paths as-is, let components handle URL conversion
// (same logic as san-pham/[slug] page)
const toLocalImageUrl = (imagePath) => {
  // Return as-is, components will handle conversion
  return imagePath || '/images/placeholder.jpg';
};

// Fetch products data from database
async function getProductsData() {
  try {
    await db.connectDb();
    const products = await Product.find({}).sort({ displayOrder: 1, createdAt: -1 }).lean();
    return products || [];
  } catch (error) {
    console.error('Error fetching products from database:', error);
    return [];
  }
}

export async function getProductsByCategory(categorySlug) {
  const productsData = await getProductsData();
  
  if (!categorySlug) {
    // Return all products if no category specified
    return productsData
      .filter(product => product.visibleOnArticle !== false)
      .map(product => ({
        id: product.id,
        maSanPham: product.maSanPham || '',
        name: product.name,
        price: product.price,
        maxPrice: product.originalPrice || 0,
        originalPrice: product.originalPrice,
        description: product.description,
        image: toLocalImageUrl(product.image),
        slug: product.slug,
        colors: Array.isArray(product.colors)
          ? product.colors.map(color => ({
            name: color.name,
            hex: color.hex,
            hex2: color.hex2 || '',
            image: toLocalImageUrl(color.image)
          }))
          : [],
        isNew: product.isNew || false,
        isFeatured: product.isFeatured || false,
        discount: product.originalPrice ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) : 0,
        category: product.category,
        categoryNameVN: product.categoryNameVN,
        productLine: product.productLine || '',
        collarType: product.collarType || '',
        rating: product.rating || 0,
        reviewCount: product.reviewCount || 0,
        material: product.material || '',
        visibleOnHome: product.visibleOnHome !== false,
        visibleOnArticle: product.visibleOnArticle !== false,
      }));
  }

  // Filter products by category
  const filtered = productsData.filter(
    product => product.category === categorySlug && product.visibleOnArticle !== false
  );

  return filtered.map(product => ({
    id: product.id,
    maSanPham: product.maSanPham || '',
    name: product.name,
    price: product.price,
    maxPrice: product.originalPrice || 0,
    originalPrice: product.originalPrice,
    description: product.description,
    image: toLocalImageUrl(product.image),
    slug: product.slug,
    colors: Array.isArray(product.colors)
      ? product.colors.map(color => ({
          name: color.name,
          hex: color.hex,
          hex2: color.hex2 || '',
          image: toLocalImageUrl(color.image)
        }))
      : [],
    isNew: product.isNew || false,
    isFeatured: product.isFeatured || false,
    discount: product.originalPrice ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) : 0,
    category: product.category,
    categoryNameVN: product.categoryNameVN,
    productLine: product.productLine || '',
    collarType: product.collarType || '',
    rating: product.rating || 0,
    reviewCount: product.reviewCount || 0,
    material: product.material || '',
    visibleOnHome: product.visibleOnHome !== false,
    visibleOnArticle: product.visibleOnArticle !== false,
  }));
}

// Sản phẩm thuộc một dòng sản phẩm (productLine) cụ thể trong category
export async function getProductsByCategoryAndLine(categorySlug, productLine) {
  const products = await getProductsByCategory(categorySlug);
  return products.filter(product => product.productLine === productLine);
}

// Sản phẩm thuộc một dòng sản phẩm + kiểu cổ cụ thể trong category
export async function getProductsByCategoryLineAndCollar(categorySlug, productLine, collarType) {
  const products = await getProductsByCategory(categorySlug);
  return products.filter(
    product => product.productLine === productLine && product.collarType === collarType
  );
}

export async function getAllProducts() {
  return await getProductsByCategory(null);
}

export async function getAllCategoryCounts() {
  const productsData = await getProductsData();
  const counts = {};
  for (const slug of CATEGORY_COUNT_SLUGS) {
    counts[slug] = productsData.filter(
      (p) => p.category === slug && p.visibleOnArticle !== false
    ).length;
  }
  return counts;
}

// Sidebar "Danh mục sản phẩm" dùng chung cho cả nhóm Đồng phục Thể thao và
// Đồng phục Doanh nghiệp cần cả 3 loại dữ liệu đếm cùng lúc (categoryCounts,
// gymCounts, enterpriseCounts). Gộp vào 1 lần quét Product duy nhất thay vì gọi
// getAllCategoryCounts() + getProductsByCategory('dong-phuc-gym') +
// getProductsByCategory('dong-phuc-doanh-nghiep') riêng lẻ trên từng trang.
export async function getSidebarNavCounts() {
  const productsData = await getProductsData();
  const isVisible = (p) => p.visibleOnArticle !== false;

  const categoryCounts = {};
  for (const slug of CATEGORY_COUNT_SLUGS) {
    categoryCounts[slug] = productsData.filter((p) => p.category === slug && isVisible(p)).length;
  }

  const gymProducts = productsData.filter((p) => p.category === 'dong-phuc-gym' && isVisible(p));
  const enterpriseProducts = productsData.filter(
    (p) => p.category === 'dong-phuc-doanh-nghiep' && isVisible(p)
  );

  return {
    categoryCounts,
    gymCounts: computeGymTaxonomyCounts(gymProducts),
    enterpriseCounts: computeEnterpriseTaxonomyCounts(enterpriseProducts),
  };
}
