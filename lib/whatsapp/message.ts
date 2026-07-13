import { ACTIVITIES } from "@/lib/activities";
import { VARIANTS } from "@/lib/identity-direction";
import { PACKAGES } from "@/lib/packages";
import { PERSONALITIES } from "@/lib/personalities";
import { STYLES } from "@/lib/styles";

/**
 * The WhatsApp message is built from the order **as it was stored** — never from
 * the form. By the time this runs the row exists, the phone has been normalised,
 * and every choice has been checked against the ids we actually offer. Anything
 * the client claimed and the database rejected is, correctly, not in here.
 */

export type StoredOrder = {
  reference: string;
  projectName: string;
  customerName: string;
  mobile: string;
  notes: string | null;
  activity: string;
  personality: string;
  style: string;
  package: string;
  direction: string;
};

/** Ids are for machines. The studio reads Arabic. */
function label(
  list: ReadonlyArray<{ id: string; label: string }>,
  id: string,
): string {
  return list.find((item) => item.id === id)?.label ?? id;
}

function packageLine(id: string): string {
  const tier = PACKAGES.find((item) => item.id === id);
  if (!tier) return id;
  return `${tier.label} (${tier.price} ${tier.currency})`;
}

export const SIGNATURE = "تم إنشاء هذا الطلب عبر منصة ترجمان.";

/**
 * Written in the founder's voice, because the founder is the one sending it.
 * The studio receives a message it can act on without opening a dashboard.
 */
export function buildOrderMessage(order: StoredOrder): string {
  const lines = [
    "السلام عليكم، أرسلت طلبًا عبر منصة ترجمان.",
    "",
    `رقم الطلب: ${order.reference}`,
    `المشروع: ${order.projectName}`,
    `الاسم: ${order.customerName}`,
    `الجوال: ${order.mobile}`,
    "",
    `النشاط: ${label(ACTIVITIES, order.activity)}`,
    `الشخصية: ${label(PERSONALITIES, order.personality)}`,
    `الأسلوب: ${label(STYLES, order.style)}`,
    `الاتجاه: ${label(VARIANTS, order.direction)}`,
    `الباقة: ${packageLine(order.package)}`,
  ];

  const notes = order.notes?.trim();
  if (notes) {
    lines.push("", `ملاحظات: ${notes}`);
  }

  lines.push("", SIGNATURE);

  return lines.join("\n");
}
