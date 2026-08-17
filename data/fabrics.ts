// Fabric catalog metadata for the /bang-mau fabric color library.
// Data source: internal Univi fabric color catalogs (POLO/QUICKDRY/SUPERCOOL/UNIAIR reference sheets).

export interface Fabric {
  slug: string;
  name: string;
  composition: string;
  weight: string;
  description: string;
  colorCount: number;
}

export const fabrics: Fabric[] = [
  {
    slug: "polo-ca-sau",
    name: "Polo Cá Sấu",
    composition: "86% Polyamide / 14% Elastane",
    weight: "180g",
    description: "Vải cá sấu cao cấp, bề mặt mềm mịn, form dáng chuẩn, thoáng khí — lựa chọn phổ biến cho áo polo doanh nghiệp và đồng phục thể thao.",
    colorCount: 38,
  },
  {
    slug: "quickdry",
    name: "QuickDry",
    composition: "88% Polyester / 12% Elastane",
    weight: "170g",
    description: "Vải thể thao nhẹ, khô nhanh, co giãn 4 chiều, chống tia UV — phù hợp cho Gym, Running, Pickleball, Tennis.",
    colorCount: 40,
  },
  {
    slug: "supercool",
    name: "SuperCool",
    composition: "89% Polyamide / 11% Elastane",
    weight: "180g",
    description: "Dòng vải thể thao cao cấp, mềm mát, mịn, co giãn tốt, chống nhăn, bền form — phù hợp Yoga, Pilates, Dance, Aerobic.",
    colorCount: 78,
  },
  {
    slug: "uniair",
    name: "UniAir",
    composition: "Vải lỗ thoáng khí UNI-A12",
    weight: ">50 lỗ thoáng khí/cm²",
    description: "Vải lỗ thoáng khí chuyên dụng với mật độ trên 50 lỗ thoáng khí/cm², tối ưu độ thoáng cho vận động cường độ cao.",
    colorCount: 19,
  },
];

export function getFabricBySlug(slug: string): Fabric | undefined {
  return fabrics.find((f) => f.slug === slug);
}
