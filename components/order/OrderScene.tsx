"use client";

import { useRef } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useActivity } from "@/lib/activity-store";
import { useIdentity } from "@/lib/identity-store";
import { EASE_LUX, fadeIn, riseIn, stage } from "@/lib/motion";
import type { OrderField as FieldName } from "@/lib/order";
import {
  setOrderField,
  submitOrder,
  touchOrderField,
  useOrder,
} from "@/lib/order-store";
import { usePackage } from "@/lib/package-store";
import { usePersonality } from "@/lib/personality-store";
import { backScene } from "@/lib/scene-store";
import { useStyle } from "@/lib/style-store";
import OrderField from "./OrderField";
import OrderSummary from "./OrderSummary";

/**
 * Scene 08 — the request.
 *
 * Not a checkout: no card, no invoice, no total. The founder is asking to begin,
 * and we are asking for the three things we cannot start without. Everything else
 * is already attached.
 */
export default function OrderScene() {
  const { selected: activity } = useActivity();
  const { selected: personality } = usePersonality();
  const { selected: style } = useStyle();
  const { selected: variant } = useIdentity();
  const { selected: packageId } = usePackage();
  const { draft, errors, request, phase, failure } = useOrder();
  const reduced = useReducedMotion();

  const refs = useRef<
    Record<string, HTMLInputElement | HTMLTextAreaElement | null>
  >({});

  if (!activity || !personality || !style || !packageId) return null;

  const ready = phase !== "idle" && Boolean(request);

  const send = () => {
    const invalid = submitOrder(
      {
        activity,
        personality,
        style,
        direction: variant ?? "core",
        packageId,
      },
      { reduceMotion: Boolean(reduced) },
    );

    // An error nobody can find is not an error message.
    if (invalid) refs.current[invalid]?.focus();
  };

  const bind = (field: FieldName) => ({
    value: draft[field],
    error: errors[field],
    onChange: (value: string) => setOrderField(field, value),
    onBlur: () => touchOrderField(field),
    ref: (node: HTMLInputElement | HTMLTextAreaElement | null) => {
      refs.current[field] = node;
    },
  });

  return (
    <motion.section
      initial="hidden"
      animate="visible"
      variants={stage}
      aria-labelledby="order-title"
      className="relative isolate flex min-h-[100svh] w-full flex-col overflow-hidden bg-ink-900 px-[var(--edge)] pb-24 pt-28 md:pt-32"
    >
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-[radial-gradient(55%_45%_at_50%_-8%,rgba(212,168,83,0.10),transparent_70%)]"
      />
      <div
        aria-hidden
        className="grain absolute inset-0 -z-10 opacity-[0.035] mix-blend-overlay"
      />

      <div className="mx-auto flex w-full max-w-[68rem] flex-1 flex-col">
        <header className="flex flex-col items-center text-center">
          <motion.p
            variants={riseIn}
            className="inline-flex items-center gap-2 rounded-full border border-gold-500/30 bg-ink-800/55 px-4 py-1.5 font-body text-[0.78rem] font-light tracking-wide text-sand-200"
          >
            الخطوة الأخيرة · الطلب
          </motion.p>

          <motion.h2
            id="order-title"
            variants={riseIn}
            className="mt-8 font-display text-3xl font-extrabold leading-[1.35] text-sand-100 md:text-4xl lg:text-[3.1rem]"
          >
            ابدأ <span className="gold-text">مشروعك</span>
          </motion.h2>

          <motion.p
            variants={riseIn}
            className="mt-6 max-w-[36rem] font-body text-[0.98rem] font-light leading-[2.1] text-sand-300"
          >
            أرسل طلبك، وسنراجع تفاصيله معك قبل بدء التنفيذ.
          </motion.p>
        </header>

        <div className="mt-16 grid gap-10 lg:mt-20 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:gap-12">
          {/* the three things we cannot start without */}
          <motion.div variants={fadeIn} className="flex flex-col gap-7">
            <OrderField
              name="projectName"
              label="اسم المشروع"
              required
              placeholder="كما تريده أن يظهر على الهوية"
              autoComplete="organization"
              {...bind("projectName")}
            />

            <OrderField
              name="fullName"
              label="الاسم"
              required
              autoComplete="name"
              {...bind("fullName")}
            />

            <OrderField
              name="phone"
              label="رقم الجوال"
              required
              type="tel"
              inputMode="tel"
              autoComplete="tel"
              placeholder="05XXXXXXXX"
              hint="نتواصل معك عليه لمراجعة التفاصيل."
              ltr
              {...bind("phone")}
            />

            <OrderField
              name="notes"
              label="ملاحظات"
              multiline
              placeholder="أي شيء تحب أن نعرفه قبل أن نبدأ."
              {...bind("notes")}
            />

            <div className="mt-2 flex flex-col items-start gap-5">
              <button
                type="button"
                onClick={send}
                disabled={ready}
                className="group inline-flex h-[3.5rem] w-full items-center justify-center gap-3 rounded-full bg-gold-bar px-10 font-body text-[0.98rem] font-semibold text-ink-900 shadow-cta transition-transform duration-500 ease-out hover:-translate-y-0.5 disabled:pointer-events-none disabled:opacity-45 sm:w-auto"
              >
                إرسال الطلب
              </button>

              <button
                type="button"
                onClick={() => backScene()}
                className="inline-flex min-h-[2.75rem] items-center px-1 font-body text-sm font-light text-sand-400 underline-offset-4 transition-colors duration-500 hover:text-sand-200 hover:underline"
              >
                العودة إلى الباقات
              </button>
            </div>

            {/*
              A failed send is shown exactly like a field error: same role, same
              size, same weight, same colour. Validation failures already appear
              on the fields themselves, so they are not repeated here.
            */}
            {failure && failure.code !== "validation" ? (
              <p
                role="alert"
                className="font-body text-[0.75rem] font-light text-[#E45C5F]"
              >
                {failure.message}
              </p>
            ) : null}

            <p aria-live="polite" className="sr-only">
              {ready ? "طلبك مكتمل وجاهز للمراجعة." : ""}
            </p>

            <AnimatePresence>
              {ready ? (
                <motion.div
                  key="ready"
                  initial={reduced ? { opacity: 0 } : { opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.6, ease: EASE_LUX }}
                  className="rounded-2xl border border-gold-300/40 bg-ink-800/60 p-6 backdrop-blur-sm"
                >
                  <p className="font-body text-sm text-sand-100">طلبك مكتمل.</p>
                  <p className="mt-2 font-body text-[0.8rem] font-light leading-7 text-sand-400">
                    سنراجع تفاصيله معك قبل بدء التنفيذ.
                  </p>
                </motion.div>
              ) : null}
            </AnimatePresence>
          </motion.div>

          {/* everything already decided */}
          <motion.div variants={fadeIn}>
            <OrderSummary />

            <p className="mt-6 font-body text-[0.75rem] font-light leading-7 text-sand-400">
              لا يوجد دفع في هذه الخطوة، ولا نطلب أي بيانات بنكية. الاتفاق على
              التفاصيل يسبق أي شيء آخر.
            </p>
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
}
