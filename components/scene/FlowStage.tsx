"use client";

import dynamic from "next/dynamic";
import Hero from "@/components/hero/Hero";
import SceneStage from "./SceneStage";
import SharedElementLayer from "./SharedElementLayer";

/**
 * The scene map, and the only place it exists.
 *
 * This has to be a client component to do its job. When a *server* component
 * creates `<PersonalityScene />` and hands it down as a prop, the client
 * reference travels in the RSC payload and the chunk is loaded at hydration —
 * whether or not the scene is ever shown. Declared here instead, each scene is a
 * genuine lazy boundary: its code is fetched the first time it is rendered.
 *
 * The founder pays for the identity board only if they reach it. The scene before
 * it takes 500ms to leave, which is far longer than a chunk takes to arrive, so
 * the transition never waits on the network.
 *
 * Hero and SharedElementLayer stay eager: the first is the first paint, the
 * second must already exist during the very first click.
 */
const PersonalityScene = dynamic(
  () => import("@/components/personality/PersonalityScene"),
  { ssr: false },
);
const StyleScene = dynamic(() => import("@/components/style/StyleScene"), {
  ssr: false,
});
const IdentityScene = dynamic(
  () => import("@/components/identity/IdentityScene"),
  {
    ssr: false,
  },
);
const MockupScene = dynamic(() => import("@/components/mockups/MockupScene"), {
  ssr: false,
});
const DeliverablesScene = dynamic(
  () => import("@/components/deliverables/DeliverablesScene"),
  { ssr: false },
);
const PackagesScene = dynamic(
  () => import("@/components/packages/PackagesScene"),
  {
    ssr: false,
  },
);
const OrderScene = dynamic(() => import("@/components/order/OrderScene"), {
  ssr: false,
});

export default function FlowStage() {
  return (
    <>
      <SceneStage
        scenes={{
          hero: <Hero />,
          personality: <PersonalityScene />,
          style: <StyleScene />,
          identity: <IdentityScene />,
          mockups: <MockupScene />,
          deliverables: <DeliverablesScene />,
          packages: <PackagesScene />,
          order: <OrderScene />,
        }}
      />
      <SharedElementLayer />
    </>
  );
}
