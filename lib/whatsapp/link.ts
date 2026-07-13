/**
 * Every WhatsApp URL in the codebase is built here. No component, and no store,
 * ever assembles one.
 */

export type Platform = "ios" | "android" | "desktop";

/**
 * wa.me behaves on all three: it hands off to the installed app, and falls back
 * to WhatsApp Web when there isn't one. On desktop we go straight to
 * web.whatsapp.com, because wa.me there is an extra hop through an interstitial.
 */
export function buildWhatsAppUrl(input: {
  number: string;
  message: string;
  platform: Platform;
}): string {
  const number = input.number.replace(/\D/g, "");
  const text = encodeURIComponent(input.message);

  if (input.platform === "desktop") {
    return `https://web.whatsapp.com/send?phone=${number}&text=${text}`;
  }

  return `https://wa.me/${number}?text=${text}`;
}

export function detectPlatform(userAgent?: string): Platform {
  const ua = (
    userAgent ?? (typeof navigator !== "undefined" ? navigator.userAgent : "")
  ).toLowerCase();

  if (/iphone|ipad|ipod/.test(ua)) return "ios";
  if (/android/.test(ua)) return "android";
  return "desktop";
}
