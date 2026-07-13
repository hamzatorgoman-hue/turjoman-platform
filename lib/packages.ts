/**
 * Three packages, built on the same craft.
 *
 * They are not three qualities — they are three depths of service. Each one
 * contains the previous one whole, so the founder is never asked to weigh what
 * they lose, only what they add. That is why nothing here is ever crossed out.
 */

export type PackageId = "starter" | "professional" | "launch";

export type PackageTier = {
  id: PackageId;
  label: string;
  /** The Latin line on the card — quiet, not decorative. */
  latin: string;
  /** Who it is right for. Said plainly, so the wrong founder self-selects out. */
  perfectFor: string;
  price: number;
  currency: string;
  /** What this package adds on top of the one before it. */
  adds: string[];
  /** Named on the card only for the tier it inherits from. */
  inherits?: PackageId;
  /** The one tier we point at — once, quietly. */
  recommended?: boolean;
  /** Reserved space on the card. Deliberately undescribed. */
  reserved?: boolean;
};

export const PACKAGES: PackageTier[] = [
  {
    id: "starter",
    label: "الأساسية",
    latin: "Starter",
    perfectFor: "مشروع جديد",
    price: 300,
    currency: "ريال",
    adds: ["الهوية الأساسية", "الملفات الأساسية", "استخدام رقمي"],
  },
  {
    id: "professional",
    label: "الاحترافية",
    latin: "Professional",
    perfectFor: "الشركات الناشئة",
    price: 600,
    currency: "ريال",
    inherits: "starter",
    recommended: true,
    adds: ["المطبوعات", "النظام البصري", "دليل استخدام الهوية"],
  },
  {
    id: "launch",
    label: "إطلاق النشاط",
    latin: "Business Launch",
    perfectFor: "إطلاق مشروع متكامل",
    price: 1200,
    currency: "ريال",
    inherits: "professional",
    reserved: true,
    adds: ["إجراءات إطلاق النشاط", "تجهيز ملفات البداية", "دعم الانطلاق"],
  },
];

export function getPackage(id: PackageId): PackageTier {
  const found = PACKAGES.find((tier) => tier.id === id);
  if (!found) throw new Error(`Unknown package: ${id}`);
  return found;
}

/**
 * The comparison, when the founder asks for it.
 *
 * Rows are things that are *included*, never things that are missing: a tier
 * that does not carry a row simply shows nothing there. No crosses, no red.
 */
export type CompareRow = {
  label: string;
  in: PackageId[];
};

export const COMPARE_ROWS: CompareRow[] = [
  {
    label: "الشعار النهائي بجميع نسخه",
    in: ["starter", "professional", "launch"],
  },
  { label: "لوحة الألوان والخطوط", in: ["starter", "professional", "launch"] },
  { label: "ملفات SVG وPNG", in: ["starter", "professional", "launch"] },
  {
    label: "ملفات رقمية للاستخدام المباشر",
    in: ["starter", "professional", "launch"],
  },
  { label: "دليل استخدام الهوية", in: ["professional", "launch"] },
  { label: "أيقونات الهوية والنمط البصري", in: ["professional", "launch"] },
  { label: "صور الحسابات الاجتماعية", in: ["professional", "launch"] },
  { label: "بطاقة العمل والورق الرسمي والظرف", in: ["professional", "launch"] },
  { label: "ملفات PDF جاهزة للطباعة", in: ["professional", "launch"] },
  { label: "إجراءات إطلاق النشاط", in: ["launch"] },
  { label: "تجهيز ملفات البداية", in: ["launch"] },
  { label: "دعم الانطلاق", in: ["launch"] },
];
