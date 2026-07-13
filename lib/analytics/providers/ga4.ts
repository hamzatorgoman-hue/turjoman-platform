import type { AnalyticsProvider, EventName, EventProperties } from "../types";

/**
 * Google Analytics 4.
 *
 * GA4 event names may only contain letters, digits and underscores — a dot is
 * rejected. Our canonical names carry the `turjoman.` prefix regardless, and the
 * translation happens here, at the edge, where a provider's rules belong:
 *
 *   turjoman.order_saved  →  turjoman_order_saved
 *
 * The rest of the codebase never learns that GA4 has an opinion about dots. That
 * is what the abstraction is for.
 */

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

const SCRIPT_ID = "ga4-gtag";

function toGa4Name(event: EventName): string {
  return event.replace(/\./g, "_").slice(0, 40);
}

export function createGa4Provider(measurementId: string): AnalyticsProvider {
  return {
    name: "ga4",

    init: async () => {
      if (typeof window === "undefined") return;
      if (document.getElementById(SCRIPT_ID)) return;

      await new Promise<void>((resolve) => {
        const script = document.createElement("script");
        script.id = SCRIPT_ID;
        script.async = true;
        script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(measurementId)}`;
        // A provider that fails to load is not an outage. Resolve either way.
        script.onload = () => resolve();
        script.onerror = () => resolve();
        document.head.appendChild(script);
      });

      window.dataLayer = window.dataLayer || [];
      window.gtag = function gtag() {
        // eslint-disable-next-line prefer-rest-params
        window.dataLayer?.push(arguments);
      };

      window.gtag("js", new Date());
      window.gtag("config", measurementId, {
        // We measure a journey, not a person.
        send_page_view: false,
        anonymize_ip: true,
        allow_google_signals: false,
        allow_ad_personalization_signals: false,
      });
    },

    track: (event: EventName, properties: EventProperties) => {
      window.gtag?.("event", toGa4Name(event), properties);
    },
  };
}
