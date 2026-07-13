"use client";

import { motion } from "framer-motion";
import { riseIn, stage } from "@/lib/motion";

type Guarantee = {
  id: string;
  title: string;
  note: string;
  icon: React.ReactNode;
};

const stroke = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.6,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

const GUARANTEES: Guarantee[] = [
  {
    id: "registry",
    title: "مع السجل التجاري",
    note: "نُنهي الإجراء من مكتبنا",
    icon: (
      <svg viewBox="0 0 24 24" {...stroke}>
        <path d="M4 21h16M5 21V7l7-4 7 4v14" />
        <path d="M9 21v-5h6v5M9 11h2M13 11h2" />
      </svg>
    ),
  },
  {
    id: "revisions",
    title: "تعديلات حتى الرضا",
    note: "لا نتوقف حتى تعجبك النتيجة",
    icon: (
      <svg viewBox="0 0 24 24" {...stroke}>
        <path d="M12 3 3.8 7.5v5c0 4.4 3.4 7.6 8.2 8.7 4.8-1.1 8.2-4.3 8.2-8.7v-5L12 3Z" />
        <path d="m8.8 12.2 2.2 2.2 4.2-4.4" />
      </svg>
    ),
  },
  {
    id: "delivery",
    title: "تسليم خلال 48 ساعة",
    note: "ملفات جاهزة للطباعة والنشر",
    icon: (
      <svg viewBox="0 0 24 24" {...stroke}>
        <circle cx="12" cy="12" r="8.4" />
        <path d="M12 7.2V12l3.2 1.9" />
      </svg>
    ),
  },
  {
    id: "support",
    title: "دعم بعد التسليم",
    note: "نرافقك حتى تنطلق بثقة",
    icon: (
      <svg viewBox="0 0 24 24" {...stroke}>
        <path d="M12 3.2 4.6 6.4v5.1c0 4.3 3 8.1 7.4 9.3 4.4-1.2 7.4-5 7.4-9.3V6.4L12 3.2Z" />
        <path d="M12 9v4M12 15.6h.01" />
      </svg>
    ),
  },
];

export default function TrustBar() {
  return (
    <motion.ul
      variants={stage}
      className="grid grid-cols-1 overflow-hidden rounded-2xl border border-gold-500/20 bg-ink-800/60 shadow-panel backdrop-blur-md sm:grid-cols-2 lg:grid-cols-4"
    >
      {GUARANTEES.map((item) => (
        <motion.li
          key={item.id}
          variants={riseIn}
          className="group flex items-center gap-4 px-5 py-5 transition-colors duration-500 hover:bg-gold-500/[0.06] lg:border-e lg:border-gold-500/[0.12] lg:px-6 lg:last:border-e-0"
        >
          <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl border border-gold-500/[0.25] bg-ink-700/70 text-gold-300 transition-colors duration-500 group-hover:border-gold-300/50 group-hover:text-gold-200">
            <span className="block h-5 w-5">{item.icon}</span>
          </span>
          <span className="min-w-0">
            <span className="block truncate font-body text-[0.95rem] font-medium text-sand-100">
              {item.title}
            </span>
            <span className="mt-1 block truncate font-body text-xs font-light text-sand-400">
              {item.note}
            </span>
          </span>
        </motion.li>
      ))}
    </motion.ul>
  );
}
