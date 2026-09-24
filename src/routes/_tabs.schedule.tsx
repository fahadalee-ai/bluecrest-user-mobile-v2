import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Badge, Card, EmptyState, NavBar, Screen } from "@/components/ios";
import { shifts, sites, supervisor } from "@/data/bluecrest";
import { CalendarOff, X } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Shift } from "@/data/bluecrest";

export const Route = createFileRoute("/_tabs/schedule")({
  head: () => ({
    meta: [
      { title: "My Schedule — Bluecrest Staff" },
      {
        name: "description",
        content: "Your upcoming lifeguard shifts by day, including fill-in coverage assignments.",
      },
      { property: "og:title", content: "My Schedule — Bluecrest Staff" },
      {
        property: "og:description",
        content: "Upcoming lifeguard shifts and fill-in coverage assignments.",
      },
    ],
  }),
  component: Schedule,
});

const week = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

function Schedule() {
  const [day, setDay] = useState("Fri");
  const [open, setOpen] = useState<Shift | null>(null);
  const dayShifts = shifts.filter((s) => s.day === day);

  return (
    <>
      <NavBar title="My Schedule" />
      <div className="hide-scrollbar flex gap-2 overflow-x-auto border-b border-border/70 bg-background px-4 py-3">
        {week.map((d) => {
          const has = shifts.some((s) => s.day === d);
          return (
            <button
              key={d}
              type="button"
              onClick={() => setDay(d)}
              className={cn(
                "flex h-16 w-14 shrink-0 flex-col items-center justify-center border text-[13px] font-semibold transition-colors",
                day === d
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-card text-muted-foreground",
              )}
            >
              {d}
              <span
                className={cn(
                  "mt-1 h-1.5 w-1.5",
                  has ? (day === d ? "bg-primary-foreground" : "bg-primary") : "bg-transparent",
                )}
              />
            </button>
          );
        })}
      </div>

      <Screen>
        {dayShifts.length === 0 ? (
          <EmptyState
            icon={<CalendarOff className="h-7 w-7" />}
            title="No shift scheduled"
            description="Enjoy the day off — check back for next week's schedule."
          />
        ) : (
          <div className="space-y-3">
            {dayShifts.map((s) => {
              const site = sites.find((x) => x.id === s.siteId)!;
              return (
                <button key={s.id} type="button" onClick={() => setOpen(s)} className="w-full text-left">
                  <Card>
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="truncate text-[17px] font-semibold text-navy">{site.name}</p>
                        <p className="mt-0.5 text-[15px] text-muted-foreground">{s.time}</p>
                        <p className="text-[13px] text-muted-foreground">{s.date}</p>
                      </div>
                      {s.note && <Badge tone="blue">{s.note}</Badge>}
                    </div>
                  </Card>
                </button>
              );
            })}
          </div>
        )}
      </Screen>

      {open && (
        <div className="fixed inset-0 z-50 flex items-end bg-navy/40 backdrop-blur-sm">
          <div className="mx-auto w-full max-w-[520px] bg-card p-5 pb-8 duration-300 animate-in slide-in-from-bottom">
            <div className="mb-4 flex items-start justify-between">
              <p className="text-[22px] font-bold text-navy">Shift Details</p>
              <button
                type="button"
                aria-label="Close"
                onClick={() => setOpen(null)}
                className="flex h-11 w-11 items-center justify-center bg-muted"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <dl className="space-y-3 text-[15px]">
              <div className="flex justify-between gap-4">
                <dt className="text-muted-foreground">Site</dt>
                <dd className="text-right font-medium">
                  {sites.find((x) => x.id === open.siteId)!.name}
                </dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-muted-foreground">Time</dt>
                <dd className="text-right font-medium">{open.time}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-muted-foreground">Supervisor</dt>
                <dd className="text-right font-medium">
                  {supervisor.name} · {supervisor.phone}
                </dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-muted-foreground">Instructions</dt>
                <dd className="text-right font-medium">
                  {open.note ?? "Standard opening and closing duties"}
                </dd>
              </div>
            </dl>
          </div>
        </div>
      )}
    </>
  );
}
