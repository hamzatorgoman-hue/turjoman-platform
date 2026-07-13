"use client";

import { motion } from "framer-motion";
import type { ActivityId } from "@/lib/activities";
import type { Direction } from "@/lib/identity-direction";
import type { PersonalityId } from "@/lib/personalities";
import type { StyleId } from "@/lib/styles";
import { EASE_LUX } from "@/lib/motion";
import BoardSymbol from "./BoardSymbol";
import IconStyleSample from "./IconStyleSample";
import PatternSample from "./PatternSample";

type Props = {
  direction: Direction;
  style: StyleId;
  activity: ActivityId;
  personality: PersonalityId;
  /** Changes when the variant changes, so the board re-settles rather than snapping. */
  boardKey: string;
};

/**
 * The board. Not a mockup, not a logo — the opening page of an identity
 * document: the symbol's container, the names, the palette, the type, the
 * texture, the icon language. Everything a founder needs to say "yes, that is
 * my business" before a single asset is drawn.
 */
export default function IdentityBoard({
  direction,
  style,
  activity,
  personality,
  boardKey,
}: Props) {
  const [inkSwatch, accentSwatch] = direction.primary;
  const [surfaceSwatch, neutralSwatch, shadeSwatch] = direction.secondary;

  const ink = inkSwatch.hex;
  const accent = accentSwatch.hex;
  const surface = surfaceSwatch.hex;
  const neutral = neutralSwatch.hex;

  return (
    <motion.article
      key={boardKey}
      initial={{ opacity: 0, y: 16, filter: "blur(8px)" }}
      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      transition={{ duration: 0.7, ease: EASE_LUX }}
      aria-label="لوحة الاتجاه الأولي للهوية"
      className="relative w-full overflow-hidden rounded-3xl border border-gold-500/[0.28] shadow-[0_50px_120px_-60px_rgba(0,0,0,0.95)]"
      style={{ backgroundColor: surface }}
    >
      {/* document header */}
      <header
        className="flex items-center justify-between px-6 py-4 text-[0.62rem] uppercase"
        style={{ backgroundColor: ink, color: surface }}
      >
        <span className="font-latin tracking-[0.34em]">Identity Direction</span>
        <span className="font-body tracking-[0.18em] opacity-70">
          مسودة أولى · غير نهائية
        </span>
      </header>

      <div className="grid gap-px" style={{ backgroundColor: neutral }}>
        {/* symbol + names */}
        <section
          className="flex flex-col items-center gap-6 px-6 py-10 sm:flex-row sm:items-center sm:gap-10 sm:px-10"
          style={{ backgroundColor: surface }}
        >
          <div className="flex flex-col items-center gap-2">
            <BoardSymbol
              activity={activity}
              personality={personality}
              style={style}
              ink={ink}
              accent={accent}
              className="h-24 w-24 sm:h-28 sm:w-28"
            />
            <span
              className="font-body text-[0.6rem]"
              style={{ color: neutral }}
            >
              رمز اتجاه · ليس الشعار النهائي
            </span>
          </div>

          <div className="flex flex-1 flex-col items-center gap-3 text-center sm:items-start sm:text-start">
            <p
              className={`text-3xl sm:text-4xl ${direction.typography.displayClass}`}
              style={{ color: ink }}
            >
              {direction.arabicName}
            </p>
            <p
              className={`text-[0.7rem] uppercase sm:text-xs ${direction.typography.latinClass}`}
              style={{ color: accent }}
            >
              {direction.latinName}
            </p>
            <span
              className="mt-1 block h-[2px] w-14"
              style={{ backgroundColor: accent }}
            />
          </div>
        </section>

        {/* palette */}
        <section
          className="px-6 py-8 sm:px-10"
          style={{ backgroundColor: surface }}
        >
          <h3
            className="font-body text-[0.68rem] tracking-[0.22em]"
            style={{ color: neutral }}
          >
            الألوان
          </h3>

          <div className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-5">
            {[inkSwatch, accentSwatch].map((swatch) => (
              <div key={swatch.hex} className="flex flex-col gap-2">
                <span
                  className="h-16 w-full rounded-lg ring-1 ring-black/10"
                  style={{ backgroundColor: swatch.hex }}
                />
                <span
                  className="font-body text-[0.68rem] leading-4"
                  style={{ color: ink }}
                >
                  {swatch.name}
                </span>
                <span
                  className="font-latin text-[0.62rem] tracking-widest"
                  style={{ color: neutral }}
                >
                  {swatch.hex}
                </span>
              </div>
            ))}

            {[surfaceSwatch, neutralSwatch, shadeSwatch].map((swatch) => (
              <div key={swatch.hex} className="flex flex-col gap-2">
                <span
                  className="h-16 w-full rounded-lg ring-1 ring-black/10"
                  style={{ backgroundColor: swatch.hex }}
                />
                <span
                  className="font-body text-[0.68rem] leading-4"
                  style={{ color: ink }}
                >
                  {swatch.name}
                </span>
                <span
                  className="font-latin text-[0.62rem] tracking-widest"
                  style={{ color: neutral }}
                >
                  {swatch.hex}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* typography */}
        <section
          className="px-6 py-8 sm:px-10"
          style={{ backgroundColor: surface }}
        >
          <h3
            className="font-body text-[0.68rem] tracking-[0.22em]"
            style={{ color: neutral }}
          >
            الخطوط
          </h3>

          <div className="mt-5 grid gap-6 sm:grid-cols-2">
            <div className="flex flex-col gap-2">
              <p
                className={`text-2xl sm:text-3xl ${direction.typography.displayClass}`}
                style={{ color: ink }}
              >
                مشروعك يستحق بداية
              </p>
              <p
                className="font-body text-[0.66rem]"
                style={{ color: neutral }}
              >
                {direction.typography.displayName}
              </p>
            </div>

            <div className="flex flex-col gap-2">
              <p
                className={`text-sm leading-8 ${direction.typography.bodyClass}`}
                style={{ color: ink }}
              >
                نصّ نموذجي يوضّح كيف ستبدو الفقرات في مطبوعاتك وموقعك ورسائلك،
                بحجم القراءة الفعلي.
              </p>
              <p
                className="font-body text-[0.66rem]"
                style={{ color: neutral }}
              >
                {direction.typography.bodyName}
              </p>
            </div>
          </div>
        </section>

        {/* pattern + icon language */}
        <section
          className="grid gap-px sm:grid-cols-2"
          style={{ backgroundColor: neutral }}
        >
          <div
            className="px-6 py-8 sm:px-10"
            style={{ backgroundColor: surface }}
          >
            <h3
              className="font-body text-[0.68rem] tracking-[0.22em]"
              style={{ color: neutral }}
            >
              النقش
            </h3>
            <div className="mt-4 h-24 overflow-hidden rounded-lg ring-1 ring-black/10">
              <PatternSample
                pattern={direction.pattern}
                accent={accent}
                surface={surface}
                neutral={neutral}
                className="h-full w-full"
              />
            </div>
          </div>

          <div
            className="px-6 py-8 sm:px-10"
            style={{ backgroundColor: surface }}
          >
            <h3
              className="font-body text-[0.68rem] tracking-[0.22em]"
              style={{ color: neutral }}
            >
              أسلوب الأيقونات
            </h3>
            <div className="mt-6">
              <IconStyleSample
                iconStyle={direction.iconStyle}
                accent={accent}
                ink={ink}
              />
            </div>
            <p
              className="mt-5 font-body text-[0.66rem] leading-5"
              style={{ color: neutral }}
            >
              نفس الأشكال، ولغة رسم واحدة تُطبَّق على كل أيقونات مشروعك.
            </p>
          </div>
        </section>
      </div>

      {/* director's note */}
      <footer
        className="px-6 py-5 sm:px-10"
        style={{ backgroundColor: ink, color: surface }}
      >
        <p className="font-body text-[0.72rem] font-light leading-6 opacity-90">
          {direction.rationale}
        </p>
      </footer>
    </motion.article>
  );
}
