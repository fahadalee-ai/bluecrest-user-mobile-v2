import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Badge, Card, NavBar, Screen, SegmentedControl } from "@/components/ios";
import { sites } from "@/data/bluecrest";
import { useApp } from "@/lib/app-state";
import { AlertTriangle, CheckCircle2, ChevronRight, X } from "lucide-react";
import type { WaterTest } from "@/data/bluecrest";

export const Route = createFileRoute("/_tabs/water-history")({
  validateSearch: (s: Record<string, unknown>) => ({
    siteId: typeof s['siteId'] === "string" ? (s['siteId'] as string) : "manhattan-park",
  }),
  head: () => ({
    meta: [
      { title: "Water Test History — Bluecrest Staff" },
      {
        name: "description",
        content: "Past pool chemistry submissions with readings, flags and supervisor sign-off.",
      },
      { property: "og:title", content: "Water Test History — Bluecrest Staff" },
      {
        property: "og:description",
        content: "Past water test submissions with readings and sign-off status.",
      },
    ],
  }),
  component: WaterHistory,
});

function WaterHistory() {
  const { siteId } = Route.useSearch();
  const { waterTests } = useApp();
  const [range, setRange] = useState("Today");
  const [body, setBody] = useState("All");
  const [open, setOpen] = useState<WaterTest | null>(null);
  const site = sites.find((s) => s.id === siteId) ?? sites[0]!;

  const items = waterTests.filter(
    (t) =>
      t.siteId === site.id &&
      (range === "All" || t.date === range) &&
      (body === "All" || t.body === body),
  );

  return (
    <>
      <NavBar title="Water Test History" />
      <Screen>
        <p className="mb-3 text-[13px] text-muted-foreground">{site.name}</p>
        <SegmentedControl
          className="mb-3"
          value={range}
          onChange={setRange}
          options={[
            { value: "Today", label: "Today" },
            { value: "Yesterday", label: "Yesterday" },
            { value: "All", label: "All dates" },
          ]}
        />
        <SegmentedControl
          className="mb-5"
          value={body}
          onChange={setBody}
          options={[
            { value: "All", label: "All water" },
            { value: "Main Pool", label: "Main Pool" },
            { value: "Spa", label: "Spa" },
          ]}
        />

        <Card className="p-0">
          <div className="divide-y divide-border/70">
            {items.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setOpen(t)}
                className="flex w-full items-center gap-3 px-4 py-3 text-left active:bg-muted"
              >
                {t.status === "ok" ? (
                  <CheckCircle2 className="h-5 w-5 shrink-0 text-success" />
                ) : (
                  <AlertTriangle className="h-5 w-5 shrink-0 text-warning" />
                )}
                <span className="min-w-0 flex-1">
                  <span className="block text-[15px] font-medium">
                    {t.date} · {t.time} · {t.body}
                  </span>
                  <span className="block text-[13px] text-muted-foreground">
                    Cl {t.chlorine} ppm · pH {t.ph} · {t.temp}°F · {t.bathers} bathers
                  </span>
                </span>
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              </button>
            ))}
            {items.length === 0 && (
              <p className="px-4 py-10 text-center text-[15px] text-muted-foreground">
                No submissions for this filter.
              </p>
            )}
          </div>
        </Card>
      </Screen>

      {open && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-navy/40 backdrop-blur-sm">
          <div className="mx-auto w-full max-w-[520px] bg-card p-5 pb-8 duration-300 animate-in slide-in-from-bottom">
            <div className="mb-4 flex items-start justify-between">
              <div>
                <p className="text-[22px] font-bold text-navy">{open.body}</p>
                <p className="text-[13px] text-muted-foreground">
                  {open.date} · {open.time}
                </p>
              </div>
              <button
                type="button"
                aria-label="Close"
                onClick={() => setOpen(null)}
                className="flex h-11 w-11 items-center justify-center bg-muted"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {[
                { l: "Chlorine", v: `${open.chlorine} ppm` },
                { l: "pH", v: open.ph },
                { l: "Temp", v: `${open.temp}°F` },
              ].map((s) => (
                <div key={s.l} className="bg-muted p-3 text-center">
                  <p className="text-[12px] text-muted-foreground">{s.l}</p>
                  <p className="text-[17px] font-semibold text-navy">{s.v}</p>
                </div>
              ))}
            </div>
            <div className="mt-4 flex items-center gap-2">
              <Badge tone={open.status === "ok" ? "green" : "amber"}>
                {open.status === "ok" ? "Within range" : "Corrective action logged"}
              </Badge>
              {open.signoff && <Badge tone="blue">{open.signoff}</Badge>}
            </div>
            {open.correctiveAction && (
              <p className="mt-3 bg-warning-soft p-3 text-[13px] text-warning">
                {open.correctiveAction}
              </p>
            )}
            <p className="mt-3 text-[13px] text-muted-foreground">
              Bather count at time of test: {open.bathers}
            </p>
          </div>
        </div>
      )}
    </>
  );
}
