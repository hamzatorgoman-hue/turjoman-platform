/**
 * Brand personality — the tone the identity will speak in.
 * One choice only: a brand that is everything is nothing.
 */

export type PersonalityId =
  | "luxury"
  | "modern"
  | "warm"
  | "bold"
  | "trusted"
  | "heritage"
  | "playful"
  | "innovative";

export type Personality = {
  id: PersonalityId;
  /** Card title. */
  label: string;
  /** One line: what this feels like to the customer. */
  description: string;
  /** Three words the designer will actually work from. */
  keywords: [string, string, string];
};

export const PERSONALITIES: Personality[] = [
  {
    id: "luxury",
    label: "فاخر",
    description: "حضور هادئ يوحي بالتميّز دون مبالغة",
    keywords: ["هيبة", "إتقان", "ندرة"],
  },
  {
    id: "modern",
    label: "عصري",
    description: "بساطة ووضوح يعكسان مشروعًا يعرف اتجاهه",
    keywords: ["نقاء", "وضوح", "حداثة"],
  },
  {
    id: "warm",
    label: "دافئ",
    description: "قرب إنساني يجعل العميل يشعر أنه في بيته",
    keywords: ["ألفة", "ود", "طمأنينة"],
  },
  {
    id: "bold",
    label: "جريء",
    description: "طاقة وتباين لا يمكن تجاهلهما في السوق",
    keywords: ["قوة", "تباين", "حضور"],
  },
  {
    id: "trusted",
    label: "موثوق",
    description: "رصانة تُشعر العميل أن مشروعك ثابت وملتزم",
    keywords: ["مصداقية", "ثبات", "احتراف"],
  },
  {
    id: "heritage",
    label: "أصيل",
    description: "جذور وحرفية تمنح مشروعك عمقًا وذاكرة",
    keywords: ["تراث", "حرفية", "عمق"],
  },
  {
    id: "playful",
    label: "مرِح",
    description: "خفة وحيوية تجعل التعامل معك تجربة ممتعة",
    keywords: ["حيوية", "بساطة", "قرب"],
  },
  {
    id: "innovative",
    label: "مبتكر",
    description: "لغة تقنية تقول إن مشروعك يسبق غيره بخطوة",
    keywords: ["ذكاء", "تقنية", "استشراف"],
  },
];

export function getPersonality(id: PersonalityId): Personality {
  const found = PERSONALITIES.find((personality) => personality.id === id);
  if (!found) throw new Error(`Unknown personality: ${id}`);
  return found;
}
