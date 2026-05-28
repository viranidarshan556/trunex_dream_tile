import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Sparkles, MessageSquareHeart } from "lucide-react";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { BRAND } from "@/lib/constants";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "TRUNEX — AI Tile Visualizer" },
      { name: "description", content: "See TRUNEX tiles in your own room instantly with AI. Self-design with AI preview or get a free expert recommendation." },
      { property: "og:title", content: "TRUNEX — AI Tile Visualizer" },
      { property: "og:description", content: "See TRUNEX tiles in your own room instantly with AI." },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <div className="min-h-screen">
      <SiteHeader />

      <section className="relative overflow-hidden px-4 pt-12 pb-8 sm:pt-20">
        <div className="absolute inset-0 -z-10 opacity-40" style={{ background: "radial-gradient(ellipse at top, oklch(0.3 0.1 80 / 0.4), transparent 60%)" }} />
        <div className="container mx-auto max-w-3xl text-center">
          <span className="inline-flex items-center gap-1.5 rounded-full border gold-border bg-card/40 px-3 py-1 text-[10px] uppercase tracking-[0.25em] text-gold">
            <Sparkles className="h-3 w-3" /> AI-Powered Visualization
          </span>
          <h1 className="mt-5 font-display text-4xl font-bold leading-[1.05] sm:text-6xl">
            See <span className="text-gold-gradient">{BRAND.name}</span> tiles
            <br />in your own room.
          </h1>
          <p className="mx-auto mt-4 max-w-md text-sm text-muted-foreground sm:text-base">
            Upload a photo. Pick a tile. Watch AI render your dream floor in seconds. No guesswork — only confidence.
          </p>
        </div>
      </section>

      <section className="px-4 py-8 sm:py-12">
        <div className="container mx-auto grid max-w-4xl gap-4 sm:grid-cols-2">
          <FlowCard
            to="/self-design"
            badge="Self Design"
            title="Visualize it yourself"
            desc="Choose any tile from our gallery and instantly preview it in your room using AI."
            cta="Try AI Preview"
            icon={<Sparkles className="h-5 w-5" />}
            accent
          />
          <FlowCard
            to="/expert-design"
            badge="Expert Design"
            title="Talk to a TRUNEX expert"
            desc="Get a free personalized tile recommendation from our team on WhatsApp."
            cta="Get Recommendation"
            icon={<MessageSquareHeart className="h-5 w-5" />}
          />
        </div>
      </section>

      <section className="px-4 py-12">
        <div className="container mx-auto grid max-w-4xl gap-6 text-center sm:grid-cols-3">
          <Step n="1" t="Upload" d="Snap or upload your room photo." />
          <Step n="2" t="Choose" d="Pick a TRUNEX tile you love." />
          <Step n="3" t="Visualize" d="See it rendered in seconds." />
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}

function FlowCard({ to, badge, title, desc, cta, icon, accent }: any) {
  return (
    <Link
      to={to}
      className={`group relative flex flex-col gap-4 overflow-hidden rounded-2xl border p-6 transition-all hover:-translate-y-0.5 ${accent ? "gold-border gold-glow bg-card" : "border-border/60 bg-card/60"}`}
    >
      <div className={`inline-flex w-fit items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] uppercase tracking-widest ${accent ? "bg-gold/15 text-gold" : "bg-muted text-muted-foreground"}`}>
        {icon} {badge}
      </div>
      <h3 className="font-display text-2xl">{title}</h3>
      <p className="text-sm text-muted-foreground">{desc}</p>
      <span className={`mt-auto inline-flex items-center gap-1.5 text-sm font-medium ${accent ? "text-gold" : "text-foreground"}`}>
        {cta} <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
      </span>
    </Link>
  );
}

function Step({ n, t, d }: { n: string; t: string; d: string }) {
  return (
    <div className="space-y-2">
      <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full gold-border font-display text-gold">{n}</div>
      <p className="font-display text-lg">{t}</p>
      <p className="text-xs text-muted-foreground">{d}</p>
    </div>
  );
}
