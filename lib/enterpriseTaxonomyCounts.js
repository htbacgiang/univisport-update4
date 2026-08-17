import { productTaxonomy } from './productTaxonomy';

const CATEGORY_SLUG = 'dong-phuc-doanh-nghiep';

// Tính số lượng sản phẩm thật theo từng category con (productLine) của
// Đồng phục Doanh nghiệp dựa trên dữ liệu sản phẩm đã fetch từ DB
// (không hard-code số lượng). Mirror của computeGymTaxonomyCounts, tách riêng
// vì Đồng phục Doanh nghiệp là một business group độc lập, không thuộc Gym.
export function computeEnterpriseTaxonomyCounts(enterpriseProducts = []) {
  const lines = productTaxonomy[CATEGORY_SLUG]?.productLines || {};

  const lineEntries = Object.entries(lines).map(([slug, cfg]) => {
    const lineProducts = enterpriseProducts.filter((p) => p.productLine === slug);
    return {
      slug,
      label: cfg.label,
      count: lineProducts.length,
      image: lineProducts[0]?.image || null,
    };
  });

  return {
    total: enterpriseProducts.length,
    lines: lineEntries,
  };
}
