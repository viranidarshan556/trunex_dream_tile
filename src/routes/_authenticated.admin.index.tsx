import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { getStats } from "@/lib/admin.functions";

export const Route = createFileRoute("/_authenticated/admin/")({
  component: Dashboard,
});

function Dashboard() {
  const fn = useServerFn(getStats);
  const { data, isLoading } = useQuery({ queryKey: ["admin-stats"], queryFn: () => fn() });

  if (isLoading || !data) return <p className="text-sm text-muted-foreground">Loading…</p>;

  return (
    <div className="space-y-6">
      <h1 className="font-display text-2xl">Dashboard</h1>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Kpi label="Total leads" value={data.total} />
        <Kpi label="Today" value={data.today} />
        <Kpi label="Self design" value={data.byFlow.self} />
        <Kpi label="Expert design" value={data.byFlow.expert} />
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Section title="By priority">
          <Row k="Hot (≥1500 sqft)" v={data.byPriority.hot} className="text-destructive" />
          <Row k="Warm (600–1499)" v={data.byPriority.warm} className="text-gold" />
          <Row k="Cold (<600)" v={data.byPriority.cold} />
        </Section>
        <Section title="Top cities">
          {data.topCities.length === 0 ? <Empty /> : data.topCities.map(([c, n]) => <Row key={c} k={c} v={n} />)}
        </Section>
        <Section title="Top tiles">
          {data.topTiles.length === 0 ? <Empty /> : data.topTiles.map(([t, n]) => <Row key={t} k={t.slice(0, 8)} v={n} />)}
        </Section>
      </div>
    </div>
  );
}

function Kpi({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-xl border gold-border bg-card p-4">
      <p className="text-[10px] uppercase tracking-widest text-muted-foreground">{label}</p>
      <p className="mt-1 font-display text-3xl text-gold-gradient">{value}</p>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-border/60 bg-card p-4">
      <p className="mb-3 text-xs uppercase tracking-widest text-muted-foreground">{title}</p>
      <div className="space-y-2">{children}</div>
    </div>
  );
}

function Row({ k, v, className }: { k: string; v: number; className?: string }) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span className={className}>{k}</span>
      <span className="font-mono">{v}</span>
    </div>
  );
}
function Empty() { return <p className="text-xs text-muted-foreground">No data yet.</p>; }
