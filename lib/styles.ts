/**
 * Style direction — the design language the identity will be built in.
 *
 * These are material boards, not templates. Each one is a promise about how the
 * work will feel, written the way a creative director would say it out loud.
 */

export type StyleId =
  "minimal" | "luxury" | "modern" | "classic" | "bold" | "elegant";

export type Style = {
  id: StyleId;
  label: string;
  /** One sentence. Emotional, not descriptive. */
  line: string;
};

export const STYLES: Style[] = [
  {
    id: "minimal",
    label: "بسيط",
    line: "مساحة تتنفّس، ولا شيء زائد. رسالتك تصل من أول نظرة.",
  },
  {
    id: "luxury",
    label: "فاخر",
    line: "ذهب هادئ على سواد عميق. الفخامة تُقال بصوت منخفض.",
  },
  {
    id: "modern",
    label: "عصري",
    line: "خطوط حادّة وإيقاع سريع. تبدو كأنك تسبق السوق بخطوة.",
  },
  {
    id: "classic",
    label: "كلاسيكي",
    line: "اتزان ووقار. علامة تبدو كأنها هنا منذ زمن طويل.",
  },
  {
    id: "bold",
    label: "جريء",
    line: "تباين لا يمكن تجاهله. من يراك مرة واحدة، يتذكّرك.",
  },
  {
    id: "elegant",
    label: "أنيق",
    line: "تفاصيل رقيقة ودقّة محسوبة. الأناقة فيما لا يُرى أولًا.",
  },
];

export function getStyle(id: StyleId): Style {
  const found = STYLES.find((style) => style.id === id);
  if (!found) throw new Error(`Unknown style: ${id}`);
  return found;
}
