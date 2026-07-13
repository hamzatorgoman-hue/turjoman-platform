"use client";

import { forwardRef } from "react";
import type { OrderField as FieldName } from "@/lib/order";

type Props = {
  name: FieldName;
  label: string;
  hint?: string;
  value: string;
  error?: string;
  required?: boolean;
  multiline?: boolean;
  type?: "text" | "tel";
  autoComplete?: string;
  inputMode?: "text" | "tel";
  placeholder?: string;
  /** Phone numbers read left-to-right even inside an RTL form. */
  ltr?: boolean;
  onChange: (value: string) => void;
  onBlur: () => void;
};

/**
 * One field. Large, quiet, and honest about what it needs: the label is always
 * visible (a placeholder that vanishes on focus is not a label), the optional
 * field says so, and the error names the fix rather than the failure.
 */
const OrderField = forwardRef<HTMLInputElement | HTMLTextAreaElement, Props>(
  function OrderField(
    {
      name,
      label,
      hint,
      value,
      error,
      required,
      multiline,
      type = "text",
      autoComplete,
      inputMode,
      placeholder,
      ltr,
      onChange,
      onBlur,
    },
    ref,
  ) {
    const errorId = `${name}-error`;
    const hintId = `${name}-hint`;
    const described = [error ? errorId : null, hint ? hintId : null]
      .filter(Boolean)
      .join(" ");

    const shared = {
      id: name,
      name,
      value,
      required,
      "aria-invalid": Boolean(error) || undefined,
      "aria-describedby": described || undefined,
      placeholder,
      onChange: (
        event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
      ) => onChange(event.target.value),
      onBlur,
      className: [
        "w-full rounded-2xl border bg-ink-800/50 px-5 font-body text-[0.98rem] text-sand-100",
        "placeholder:text-sand-400/50 backdrop-blur-sm transition-colors duration-500 ease-out",
        "focus:outline-none focus-visible:border-gold-300/70",
        error
          ? "border-[#E45C5F]/60"
          : "border-gold-500/[0.22] hover:border-gold-300/40",
        multiline ? "min-h-[7.5rem] resize-y py-4 leading-8" : "h-[3.6rem]",
        ltr ? "text-left" : "",
      ].join(" "),
      dir: ltr ? ("ltr" as const) : undefined,
    };

    return (
      <div className="flex flex-col gap-2.5">
        <label htmlFor={name} className="flex items-baseline gap-2">
          <span className="font-body text-sm font-light text-sand-200">
            {label}
          </span>
          {!required ? (
            <span className="font-body text-[0.68rem] font-light text-sand-400">
              اختياري
            </span>
          ) : null}
        </label>

        {multiline ? (
          <textarea
            {...shared}
            ref={ref as React.Ref<HTMLTextAreaElement>}
            rows={4}
          />
        ) : (
          <input
            {...shared}
            ref={ref as React.Ref<HTMLInputElement>}
            type={type}
            inputMode={inputMode}
            autoComplete={autoComplete}
          />
        )}

        {hint && !error ? (
          <p
            id={hintId}
            className="font-body text-[0.72rem] font-light text-sand-400"
          >
            {hint}
          </p>
        ) : null}

        {error ? (
          <p
            id={errorId}
            role="alert"
            className="font-body text-[0.75rem] font-light text-[#E45C5F]"
          >
            {error}
          </p>
        ) : null}
      </div>
    );
  },
);

export default OrderField;
