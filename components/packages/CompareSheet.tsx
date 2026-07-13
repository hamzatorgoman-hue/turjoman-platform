"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { COMPARE_ROWS, PACKAGES } from "@/lib/packages";
import { EASE_LUX } from "@/lib/motion";

type Props = {
  open: boolean;
};

/**
 * The comparison, only when asked for.
 *
 * Rows are things a package *carries*. Where a package does not carry a row, the
 * cell is quiet — no cross, no red, no scoreboard. A founder comparing should
 * see what they gain by moving up, never what they are missing by staying put.
 */
export default function CompareSheet({ open }: Props) {
  const reduced = useReducedMotion();

  return (
    <AnimatePresence initial={false}>
      {open ? (
        <motion.div
          key="compare"
          initial={reduced ? { opacity: 0 } : { opacity: 0, height: 0 }}
          animate={reduced ? { opacity: 1 } : { opacity: 1, height: "auto" }}
          exit={reduced ? { opacity: 0 } : { opacity: 0, height: 0 }}
          transition={{ duration: 0.55, ease: EASE_LUX }}
          className="overflow-hidden"
        >
          <div className="mt-10 overflow-x-auto rounded-3xl border border-gold-500/[0.16] bg-ink-800/40 backdrop-blur-sm">
            <table className="w-full min-w-[38rem] border-collapse text-start">
              <caption className="sr-only">مقارنة ما تشمله كل باقة</caption>
              <thead>
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-5 text-start font-body text-[0.72rem] font-light text-sand-400"
                  >
                    ما تشمله الباقة
                  </th>
                  {PACKAGES.map((tier) => (
                    <th
                      key={tier.id}
                      scope="col"
                      className="px-6 py-5 text-center font-body text-sm font-medium text-sand-200"
                    >
                      {tier.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {COMPARE_ROWS.map((row) => (
                  <tr
                    key={row.label}
                    className="border-t border-gold-500/[0.10]"
                  >
                    <th
                      scope="row"
                      className="px-6 py-4 text-start font-body text-sm font-light leading-6 text-sand-300"
                    >
                      {row.label}
                    </th>
                    {PACKAGES.map((tier) => {
                      const included = row.in.includes(tier.id);
                      return (
                        <td key={tier.id} className="px-6 py-4 text-center">
                          {included ? (
                            <>
                              <span className="sr-only">مشمول</span>
                              <span
                                aria-hidden
                                className="mx-auto grid h-5 w-5 place-items-center rounded-full border border-gold-500/45 text-gold-300"
                              >
                                <svg viewBox="0 0 24 24" className="h-3 w-3">
                                  <path
                                    d="m5 12.6 4.4 4.4L19 7.4"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="3"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  />
                                </svg>
                              </span>
                            </>
                          ) : (
                            <>
                              <span className="sr-only">غير مشمول</span>
                              <span
                                aria-hidden
                                className="mx-auto block h-px w-4 bg-sand-400/25"
                              />
                            </>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
