/**
 * The six activities a founder can launch through Turjoman.
 * Order is RTL-first: `store` is the right-most card, `other` the left-most.
 */

export type ActivityId =
  "store" | "restaurant" | "office" | "clinic" | "services" | "other";

export type Activity = {
  id: ActivityId;
  /** Card label. */
  label: string;
  /** One line, shown on hover and to screen readers — what this path covers. */
  hint: string;
};

export const ACTIVITIES: Activity[] = [
  { id: "store", label: "متجر", hint: "تجزئة، متجر إلكتروني، أو معرض" },
  { id: "restaurant", label: "مطعم", hint: "مطعم، مقهى، أو مشروع أغذية" },
  { id: "office", label: "مكتب", hint: "استشارات، محاماة، أو خدمات مهنية" },
  { id: "clinic", label: "عيادة", hint: "طب، أسنان، أو مركز تجميل" },
  { id: "services", label: "خدمات", hint: "مقاولات، صيانة، أو نقل" },
  { id: "other", label: "أنشطة أخرى", hint: "نشاطك غير مدرج؟ ابدأ من هنا" },
];

export function getActivity(id: ActivityId): Activity {
  const found = ACTIVITIES.find((activity) => activity.id === id);
  if (!found) throw new Error(`Unknown activity: ${id}`);
  return found;
}
