import type { ActivityId } from "./activities";
import type { PersonalityId } from "./personalities";
import type { StyleId } from "./styles";

/**
 * The direction is *derived*, not generated.
 *
 * Three answers already given — activity, personality, style — resolve to one
 * concept board through a fixed set of rules. No model, no randomness, no logo:
 * the same three answers always produce the same direction, which is what makes
 * it a proposal a designer can defend rather than a slot machine.
 */

export type VariantId = "core" | "warm" | "quiet";
export type PatternId =
  "grid" | "weave" | "arcs" | "chevron" | "dots" | "waves";
export type IconStyleId = "hairline" | "geometric" | "rounded" | "solid";

export type Swatch = { name: string; hex: string };

export type Typography = {
  /** Tailwind classes, so the sample is set in the real thing, not a picture of it. */
  displayClass: string;
  bodyClass: string;
  latinClass: string;
  displayName: string;
  bodyName: string;
  note: string;
};

export type Direction = {
  variant: VariantId;
  primary: [Swatch, Swatch];
  secondary: [Swatch, Swatch, Swatch];
  typography: Typography;
  pattern: PatternId;
  iconStyle: IconStyleId;
  /** Placeholder names shown on the board — never a real brand. */
  arabicName: string;
  latinName: string;
  /** One line a director would write under the board. */
  rationale: string;
};

/* ------------------------------------------------------------------ colour */

function clamp(value: number) {
  return Math.max(0, Math.min(255, Math.round(value)));
}

function toRgb(hex: string): [number, number, number] {
  const clean = hex.replace("#", "");
  return [
    parseInt(clean.slice(0, 2), 16),
    parseInt(clean.slice(2, 4), 16),
    parseInt(clean.slice(4, 6), 16),
  ];
}

function toHex([r, g, b]: [number, number, number]) {
  return `#${[r, g, b].map((c) => clamp(c).toString(16).padStart(2, "0")).join("")}`.toUpperCase();
}

/** Deterministic blend — the only "cleverness" in the whole engine. */
function blend(a: string, b: string, amount: number) {
  const [r1, g1, b1] = toRgb(a);
  const [r2, g2, b2] = toRgb(b);
  return toHex([
    r1 + (r2 - r1) * amount,
    g1 + (g2 - g1) * amount,
    b1 + (b2 - b1) * amount,
  ]);
}

/* ------------------------------------------------------------- style bases */

type StyleBase = {
  ink: string;
  surface: string;
  neutral: string;
  pattern: PatternId;
  iconStyle: IconStyleId;
  typography: Typography;
};

const STYLE_BASE: Record<StyleId, StyleBase> = {
  minimal: {
    ink: "#101314",
    surface: "#F6F4F0",
    neutral: "#C9C7C1",
    pattern: "grid",
    iconStyle: "hairline",
    typography: {
      displayClass: "font-body font-semibold tracking-tight",
      bodyClass: "font-body font-light",
      latinClass: "font-body tracking-[0.18em]",
      displayName: "عائلة واحدة · وزن ثقيل",
      bodyName: "عائلة واحدة · وزن خفيف",
      note: "خط واحد بأوزان مختلفة. لا زخرفة، والفراغ هو العنصر الأهم.",
    },
  },
  luxury: {
    ink: "#0A0E14",
    surface: "#F3EBDD",
    neutral: "#8A7A5F",
    pattern: "arcs",
    iconStyle: "hairline",
    typography: {
      displayClass: "font-display font-extrabold",
      bodyClass: "font-body font-light leading-loose",
      latinClass: "font-latin tracking-[0.42em]",
      displayName: "عربي عريض · Almarai",
      bodyName: "لاتيني كلاسيكي · Cormorant",
      note: "تباين هادئ بين عربي عريض ولاتيني كلاسيكي، ومسافات واسعة تصنع الهيبة.",
    },
  },
  modern: {
    ink: "#0E1116",
    surface: "#EDF1F5",
    neutral: "#7F8B98",
    pattern: "chevron",
    iconStyle: "geometric",
    typography: {
      displayClass: "font-display font-bold tracking-tight",
      bodyClass: "font-body font-normal",
      latinClass: "font-body font-medium tracking-[0.24em]",
      displayName: "هندسي · وزن ثقيل",
      bodyName: "محايد · وزن متوسط",
      note: "تتبّع ضيّق وحواف حادة. الإيقاع سريع والقرارات واضحة.",
    },
  },
  classic: {
    ink: "#241A11",
    surface: "#EFE3CE",
    neutral: "#A08A6A",
    pattern: "weave",
    iconStyle: "solid",
    typography: {
      displayClass: "font-display font-bold tracking-wide",
      bodyClass: "font-body font-light leading-loose",
      latinClass: "font-latin tracking-[0.34em]",
      displayName: "وقور · تتبّع واسع",
      bodyName: "نص طويل · مريح للقراءة",
      note: "تناظر وتتبّع واسع، وحدود محسوبة. علامة تبدو كأنها هنا منذ زمن.",
    },
  },
  bold: {
    ink: "#0B0B0C",
    surface: "#F5F5F2",
    neutral: "#6E6E70",
    pattern: "dots",
    iconStyle: "solid",
    typography: {
      displayClass: "font-display font-extrabold tracking-tighter",
      bodyClass: "font-body font-medium",
      latinClass: "font-display font-extrabold tracking-[0.08em]",
      displayName: "ضخم · تباين حاد",
      bodyName: "نص قصير · واضح",
      note: "فرق كبير بين حجم العنوان وحجم النص. الرسالة تُقرأ من بعيد.",
    },
  },
  elegant: {
    ink: "#15161A",
    surface: "#EFE7DA",
    neutral: "#9B8F7E",
    pattern: "waves",
    iconStyle: "rounded",
    typography: {
      displayClass: "font-display font-bold tracking-wide",
      bodyClass: "font-body font-light leading-loose",
      latinClass: "font-latin tracking-[0.46em]",
      displayName: "رفيع · مسافات واسعة",
      bodyName: "خفيف · أسطر متباعدة",
      note: "أوزان خفيفة ومسافات كريمة. الأناقة في ما لا يُرى أولًا.",
    },
  },
};

/* ------------------------------------------------------- personality accent */

const PERSONALITY_ACCENT: Record<PersonalityId, { hex: string; name: string }> =
  {
    luxury: { hex: "#C9A227", name: "ذهبي" },
    modern: { hex: "#6E8FB3", name: "أزرق فولاذي" },
    warm: { hex: "#D98452", name: "طيني دافئ" },
    bold: { hex: "#D6453F", name: "أحمر حادّ" },
    trusted: { hex: "#3F5D50", name: "أخضر عميق" },
    heritage: { hex: "#7A5A2E", name: "برونزي" },
    playful: { hex: "#E0A030", name: "كهرماني" },
    innovative: { hex: "#5A7BE0", name: "أزرق كهربائي" },
  };

/* ----------------------------------------------------- activity name blocks */

const ACTIVITY_NAMES: Record<ActivityId, { ar: string; en: string }> = {
  store: { ar: "اسم متجرك", en: "YOUR STORE" },
  restaurant: { ar: "اسم مطعمك", en: "YOUR RESTAURANT" },
  office: { ar: "اسم مكتبك", en: "YOUR FIRM" },
  clinic: { ar: "اسم عيادتك", en: "YOUR CLINIC" },
  services: { ar: "اسم شركتك", en: "YOUR COMPANY" },
  other: { ar: "اسم مشروعك", en: "YOUR BRAND" },
};

/* ---------------------------------------------------------------- variants */

export const VARIANTS: Array<{ id: VariantId; label: string; note: string }> = [
  { id: "core", label: "الاتجاه الأساسي", note: "الترجمة المباشرة لاختياراتك" },
  { id: "warm", label: "بديل أدفأ", note: "نفس الاتجاه بحرارة أعلى" },
  { id: "quiet", label: "بديل أهدأ", note: "نفس الاتجاه بصوت أخفض" },
];

const WARM_PULL = "#D98452";
const QUIET_PULL = "#6B6A66";

/**
 * The one public entry point: three answers in, one board out.
 */
export function buildDirection(
  activity: ActivityId,
  personality: PersonalityId,
  style: StyleId,
  variant: VariantId = "core",
): Direction {
  const base = STYLE_BASE[style];
  const accent = PERSONALITY_ACCENT[personality];
  const names = ACTIVITY_NAMES[activity];

  const accentHex =
    variant === "warm"
      ? blend(accent.hex, WARM_PULL, 0.32)
      : variant === "quiet"
        ? blend(accent.hex, QUIET_PULL, 0.38)
        : accent.hex;

  const inkHex =
    variant === "warm"
      ? blend(base.ink, "#3A2418", 0.18)
      : variant === "quiet"
        ? blend(base.ink, "#1B1F24", 0.22)
        : base.ink;

  const surfaceHex =
    variant === "warm"
      ? blend(base.surface, "#F0DFC6", 0.45)
      : variant === "quiet"
        ? blend(base.surface, "#E6E6E4", 0.5)
        : base.surface;

  return {
    variant,
    primary: [
      { name: "اللون الأساسي", hex: inkHex },
      { name: `اللون المميّز · ${accent.name}`, hex: accentHex },
    ],
    secondary: [
      { name: "السطح", hex: surfaceHex },
      { name: "محايد", hex: base.neutral },
      { name: "ظل اللون المميّز", hex: blend(accentHex, inkHex, 0.55) },
    ],
    typography: base.typography,
    pattern: base.pattern,
    iconStyle: base.iconStyle,
    arabicName: names.ar,
    latinName: names.en,
    rationale: base.typography.note,
  };
}
