import { Link, createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import {
  Badge,
  Button,
  Card,
  Alert,
  PullToRefresh,
  Screen,
  SectionHeader,
} from "@/components/ios";
import { MapCard } from "@/components/map-card";
import { useApp, useElapsed } from "@/lib/app-state";
import { activity, sites, staff } from "@/data/bluecrest";
import {
  AlertTriangle,
  Bell,
  Camera,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Clock,
  Droplets,
  MessageCircle,
} from "lucide-react";

export const Route = createFileRoute("/_tabs/home")({
  head: () => ({
    meta: [
      { title: "Today — Bluecrest Staff" },
      {
        name: "description",
        content: "Your shift dashboard: clock in, site map, today's tasks and quick actions.",
      },
      { property: "og:title", content: "Today — Bluecrest Staff" },
      {
        property: "og:description",
        content: "Clock in, review today's tasks and submit verifications from your dashboard.",
      },
    ],
  }),
  component: HomeScreen,
});

function HomeScreen() {
  const navigate = useNavigate();
  const { clockedInAt, clockIn, clockOut, activeSiteId, setActiveSiteId, tasks, notifications } =
    useApp();
  const elapsed = useElapsed(clockedInAt);
  const [showSitePicker, setShowSitePicker] = useState(false);
  const [confirmOut, setConfirmOut] = useState(false);

  const site = sites.find((s) => s.id === activeSiteId) ?? sites[0]!;
  const todayTasks = tasks.filter((t) => t.siteId === site.id);
  const unread = notifications.filter((n) => n.unread).length;

  return (
    <Screen className="ios-status">
      <PullToRefresh />
      <header className="mb-7 flex items-start justify-between gap-3">
        <div>
          <p className="text-[13px] text-muted-foreground">Friday, August 7</p>
          <h1 className="text-large-title text-navy">
            Good morning, {staff.firstName}
          </h1>
        </div>
        <Link
          to="/notifications"
          aria-label="Notifications"
          className="relative flex h-11 w-11 items-center justify-center bg-card text-navy shadow-sm"
        >
          <Bell className="h-5 w-5" />
          {unread > 0 && (
            <span className="absolute top-1.5 right-1.5 flex h-4 min-w-4 items-center justify-center bg-danger px-1 text-[10px] font-bold text-primary-foreground">
              {unread}
            </span>
          )}
        </Link>
      </header>

      {/* Clock in / out */}
      <Card className="mb-4">
        <div className="mb-3 flex items-center justify-between">
          <Badge tone={clockedInAt ? "green" : "neutral"}>
            {clockedInAt ? "On Shift" : "Not Clocked In"}
          </Badge>
          <span className="text-[13px] text-muted-foreground">9:00 AM – 7:00 PM</span>
        </div>

        <button
          type="button"
          onClick={() => setShowSitePicker((v) => !v)}
          className="flex min-h-11 w-full items-center justify-between text-left"
        >
          <span>
            <span className="block text-[17px] font-semibold text-foreground">{site.name}</span>
            <span className="block text-[13px] text-muted-foreground">{site.address}</span>
          </span>
          <ChevronDown className="h-5 w-5 shrink-0 text-primary" />
        </button>

        {showSitePicker && (
          <div className="mt-2 overflow-hidden border border-border duration-200 animate-in fade-in slide-in-from-top-1">
            {sites.map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => {
                  setActiveSiteId(s.id);
                  setShowSitePicker(false);
                }}
                className="flex min-h-11 w-full items-center justify-between px-3 text-left text-[15px] active:bg-muted"
              >
                {s.name}
                {s.id === site.id && <CheckCircle2 className="h-4 w-4 text-primary" />}
              </button>
            ))}
          </div>
        )}

        {clockedInAt && (
          <div className="mt-3 flex items-center gap-2 bg-success-soft px-3 py-2 text-success">
            <Clock className="h-4 w-4" />
            <span className="font-mono text-[17px] font-semibold tabular-nums">{elapsed}</span>
            <span className="text-[13px]">on shift</span>
          </div>
        )}

        <div className="mt-4">
          {clockedInAt ? (
            <Button variant="danger" onClick={() => setConfirmOut(true)}>
              Clock Out
            </Button>
          ) : (
            <Button
              onClick={() => {
                navigator.geolocation?.getCurrentPosition(
                  () => undefined,
                  () => undefined,
                );
                clockIn(site.id);
              }}
            >
              Clock In
            </Button>
          )}
          <p className="mt-2 text-center text-[12px] text-muted-foreground">
            Location is verified against the site geofence at clock-in.
          </p>
        </div>
      </Card>

      {/* Map */}
      <SectionHeader>Live Location</SectionHeader>
      <Link to="/site/$siteId" params={{ siteId: site.id }} className="mb-5 block">
        <MapCard siteName={site.name} showGuard={!!clockedInAt} />
      </Link>

      {/* Tasks */}
      <SectionHeader
        action={
          <Link to="/tasks" className="text-[13px] font-semibold text-primary">
            See All Tasks
          </Link>
        }
      >
        Today's Tasks
      </SectionHeader>
      <Card className="mb-5 p-0">
        <div className="divide-y divide-border/70">
          {todayTasks.slice(0, 4).map((t) => (
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
        </div>
      </Card>

      {/* Quick actions */}
      <SectionHeader>Quick Actions</SectionHeader>
      <div className="mb-5 grid grid-cols-2 gap-3">
        <QuickAction
          icon={<Droplets className="h-5 w-5" />}
          label="Submit Water Test"
          onClick={() => navigate({ to: "/water-test", search: { siteId: site.id } })}
        />
        <QuickAction
          icon={<Camera className="h-5 w-5" />}
          label="Take Photo"
          onClick={() => navigate({ to: "/camera" })}
        />
        <QuickAction
          icon={<MessageCircle className="h-5 w-5" />}
          label="Message Supervisor"
          onClick={() => navigate({ to: "/thread/$threadId", params: { threadId: "dana" } })}
        />
        <QuickAction
          icon={<AlertTriangle className="h-5 w-5" />}
          label="Report Incident"
          onClick={() => navigate({ to: "/incident-new" })}
        />
      </div>

      {/* Recent activity */}
      <SectionHeader>Recent Activity</SectionHeader>
      <Card className="p-0">
        <div className="divide-y divide-border/70">
          {activity.map((a) => (
            <div key={a.id} className="flex items-center gap-3 px-4 py-3">
              <CheckCircle2 className="h-4 w-4 shrink-0 text-success" />
              <span className="flex-1 text-[15px]">{a.text}</span>
              <span className="text-[12px] text-muted-foreground">{a.time}</span>
            </div>
          ))}
        </div>
      </Card>

      <Alert
        open={confirmOut}
        title="Clock out for the day?"
        message="Your shift timer will stop and your hours will be logged."
        confirmLabel="Clock Out"
        destructive
        onCancel={() => setConfirmOut(false)}
        onConfirm={() => {
          clockOut();
          setConfirmOut(false);
        }}
      />
    </Screen>
  );
}

export function TaskBadge({ status }: { status: string }) {
  if (status === "completed") return <Badge tone="green">Completed</Badge>;
  if (status === "review") return <Badge tone="amber">Awaiting Review</Badge>;
  if (status === "due") return <Badge tone="red">Due Now</Badge>;
  return <Badge>Pending</Badge>;
}

function QuickAction({
  icon,
  label,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex min-h-[88px] flex-col items-start justify-between border border-border/70 bg-card p-3.5 text-left transition-transform duration-200 active:scale-[0.98]"
    >
      <span className="flex h-9 w-9 items-center justify-center bg-accent text-primary">
        {icon}
      </span>
      <span className="text-[15px] leading-tight font-semibold text-foreground">{label}</span>
    </button>
  );
}
