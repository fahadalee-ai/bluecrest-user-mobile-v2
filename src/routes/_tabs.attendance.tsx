import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Badge, Card, EmptyState, NavBar, Screen, SegmentedControl } from "@/components/ios";
import {
  attendance,
  attendanceHoursToNumber,
  attendanceRangeLabel,
  filterAttendance,
  sites,
  type AttendanceRange,
} from "@/data/bluecrest";
import { CalendarDays, Clock } from "lucide-react";

export const Route = createFileRoute("/_tabs/attendance")({
  head: () => ({
    meta: [
      { title: "Attendance History — Bluecrest Staff" },
      {
        name: "description",
        content:
          "Review your clock-in and clock-out history, hours worked and on-time record by site.",
      },
      { property: "og:title", content: "Attendance History — Bluecrest Staff" },
      {
        property: "og:description",
        content: "Clock-in history, hours worked and on-time record.",
      },
    ],
  }),
  component: Attendance,
});

function formatHours(totalHours: number): string {
  const h = Math.floor(totalHours);
  const m = Math.round((totalHours - h) * 60);
  if (m === 0) return `${h}h`;
  return `${h}h ${String(m).padStart(2, "0")}m`;
}

function Attendance() {
  const [range, setRange] = useState<AttendanceRange>("week");
  const entries = filterAttendance(attendance, range);
  const totalHours = entries.reduce((sum, a) => sum + attendanceHoursToNumber(a.hours), 0);
  const onTime = entries.filter((a) => a.status === "complete").length;
  const sectionLabel = attendanceRangeLabel(range);

  return (
    <>
      <NavBar title="Attendance" />
      <Screen>
        <SegmentedControl
          className="mb-4"
          value={range}
          onChange={setRange}
          options={[
            { value: "week", label: "Week" },
            { value: "month", label: "Month" },
            { value: "all", label: "All" },
          ]}
        />

        <div className="mb-5 grid grid-cols-3 gap-3">
          {[
            { l: "Shifts", v: String(entries.length) },
            { l: "Hours", v: formatHours(totalHours) },
            { l: "On-Time", v: entries.length ? `${onTime}/${entries.length}` : "—" },
          ].map((s) => (
            <Card key={s.l} className="p-3 text-center">
              <p className="text-[22px] font-bold text-navy">{s.v}</p>
              <p className="text-[12px] text-muted-foreground">{s.l}</p>
            </Card>
          ))}
        </div>

        <p className="mb-2 px-1 text-[13px] font-semibold tracking-wide text-muted-foreground uppercase">
          {sectionLabel}
        </p>

        {entries.length === 0 ? (
          <EmptyState
            icon={<CalendarDays className="h-8 w-8" strokeWidth={1.6} />}
            title="No shifts in this period"
            description="Clock in on your next assignment and your history will show up here."
          />
        ) : (
          <div className="space-y-3">
            {entries.map((a) => {
              const site = sites.find((s) => s.id === a.siteId);
              return (
                <Card key={a.id} className="flex items-center gap-3">
                  <span className="flex h-11 w-11 shrink-0 flex-col items-center justify-center bg-accent text-primary">
                    <CalendarDays className="h-4 w-4" />
                    <span className="text-[11px] font-bold">{a.day}</span>
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[15px] font-semibold text-navy">{site?.name}</p>
                    <p className="text-[13px] text-muted-foreground">{a.date}</p>
                    <p className="mt-1 flex items-center gap-1 text-[13px] text-muted-foreground">
                      <Clock className="h-3.5 w-3.5" />
                      {a.clockIn} – {a.clockOut} · {a.hours}
                    </p>
                  </div>
                  <Badge tone={a.status === "late" ? "amber" : "green"}>
                    {a.status === "late" ? "Late" : "Complete"}
                  </Badge>
                </Card>
              );
            })}
          </div>
        )}
      </Screen>
    </>
  );
}
