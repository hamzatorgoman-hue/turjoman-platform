import FlowStage from "@/components/scene/FlowStage";

/**
 * One page, one stage, no router.
 *
 * `force-dynamic` is not laziness: the Content Security Policy in middleware.ts
 * is nonce-based, and a nonce cannot be baked into a statically prerendered
 * document — the nonce would be identical for every visitor, which is the same as
 * having none. Rendering per request lets Next stamp a fresh nonce into its own
 * scripts, and the page is a client-side flow anyway: there is no data to cache.
 */
export const dynamic = "force-dynamic";

export default function HomePage() {
  return (
    <main>
      <FlowStage />
    </main>
  );
}
