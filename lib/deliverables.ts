/**
 * What is actually handed over.
 *
 * Every line here is something the studio produces and delivers. Nothing is
 * padded, nothing is inflated, and nothing is listed that a founder could open
 * the folder and fail to find. The notes exist to *narrow* each promise, not to
 * dress it up.
 */

export type DeliverableIconId =
  | "logo"
  | "guidelines"
  | "palette"
  | "type"
  | "svg"
  | "pdf"
  | "png"
  | "icons"
  | "pattern"
  | "social"
  | "card"
  | "letterhead"
  | "envelope"
  | "profile"
  | "print"
  | "digital";

export type Deliverable = {
  id: DeliverableIconId;
  label: string;
  /** One line. What it is, and what it is not. */
  note: string;
};

export type DeliverableGroup = {
  id: string;
  title: string;
  lead: string;
  items: Deliverable[];
};

export const DELIVERABLE_GROUPS: DeliverableGroup[] = [
  {
    id: "core",
    title: "الهوية نفسها",
    lead: "الأساس الذي يُبنى عليه كل ما بعده.",
    items: [
      {
        id: "logo",
        label: "الشعار النهائي بجميع نسخه",
        note: "أفقي، عمودي، مربّع، ونسخة أحادية اللون",
      },
      {
        id: "guidelines",
        label: "دليل استخدام الهوية",
        note: "المسافات، الاستخدامات الممنوعة، والحد الأدنى للحجم",
      },
      {
        id: "palette",
        label: "لوحة الألوان الرسمية",
        note: "قيم HEX وRGB وCMYK لكل لون",
      },
      {
        id: "type",
        label: "الخطوط المعتمدة",
        note: "العربي واللاتيني، مع أوزانها وحالات استخدامها",
      },
    ],
  },
  {
    id: "files",
    title: "الملفات",
    lead: "بصيغ تفتحها المطابع والمصمّمون دون سؤال.",
    items: [
      {
        id: "svg",
        label: "ملفات SVG",
        note: "متجهية، تكبّر بلا حدود ودون فقدان جودة",
      },
      {
        id: "pdf",
        label: "ملفات PDF للطباعة",
        note: "جاهزة للمطبعة مباشرة",
      },
      {
        id: "png",
        label: "ملفات PNG بخلفيات مختلفة",
        note: "شفافة، فاتحة، وداكنة",
      },
      {
        id: "print",
        label: "ملفات جاهزة للطباعة",
        note: "بمقاسات ودقّة الطباعة المطلوبة",
      },
      {
        id: "digital",
        label: "ملفات رقمية للاستخدام المباشر",
        note: "للموقع والتطبيقات ومنصات التواصل",
      },
    ],
  },
  {
    id: "system",
    title: "النظام البصري",
    lead: "ما يجعل علامتك تُعرَف حتى بدون شعارها.",
    items: [
      {
        id: "icons",
        label: "أيقونات الهوية",
        note: "مرسومة بلغة واحدة تتبع أسلوب علامتك",
      },
      {
        id: "pattern",
        label: "النمط البصري",
        note: "نقش قابل للتكرار على أي سطح أو مقاس",
      },
      {
        id: "social",
        label: "صور الحسابات الاجتماعية",
        note: "صورة الحساب وصورة الغلاف بمقاسات المنصات",
      },
    ],
  },
  {
    id: "print",
    title: "المطبوعات",
    lead: "ما يبقى في يد العميل بعد أن يغادر.",
    items: [
      {
        id: "card",
        label: "بطاقة العمل",
        note: "وجهان، جاهزان للطباعة",
      },
      {
        id: "letterhead",
        label: "تصميم الورق الرسمي",
        note: "ترويسة A4 للعقود والخطابات",
      },
      {
        id: "envelope",
        label: "تصميم الظرف",
        note: "بمقاس DL القياسي",
      },
      {
        id: "profile",
        label: "ملف تعريف الهوية",
        note: "عرض يجمع الهوية وتطبيقاتها في مستند واحد",
      },
    ],
  },
];

export const DELIVERABLE_COUNT = DELIVERABLE_GROUPS.reduce(
  (total, group) => total + group.items.length,
  0,
);
