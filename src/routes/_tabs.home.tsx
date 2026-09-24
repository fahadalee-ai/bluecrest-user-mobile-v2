import { Link, createFileRoute, useNavigate } from "@tanstack/react-router";
import {
  Badge,
  Card,
  PullToRefresh,
  Screen,
  SectionHeader,
} from "@/components/ios";
import { useApp } from "@/lib/app-state";
import {
  activity,
  greeting,
  inspections,
  issues,
  properties,
  propertyById,
  resultLabel,
  resultTone,
  issueStatusTone,
} from "@/data/bluecrest";
import {
  Bell,
  CheckCircle2,
  ChevronRight,
  ClipboardCheck,
  FilePlus2,
  MessageCircle,
} from "lucide-react";

export const Route = createFileRoute("/_tabs/home")({
  head: () => ({
    meta: [
      { title: "Home — Bluecrest Client" },
      {
        name: "description",
        content: "Portfolio status, recent inspections, open issues and a direct line to Bluecrest.",
      },
      { property: "og:title", content: "Home — Bluecrest Client" },
      {
        property: "og:description",
        content: "See whether everything is okay at your properties, at a glance.",
      },
    ],
  }),
  component: HomeScreen,
});

function HomeScreen() {
  const navigate = useNavigate();
  const { client, notifications, requests } = useApp();
  const unread = notifications.filter((n) => n.unread).length;
  const openIssues = issues.filter((i) => i.status !== "Resolved");
  const pendingRequests = requests.filter((r) => r.status !== "Completed");
  const attention = properties.filter((p) => p.compliance === "attention").length;
  const recentInspections = inspections.slice(0, 4);

  return (
    <Screen className="ios-status">
      <PullToRefresh />
      <header className="mb-6 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h1 className="text-large-title text-navy">
            {greeting()}, {client.firstName}
          </h1>
          <p className="mt-1 text-[15px] text-muted-foreground">{client.company}</p>
        </div>
        <div className="flex shrink-0 items-center gap-2">
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
          <Link
            to="/profile"
            aria-label="Profile and account"
            className="flex h-11 w-11 items-center justify-center overflow-hidden bg-card shadow-sm"
          >
            <img src={client.avatar} alt="" className="h-full w-full object-cover" />
          </Link>
        </div>
      </header>

      <Link to="/properties" className="mb-4 block">
        <div className="bg-navy px-5 py-5 text-navy-foreground shadow-[0_1px_2px_rgba(9,51,112,0.12)]">
          <p className="text-[13px] tracking-wide text-white/70 uppercase">Portfolio</p>
          <p className="mt-1 flex items-center gap-2 font-display text-[28px] leading-tight">
            {properties.length} Properties ·{" "}
            {attention ? "1 Needs Attention" : "All Compliant"}
            {attention ? (
              <span className="inline-block h-2.5 w-2.5 bg-warning" />
            ) : (
              <CheckCircle2 className="h-5 w-5 text-success" />
            )}
          </p>
        </div>
      </Link>

      <div className="mb-6 grid grid-cols-3 gap-2">
        {[
          { l: "Open Issues", v: String(openIssues.length) },
          { l: "Pending Requests", v: String(pendingRequests.length) },
          { l: "Last Inspection", v: "Today" },
        ].map((s) => (
          <Card key={s.l} className="p-3 text-center">
            <p className="text-[18px] font-bold text-navy">{s.v}</p>
            <p className="mt-0.5 text-[11px] leading-tight text-muted-foreground">{s.l}</p>
          </Card>
        ))}
      </div>

      <SectionHeader
        action={
          <Link to="/inspections" className="text-[13px] font-semibold text-primary">
            See all
          </Link>
        }
      >
        Recent Inspections
      </SectionHeader>
      <div className="mb-6 flex gap-3 overflow-x-auto hide-scrollbar">
        {recentInspections.map((insp) => {
          const prop = propertyById(insp.propertyId);
          return (
            <Link
              key={insp.id}
              to="/inspection/$inspectionId"
              params={{ inspectionId: insp.id }}
              className="w-[220px] shrink-0 overflow-hidden border border-border/70 bg-card"
            >
              <img src={prop?.photo} alt="" className="h-28 w-full object-cover" />
              <div className="p-3">
                <p className="truncate text-[15px] font-semibold text-navy">{prop?.name}</p>
                <p className="mt-0.5 text-[12px] text-muted-foreground">
                  {insp.date} · {insp.time}
                </p>
                <div className="mt-2">
                  <Badge tone={resultTone(insp.result)}>{resultLabel(insp.result)}</Badge>
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      <SectionHeader
        action={
          <Link to="/requests" className="text-[13px] font-semibold text-primary">
            See all
          </Link>
        }
      >
        Open Issues
      </SectionHeader>
      <Card className="mb-6 p-0">
        {openIssues.length === 0 ? (
          <p className="px-4 py-5 text-[15px] text-muted-foreground">No open issues.</p>
        ) : (
          <div className="divide-y divide-border/70">
            {openIssues.map((iss) => (
              <Link
                key={iss.id}
                to="/issue/$issueId"
                params={{ issueId: iss.id }}
                className="flex min-h-[52px] items-center gap-3 px-4 py-3 active:bg-muted"
              >
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-[15px] font-medium">{iss.title}</span>
                  <span className="block text-[12px] text-muted-foreground">
                    {propertyById(iss.propertyId)?.name}
                  </span>
                </span>
                <Badge tone={issueStatusTone(iss.status)}>{iss.status}</Badge>
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              </Link>
            ))}
          </div>
        )}
      </Card>

      <SectionHeader>Recent Activity</SectionHeader>
      <Card className="mb-6 p-0">
        <div className="divide-y divide-border/70">
          {activity.map((a) => (
            <Link
              key={a.id}
              to={a.href.to}
              params={a.href.params as never}
              className="flex items-center gap-3 px-4 py-3 active:bg-muted"
            >
              <CheckCircle2 className="h-4 w-4 shrink-0 text-primary" />
              <span className="flex-1 text-[15px]">{a.text}</span>
              <span className="text-[12px] text-muted-foreground">{a.time}</span>
            </Link>
          ))}
        </div>
      </Card>

      <SectionHeader>Quick Actions</SectionHeader>
      <div className="grid grid-cols-3 gap-2">
        <QuickAction
          icon={<FilePlus2 className="h-5 w-5" />}
          label="Submit Service Request"
          onClick={() => navigate({ to: "/request-new" })}
        />
        <QuickAction
          icon={<ClipboardCheck className="h-5 w-5" />}
          label="View Latest Report"
          onClick={() =>
            navigate({ to: "/inspection/$inspectionId", params: { inspectionId: "insp-today" } })
          }
        />
        <QuickAction
          icon={<MessageCircle className="h-5 w-5" />}
          label="Message Bluecrest"
          onClick={() => navigate({ to: "/thread/$threadId", params: { threadId: "dana" } })}
        />
      </div>
    </Screen>
  );
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
      className="flex min-h-[108px] flex-col items-start justify-between border border-border/70 bg-card p-3 text-left transition-transform duration-200 active:scale-[0.98]"
    >
      <span className="flex h-9 w-9 items-center justify-center bg-accent text-primary">{icon}</span>
      <span className="text-[13px] leading-tight font-semibold text-foreground">{label}</span>
    </button>
  );
}
