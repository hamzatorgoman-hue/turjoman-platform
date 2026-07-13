"use client";

import { getActivity } from "@/lib/activities";
import { useActivity } from "@/lib/activity-store";
import { VARIANTS } from "@/lib/identity-direction";
import { useIdentity } from "@/lib/identity-store";
import { getPackage } from "@/lib/packages";
import { usePackage } from "@/lib/package-store";
import { getPersonality } from "@/lib/personalities";
import { usePersonality } from "@/lib/personality-store";
import { getStyle } from "@/lib/styles";
import { useStyle } from "@/lib/style-store";

/**
 * Everything already decided, attached to the request.
 *
 * It is shown, not asked. A founder who has answered five questions should never
 * be handed a form that pretends the conversation didn't happen.
 */
export default function OrderSummary() {
  const { selected: activity } = useActivity();
  const { selected: personality } = usePersonality();
  const { selected: style } = useStyle();
  const { selected: variant } = useIdentity();
  const { selected: packageId } = usePackage();

  const rows = [
    { label: "النشاط", value: activity ? getActivity(activity).label : null },
    {
      label: "الشخصية",
      value: personality ? getPersonality(personality).label : null,
    },
    { label: "الأسلوب", value: style ? getStyle(style).label : null },
    {
      label: "الاتجاه",
      value:
        VARIANTS.find((option) => option.id === (variant ?? "core"))?.label ??
        null,
    },
    {
      label: "الباقة",
      value: packageId
        ? `${getPackage(packageId).label} · ${getPackage(packageId).price} ${getPackage(packageId).currency}`
        : null,
    },
  ].filter((row) => row.value);

  return (
    <aside
      aria-label="ما هو مرفق تلقائيًا بطلبك"
      className="rounded-3xl border border-gold-500/[0.16] bg-[linear-gradient(180deg,rgba(20,15,10,0.68)_0%,rgba(9,6,4,0.88)_100%)] p-7 backdrop-blur-sm lg:p-8"
    >
      <h3 className="font-body text-sm font-medium text-sand-100">
        مرفق تلقائيًا بطلبك
      </h3>
      <p className="mt-2 font-body text-[0.75rem] font-light leading-6 text-sand-400">
        اخترتها خلال هذه الجلسة — لا حاجة لإعادة كتابتها.
      </p>

      <dl className="mt-7 flex flex-col gap-4">
        {rows.map((row) => (
          <div
            key={row.label}
            className="flex items-baseline justify-between gap-4 border-b border-gold-500/[0.10] pb-4 last:border-b-0 last:pb-0"
          >
            <dt className="font-body text-[0.78rem] font-light text-sand-400">
              {row.label}
            </dt>
            <dd className="text-end font-body text-sm text-sand-200">
              {row.value}
            </dd>
          </div>
        ))}
      </dl>
    </aside>
  );
}
