import { Link, createFileRoute, notFound, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  Badge,
  Card,
  EmptyState,
  NavBar,
  Screen,
  SectionHeader,
  SegmentedControl,
} from "@/components/ios";
import { MapCard } from "@/components/map-card";
import {
  addDaysISO,
  appToday,
  dayCompletionTone,
  formatHistoryDate,
  heatmapWindow,
  photoTypes,
  siteHistoryFor,
  sites,
  supervisor,
  toISODate,
  type SiteHistoryDay,
} from "@/data/bluecrest";
import { useApp } from "@/lib/app-state";
import {
  Camera,
  Check,
  ChevronLeft,
  ChevronRight,
  Droplets,
  ExternalLink,
  History,
  Info,
  MessageCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { TaskBadge } from "./_tabs.home";

export const Route = createFileRoute("/_tabs/site/$siteId")({
  validateSearch: (s: Record<string, unknown>) => ({
    focus: s["focus"] === "history" ? ("history" as const) : ("today" as const),
  }),
  loader: ({ params }) => {
    const site = sites.find((s) => s.id === params.siteId);
    if (!site) throw notFound();
    return { name: site.name };
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: loaderData ? `${loaderData.name} — Bluecrest Staff` : "Site — Bluecrest Staff" },
      {
        name: "description",
        content:
          "Site details: today's tasks, required photos, water testing, and your personal history at this site.",
      },
      {
        property: "og:title",
        content: loaderData ? `${loaderData.name} — Bluecrest Staff` : "Site — Bluecrest Staff",
      },
      {
        property: "og:description",
        content: "Tasks, photos, water testing and personal attendance history for this site.",
      },
    ],
  }),
  notFoundComponent: () => (
    <Screen>
      <p className="pt-16 text-center text-[17px] text-muted-foreground">Site not found.</p>
    </Screen>
  ),
  component: SiteDetail,
});

type SiteTab = "today" | "history";

function SiteDetail() {
  const { siteId } = Route.useParams();
  const { focus } = Route.useSearch();
  const navigate = useNavigate();
  const { tasks, photos, waterTests } = useApp();
  const site = sites.find((s) => s.id === siteId)!;
  const siteTasks = tasks.filter((t) => t.siteId === siteId);
  const siteTests = waterTests.filter((t) => t.siteId === siteId && t.date === "Today");
  const requiredPhotos = photoTypes.filter(
    (p) => p.group === "Opening" || p.group === "Closing",
  );

  const [tab, setTab] = useState<SiteTab>(focus === "history" ? "history" : "today");

  useEffect(() => {
    setTab(focus === "history" ? "history" : "today");
  }, [focus]);

  return (
    <>
      <NavBar title={site.name} />
      <div className="relative">
        <img
          src={site.photo}
          alt={site.name}
          width={1280}
          height={720}
          className="h-52 w-full object-cover"
        />
      </div>
      <Screen>
        <h1 className="text-title text-navy">{site.name}</h1>
        <a
          href={`https://maps.google.com/?q=${encodeURIComponent(site.address)}`}
          target="_blank"
          rel="noreferrer"
          className="mt-1 flex min-h-11 items-center gap-1.5 text-[15px] text-primary"
        >
          {site.address}
          <ExternalLink className="h-4 w-4" />
        </a>

        <Card className="mt-2 mb-4 flex items-center gap-3">
          <img
            src={supervisor.avatar}
            alt={supervisor.name}
            width={512}
            height={512}
            loading="lazy"
            className="h-11 w-11 object-cover"
          />
          <div className="min-w-0 flex-1">
            <p className="text-[15px] font-semibold">{supervisor.name}</p>
            <p className="text-[13px] text-muted-foreground">{supervisor.role}</p>
          </div>
          <Link
            to="/thread/$threadId"
            params={{ threadId: "dana" }}
            className="flex min-h-11 items-center gap-1.5 bg-accent px-3 text-[15px] font-semibold text-primary"
          >
            <MessageCircle className="h-4 w-4" /> Message
          </Link>
        </Card>

        <SegmentedControl
          className="mb-5"
          value={tab}
          onChange={(v) => {
            setTab(v);
            navigate({
              to: "/site/$siteId",
              params: { siteId },
              search: { focus: v },
              replace: true,
            });
          }}
          options={[
            { value: "today", label: "Today" },
            { value: "history", label: "My History" },
          ]}
        />

        {tab === "today" ? (
          <>
            <MapCard siteName={site.name} compact className="mb-5" showGuard={false} />

            <SectionHeader>Today's Required Tasks</SectionHeader>
            <Card className="mb-5 p-0">
              <div className="divide-y divide-border/70">
                {siteTasks.map((t) => (
                  <Link
                    key={t.id}
                    to="/task/$taskId"
                    params={{ taskId: t.id }}
                    className="flex min-h-[52px] items-center gap-3 px-4 py-3 active:bg-muted"
                  >
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-[15px] font-medium">{t.name}</span>
                      <span className="block text-[12px] text-muted-foreground">
                        {t.completedTime ? `Completed ${t.completedTime}` : `Due ${t.dueTime}`}
                      </span>
                    </span>
                    <TaskBadge status={t.status} />
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  </Link>
                ))}
                {siteTasks.length === 0 && (
                  <p className="px-4 py-6 text-center text-[15px] text-muted-foreground">
                    No tasks scheduled at this site today.
                  </p>
                )}
              </div>
            </Card>

            <SectionHeader>Required Photos</SectionHeader>
            <div className="mb-5 grid grid-cols-3 gap-3">
              {requiredPhotos.map((p) => {
                const submitted = photos.find((ph) => ph.typeId === p.id);
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() =>
                      navigate({
                        to: "/capture",
                        search: { type: p.id, slot: `site:${p.id}`, siteId },
                      })
                    }
                    className="overflow-hidden border border-border/70 bg-card text-left"
                  >
                    {submitted ? (
                      <span className="relative block">
                        <img
                          src={submitted.dataUrl}
                          alt={p.label}
                          className="h-20 w-full object-cover"
                        />
                        <span className="absolute top-1 right-1 flex h-5 w-5 items-center justify-center bg-success text-primary-foreground">
                          <Check className="h-3 w-3" />
                        </span>
                      </span>
                    ) : (
                      <span className="flex h-20 items-center justify-center border-b border-dashed border-border bg-muted/50 text-muted-foreground">
                        <Camera className="h-5 w-5" />
                      </span>
                    )}
                    <span className="block px-2 py-2 text-[12px] leading-tight font-medium">
                      <span className="block text-muted-foreground">{p.group}</span>
                      {p.label}
                    </span>
                  </button>
                );
              })}
            </div>

            <SectionHeader
              action={
                <Link
                  to="/water-history"
                  search={{ siteId }}
                  className="text-[13px] font-semibold text-primary"
                >
                  View Full History
                </Link>
              }
            >
              Water Testing
            </SectionHeader>
            <Card className="mb-5">
              <p className="flex items-center gap-2 text-[15px] font-medium">
                <Droplets className="h-4 w-4 text-primary" />
                {site.waterSchedule}
              </p>
              <div className="mt-3 space-y-2">
                {siteTests.map((t) => (
                  <div key={t.id} className="flex items-center gap-2 text-[13px]">
                    <Badge tone={t.status === "ok" ? "green" : "amber"}>
                      {t.status === "ok" ? "In range" : "Flagged"}
                    </Badge>
                    <span className="text-muted-foreground">
                      {t.time} · {t.body} · Cl {t.chlorine} · pH {t.ph}
                    </span>
                  </div>
                ))}
                {siteTests.length === 0 && (
                  <p className="text-[13px] text-muted-foreground">No tests logged yet today.</p>
                )}
              </div>
            </Card>

            <SectionHeader>Site Notes</SectionHeader>
            <Card className="flex gap-3">
              <Info className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
              <p className="text-[15px] leading-relaxed text-foreground">{site.notes}</p>
            </Card>
          </>
        ) : (
          <MyHistoryAtSite siteId={siteId} />
        )}
      </Screen>
    </>
  );
}

function MyHistoryAtSite({ siteId }: { siteId: string }) {
  const history = siteHistoryFor(siteId);
  const historyByDate = Object.fromEntries(history.map((d) => [d.date, d]));
  const [selected, setSelected] = useState(toISODate(appToday));
  const day: SiteHistoryDay | undefined = historyByDate[selected];
  const window = heatmapWindow(toISODate(appToday), 14);

  return (
    <div>
      <SectionHeader>My History at This Site</SectionHeader>

      <div className="mb-4 flex items-center gap-2">
        <button
          type="button"
          aria-label="Previous day"
          onClick={() => setSelected((d) => addDaysISO(d, -1))}
          className="flex h-11 w-11 items-center justify-center bg-muted text-navy"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <div className="min-h-11 flex-1 border border-border/70 bg-card px-3 py-2 text-center">
          <p className="text-[15px] font-semibold text-navy">{formatHistoryDate(selected)}</p>
        </div>
        <button
          type="button"
          aria-label="Next day"
          onClick={() => setSelected((d) => addDaysISO(d, 1))}
          className="flex h-11 w-11 items-center justify-center bg-muted text-navy"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>

      {!day ? (
        <EmptyState
          icon={<History className="h-8 w-8" strokeWidth={1.6} />}
          title="Not assigned to this site on this date"
          description="Scroll to a day within your assignment period to see your record."
        />
      ) : (
        <>
          <div className="mb-4 grid grid-cols-2 gap-2">
            <SummaryChip
              label="Tasks"
              value={`${day.tasksCompleted}/${day.tasksTotal} Completed`}
            />
            <SummaryChip label="Clocked In" value={day.clockIn ?? "—"} />
            <SummaryChip label="Clocked Out" value={day.clockOut ?? "—"} />
            <SummaryChip
              label="Water Tests"
              value={`${day.waterOk}/${day.waterTotal} Within Range`}
            />
          </div>

          <Card className="mb-5 p-0">
            <ol className="divide-y divide-border/70">
              {day.events.map((e, i) => (
                <li key={`${e.time}-${e.label}-${i}`} className="flex gap-3 px-4 py-3">
                  <span className="relative mt-1.5 flex flex-col items-center">
                    <span
                      className={cn(
                        "h-3 w-3 border-2",
                        e.status === "completed" && "border-success bg-success",
                        e.status === "missed" && "border-danger bg-transparent",
                        e.status === "late" && "border-warning bg-warning",
                        e.status === "flagged" && "border-warning bg-warning",
                        e.status === "info" && "border-primary bg-primary",
                      )}
                    />
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <p
                        className={cn(
                          "text-[15px] font-medium",
                          e.status === "missed" && "text-danger",
                        )}
                      >
                        {e.label}
                      </p>
                      {(e.status === "late" || e.status === "missed") && (
                        <Badge tone={e.status === "missed" ? "red" : "amber"}>
                          {e.status === "missed" ? "Missed" : "Late"}
                        </Badge>
                      )}
                    </div>
                    <p className="mt-0.5 text-[13px] text-muted-foreground">{e.time}</p>
                    {e.photoCount ? (
                      <p className="mt-1 text-[12px] text-primary">
                        {e.photoCount} photo{e.photoCount === 1 ? "" : "s"} on file
                      </p>
                    ) : null}
                  </div>
                </li>
              ))}
            </ol>
          </Card>
        </>
      )}

      <p className="mb-2 px-1 text-[13px] font-semibold tracking-wide text-muted-foreground uppercase">
        14-Day Consistency
      </p>
      <div className="flex gap-1.5 overflow-x-auto pb-1">
        {window.map((iso) => {
          const d = historyByDate[iso];
          const tone = dayCompletionTone(d);
          return (
            <button
              key={iso}
              type="button"
              aria-label={formatHistoryDate(iso)}
              onClick={() => setSelected(iso)}
              className={cn(
                "h-8 w-8 shrink-0 border transition-colors duration-200",
                selected === iso && "ring-2 ring-primary ring-offset-1",
                tone === "full" && "border-success bg-success",
                tone === "partial" && "border-warning bg-warning/70",
                tone === "missed" && "border-danger bg-danger/80",
                tone === "today" && "border-primary bg-primary/80",
                tone === "empty" && "border-border bg-muted",
              )}
            />
          );
        })}
      </div>
      <div className="mt-2 flex flex-wrap gap-3 text-[11px] text-muted-foreground">
        <Legend swatch="bg-success" label="Complete" />
        <Legend swatch="bg-warning/70" label="Partial" />
        <Legend swatch="bg-danger/80" label="Missed" />
        <Legend swatch="bg-muted border border-border" label="No record" />
      </div>
    </div>
  );
}

function SummaryChip({ label, value }: { label: string; value: string }) {
  return (
    <div className="border border-border/70 bg-card px-3 py-2.5">
      <p className="text-[11px] font-semibold tracking-wide text-muted-foreground uppercase">
        {label}
      </p>
      <p className="mt-0.5 text-[13px] font-semibold text-navy">{value}</p>
    </div>
  );
}

function Legend({ swatch, label }: { swatch: string; label: string }) {
  return (
    <span className="flex items-center gap-1.5">
      <span className={cn("h-2.5 w-2.5", swatch)} />
      {label}
    </span>
  );
}
