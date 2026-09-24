import { Link, createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  Badge,
  EmptyState,
  NavBar,
  ProgressRing,
  PullToRefresh,
  Screen,
  SegmentedControl,
} from "@/components/ios";
import {
  assignmentBucket,
  attendancePct,
  daysUntilStart,
  formatAssignmentPeriod,
  siteAssignments,
  sites,
  type AssignmentBucket,
} from "@/data/bluecrest";
import { useApp } from "@/lib/app-state";
import {
  Building2,
  CalendarDays,
  ChevronRight,
  ClipboardList,
  Clock,
} from "lucide-react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_tabs/sites")({
  head: () => ({
    meta: [
      { title: "My Sites — Bluecrest Staff" },
      {
        name: "description",
        content:
          "Your current, upcoming and past site assignments with shift times and personal history.",
      },
      { property: "og:title", content: "My Sites — Bluecrest Staff" },
      {
        property: "og:description",
        content: "Current, upcoming and past pool site assignments.",
      },
    ],
  }),
  component: SitesScreen,
});

const EMPTY: Record<
  AssignmentBucket,
  { title: string; description: string }
> = {
  current: {
    title: "No active site assignment",
    description: "Contact your supervisor if you believe this is a mistake.",
  },
  upcoming: {
    title: "No upcoming assignments scheduled",
    description: "New temporary or primary coverage will appear here when assigned.",
  },
  past: {
    title: "No past assignments yet",
    description: "Completed site assignments will show up in your history.",
  },
};

function SitesScreen() {
  const [tab, setTab] = useState<AssignmentBucket>("current");
  const { tasks, clockedInAt, activeSiteId } = useApp();

  const list = siteAssignments
    .filter((a) => assignmentBucket(a) === tab)
    .sort((a, b) => {
      if (tab === "upcoming") return a.startDate.localeCompare(b.startDate);
      if (tab === "past") return (b.endDate ?? "").localeCompare(a.endDate ?? "");
      return a.startDate.localeCompare(b.startDate);
    });

  return (
    <>
      <NavBar title="My Sites" back={false} />
      <Screen>
        <PullToRefresh />

        <SegmentedControl
          className="mb-4"
          value={tab}
          onChange={setTab}
          options={[
            { value: "current", label: "Current" },
            { value: "upcoming", label: "Upcoming" },
            { value: "past", label: "Past" },
          ]}
        />

        <div className="mb-4 grid grid-cols-2 gap-3">
          <Link
            to="/tasks"
            className="flex min-h-11 items-center gap-2 border border-border/70 bg-card px-3 py-2.5 text-[15px] font-semibold text-navy"
          >
            <ClipboardList className="h-4 w-4 text-primary" /> All Tasks
          </Link>
          <Link
            to="/schedule"
            className="flex min-h-11 items-center gap-2 border border-border/70 bg-card px-3 py-2.5 text-[15px] font-semibold text-navy"
          >
            <CalendarDays className="h-4 w-4 text-primary" /> My Schedule
          </Link>
        </div>

        {list.length === 0 ? (
          <EmptyState
            icon={<Building2 className="h-8 w-8" strokeWidth={1.6} />}
            title={EMPTY[tab].title}
            description={EMPTY[tab].description}
          />
        ) : (
          <div className="space-y-4">
            {list.map((assignment) => {
              const site = sites.find((s) => s.id === assignment.siteId);
              if (!site) return null;

              const siteTasks = tasks.filter((t) => t.siteId === site.id);
              const done = siteTasks.filter(
                (t) => t.status === "completed" || t.status === "review",
              ).length;
              const clockedHere = Boolean(clockedInAt) && activeSiteId === site.id;
              const days = daysUntilStart(assignment);
              const pct = attendancePct(assignment);

              return (
                <Link
                  key={assignment.id}
                  to="/site/$siteId"
                  params={{ siteId: site.id }}
                  search={tab === "past" ? { focus: "history" } : { focus: "today" }}
                  className="block overflow-hidden border border-border/70 bg-card transition-transform duration-200 active:scale-[0.99]"
                >
                  <img
                    src={site.photo}
                    alt={site.name}
                    width={1280}
                    height={720}
                    loading="lazy"
                    className="h-36 w-full object-cover"
                  />
                  <div className="p-4">
                    <div className="flex items-start gap-3">
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-[17px] font-bold text-navy">{site.name}</p>
                        <p className="mt-0.5 truncate text-[15px] text-muted-foreground">
                          {site.address}
                        </p>
                        <div className="mt-2">
                          <Badge tone={assignment.type === "Primary" ? "blue" : "amber"}>
                            {assignment.type}
                          </Badge>
                        </div>
                      </div>
                      {tab === "current" && siteTasks.length > 0 && (
                        <ProgressRing value={done} total={siteTasks.length} />
                      )}
                      <ChevronRight className="mt-1 h-5 w-5 shrink-0 text-muted-foreground" />
                    </div>

                    <p className="mt-3 text-[13px] text-foreground">
                      {formatAssignmentPeriod(assignment)}
                    </p>
                    <p className="mt-1 flex items-center gap-1.5 text-[13px] text-muted-foreground">
                      <Clock className="h-3.5 w-3.5 shrink-0 text-primary" />
                      {assignment.shiftTime}
                    </p>

                    {tab === "current" && (
                      <div className="mt-3 flex flex-wrap items-center gap-2">
                        {siteTasks.length > 0 && (
                          <span className="bg-muted px-2.5 py-1 text-[12px] font-semibold text-navy">
                            {done}/{siteTasks.length} tasks today
                          </span>
                        )}
                        <span className="flex items-center gap-1.5 text-[12px] font-semibold">
                          <span
                            className={cn(
                              "h-2 w-2",
                              clockedHere ? "bg-success" : "bg-muted-foreground/40",
                            )}
                          />
                          <span className={clockedHere ? "text-success" : "text-muted-foreground"}>
                            {clockedHere ? "Clocked In" : "Not Yet"}
                          </span>
                        </span>
                      </div>
                    )}

                    {tab === "upcoming" && (
                      <p className="mt-3 text-[12px] text-muted-foreground">
                        Starts in {days} {days === 1 ? "day" : "days"}
                      </p>
                    )}

                    {tab === "past" && assignment.daysScheduled != null && pct != null && (
                      <span className="mt-3 inline-block bg-muted px-2.5 py-1 text-[12px] font-semibold text-navy">
                        {assignment.daysWorked}/{assignment.daysScheduled} days · {pct}% attendance
                      </span>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </Screen>
    </>
  );
}
