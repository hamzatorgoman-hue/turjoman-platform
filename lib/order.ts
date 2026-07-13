import type { ActivityId } from "./activities";
import type { VariantId } from "./identity-direction";
import type { PackageId } from "./packages";
import type { PersonalityId } from "./personalities";
import type { StyleId } from "./styles";

/**
 * A request to begin, not a checkout.
 *
 * The founder is asked for three things and three only. Everything else — the
 * activity, the personality, the style, the direction, the package — was already
 * decided in this session and is attached automatically. Asking again would say
 * we weren't listening.
 */

export type OrderDraft = {
  projectName: string;
  fullName: string;
  phone: string;
  notes: string;
};

export const EMPTY_DRAFT: OrderDraft = {
  projectName: "",
  fullName: "",
  phone: "",
  notes: "",
};

export type OrderField = keyof OrderDraft;

export type OrderErrors = Partial<Record<OrderField, string>>;

/** What the journey already knows. Never re-asked. */
export type OrderContext = {
  activity: ActivityId;
  personality: PersonalityId;
  style: StyleId;
  direction: VariantId;
  packageId: PackageId;
};

export type OrderRequest = OrderDraft & {
  context: OrderContext;
  /** ISO timestamp, set when the request is assembled. */
  preparedAt: string;
};

/**
 * Saudi mobile numbers: 05XXXXXXXX locally, or +9665XXXXXXXX / 9665XXXXXXXX.
 * Spaces and dashes are the founder's business, not ours — we strip them.
 */
export function normalizePhone(input: string): string {
  return input.replace(/[\s-()]/g, "").replace(/^00/, "+");
}

export function isValidSaudiMobile(input: string): boolean {
  const value = normalizePhone(input);
  return /^(?:\+966|966|0)?5\d{8}$/.test(value);
}

/** To E.164, so the number is stored once, in one shape. */
export function toE164(input: string): string {
  const value = normalizePhone(input)
    .replace(/^\+?966/, "")
    .replace(/^0/, "");
  return `+966${value}`;
}

export function validateDraft(draft: OrderDraft): OrderErrors {
  const errors: OrderErrors = {};

  if (draft.projectName.trim().length < 2) {
    errors.projectName = "اكتب اسم المشروع كما تريده أن يظهر.";
  }

  if (draft.fullName.trim().length < 2) {
    errors.fullName = "اكتب اسمك حتى نعرف بمن نتواصل.";
  }

  if (!draft.phone.trim()) {
    errors.phone = "نحتاج رقم جوالك للتواصل معك.";
  } else if (!isValidSaudiMobile(draft.phone)) {
    errors.phone = "الرقم غير صحيح. مثال: 05XXXXXXXX";
  }

  return errors;
}

export function buildOrderRequest(
  draft: OrderDraft,
  context: OrderContext,
): OrderRequest {
  return {
    projectName: draft.projectName.trim(),
    fullName: draft.fullName.trim(),
    phone: toE164(draft.phone),
    notes: draft.notes.trim(),
    context,
    preparedAt: new Date().toISOString(),
  };
}
