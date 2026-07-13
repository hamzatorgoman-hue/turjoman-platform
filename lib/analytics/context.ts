import type { EventProperties } from "./types";

/**
 * The ambient context attached to every event.
 *
 * Device class, viewport and language — enough to know whether founders abandon
 * on phones, and not enough to recognise anyone. No canvas, no fonts, no audio,
 * no cookie of our own, no id. This is the whole of it, and it is deliberately
 * boring.
 */
export function baseContext(): EventProperties {
  if (typeof window === "undefined") return {};

  const width = window.innerWidth;
  const height = window.innerHeight;

  return {
    device: deviceClass(width),
    viewport_width: width,
    viewport_height: height,
    language: navigator.language?.slice(0, 12) ?? "unknown",
  };
}

function deviceClass(width: number): "mobile" | "tablet" | "desktop" {
  if (width < 640) return "mobile";
  if (width < 1024) return "tablet";
  return "desktop";
}
