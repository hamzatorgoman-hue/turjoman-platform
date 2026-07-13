import type { MockupKind } from "@/components/mockups/MockupSurface";

/**
 * The gallery, in the order a founder pictures their business: what they hand
 * over, what hangs above the door, what a customer carries home, what drives
 * around the city, what people see on their phone.
 */
export type MockupItem = {
  kind: MockupKind;
  label: string;
  note: string;
};

export const MOCKUPS: MockupItem[] = [
  { kind: "card", label: "بطاقة العمل", note: "أول ما يبقى في يد العميل" },
  {
    kind: "sign",
    label: "لوحة المحل",
    note: "الهوية على الواجهة، ليلًا ونهارًا",
  },
  { kind: "cup", label: "الكوب", note: "الهوية على ما يُمسَك يوميًا" },
  { kind: "bag", label: "الكيس", note: "علامتك تمشي في الشارع" },
  { kind: "box", label: "علبة التغليف", note: "لحظة الفتح تصنع الانطباع" },
  { kind: "uniform", label: "الزي", note: "فريقك جزء من العلامة" },
  { kind: "vehicle", label: "المركبة", note: "إعلان متحرك بلا تكلفة إضافية" },
  {
    kind: "social",
    label: "حسابك في السوشيال",
    note: "الواجهة الرقمية لمشروعك",
  },
];
