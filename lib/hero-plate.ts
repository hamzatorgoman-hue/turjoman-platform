/**
 * The hero environment is the approved photographic plate. It carries lighting,
 * depth and material. Every interface element sits above it as real HTML.
 *
 * Assets are derived from the single approved master by `npm run plate`
 * (scripts/build-hero-plate.mjs). See docs/hero-plate.md.
 *
 * The composition is fixed and the layout depends on it:
 *   left        → floor-to-ceiling window, Riyadh skyline at blue hour, lounge seating.
 *                 The copy column is scrimmed over it.
 *   centre      → walnut joinery, lit shelving, marble panel. The lockup sits here.
 *   right       → pendant and desk lamps. Their bloom is tracked in CSS.
 *   foreground  → walnut desk: notebook, pens, stamp, card tray, mug.
 *                 The sector cards sit above it.
 */

export type Plate = {
  avif: string;
  webp: string;
  width: number;
  height: number;
};

export const HERO_PLATE: Record<"desktop" | "tablet" | "mobile", Plate> = {
  desktop: {
    avif: "/hero/atelier-desktop.avif",
    webp: "/hero/atelier-desktop.webp",
    width: 1896,
    height: 1264,
  },
  tablet: {
    avif: "/hero/atelier-tablet.avif",
    webp: "/hero/atelier-tablet.webp",
    width: 1400,
    height: 1050,
  },
  mobile: {
    avif: "/hero/atelier-mobile.avif",
    webp: "/hero/atelier-mobile.webp",
    width: 1080,
    height: 1440,
  },
};

/** 20px LQIP of the master — first paint is the room's colour field, not black. */
export const HERO_PLATE_LQIP =
  "data:image/webp;base64,UklGRmwAAABXRUJQVlA4IGAAAAAQBACdASoUAA0APu1kqU2ppaOiMAgBMB2JZQCsAB9FWlDiYC8Cwf6qTAD85gRJtjdJpa/o1dmi9r3gwldNRqohjJ9I8YveqGzbaoskFYi7Jx8Z4oN9jLHs4B4Ykx4AAAA=";
