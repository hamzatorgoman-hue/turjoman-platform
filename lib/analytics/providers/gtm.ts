import type { AnalyticsProvider, EventName, EventProperties } from "../types";

/**
 * Google Tag Manager.
 *
 * GTM takes the canonical name unchanged — the dot is legal in a dataLayer event
 * — so a container can trigger on `turjoman.order_saved` exactly as it is written
 * in the code. Whatever GTM then forwards it to is GTM's business, not ours.
 */

const SCRIPT_ID = "gtm-container";

export function createGtmProvider(containerId: string): AnalyticsProvider {
  return {
    name: "gtm",

    init: async () => {
      if (typeof window === "undefined") return;
      if (document.getElementById(SCRIPT_ID)) return;

      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({
        "gtm.start": Date.now(),
        event: "gtm.js",
      });

      await new Promise<void>((resolve) => {
        const script = document.createElement("script");
        script.id = SCRIPT_ID;
        script.async = true;
        script.src = `https://www.googletagmanager.com/gtm.js?id=${encodeURIComponent(containerId)}`;
        script.onload = () => resolve();
        script.onerror = () => resolve();
        document.head.appendChild(script);
      });
    },

    track: (event: EventName, properties: EventProperties) => {
      window.dataLayer?.push({ event, ...properties });
    },
  };
}
