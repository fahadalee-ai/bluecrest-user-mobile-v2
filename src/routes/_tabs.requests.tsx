import { Link, createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Badge, EmptyState, NavBar, PullToRefresh, Screen, SegmentedControl } from "@/components/ios";
import { useApp } from "@/lib/app-state";
import {
  issues,
  issueStatusTone,
  priorityTone,
  propertyById,
  requestStatusTone,
  workOrders,
  workStatusTone,
} from "@/data/bluecrest";
import { Inbox, Plus } from "lucide-react";

export const Route = createFileRoute("/_tabs/requests")({
  validateSearch: (s: Record<string, unknown>) => ({
    tab: s.tab === "requests" || s.tab === "work" ? s.tab : "issues",
  }),
  head: () => ({
    meta: [{ title: "Requests & Work — Bluecrest Client" }],
  }),
  component: RequestsHub,
});

function RequestsHub() {
  const navigate = useNavigate();
  const search = Route.useSearch();
  const [tab, setTab] = useState(search.tab);
  const { requests } = useApp();

  return (
    <>
      <NavBar
        title="Requests & Work"
        back={false}
        trailing={
          tab === "requests" ? (
            <Link
              to="/request-new"
              aria-label="New request"
              className="flex h-11 w-11 items-center justify-center text-primary"
            >
              <Plus className="h-5 w-5" />
            </Link>
          ) : undefined
        }
      />
      <Screen>
        <PullToRefresh />
        <SegmentedControl
          className="mb-4"
          value={tab}
          onChange={(v) => setTab(v as typeof tab)}
          options={[
            { value: "issues", label: "Issues" },
            { value: "requests", label: "Requests" },
            { value: "work", label: "Work Orders" },
          ]}
        />

        {tab === "issues" && (
          <div className="space-y-3">
            {issues.map((iss) => (
              <Link
                key={iss.id}
                to="/issue/$issueId"
                params={{ issueId: iss.id }}
                className="block border border-border/70 bg-card p-4"
              >
                <div className="flex items-start justify-between gap-2">
                  <p className="text-[17px] font-semibold text-navy">{iss.title}</p>
                  <Badge tone={priorityTone(iss.priority)}>{iss.priority}</Badge>
                </div>
                <p className="mt-1 text-[13px] text-muted-foreground">
                  {iss.type} · {propertyById(iss.propertyId)?.name} · {iss.reportedAgo}
                </p>
                <div className="mt-2">
                  <Badge tone={issueStatusTone(iss.status)}>{iss.status}</Badge>
                </div>
              </Link>
            ))}
          </div>
        )}

        {tab === "requests" && (
          <div className="space-y-3">
            {requests.length === 0 ? (
              <EmptyState
                icon={<Inbox className="h-7 w-7" />}
                title="No service requests"
                description="Submit a request whenever you need extra attention at a property."
              />
            ) : (
              requests.map((r) => (
                <Link
                  key={r.id}
                  to="/request/$requestId"
                  params={{ requestId: r.id }}
                  className="block border border-border/70 bg-card p-4"
                >
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-[17px] font-semibold text-navy">{r.title}</p>
                    <Badge tone={requestStatusTone(r.status)}>{r.status}</Badge>
                  </div>
                  <p className="mt-1 text-[13px] text-muted-foreground">
                    #{r.number} · {propertyById(r.propertyId)?.name} · {r.submitted}
                  </p>
                </Link>
              ))
            )}
            <button
              type="button"
              onClick={() => navigate({ to: "/request-new" })}
              className="flex min-h-12 w-full items-center justify-center gap-2 text-[15px] font-semibold text-primary"
            >
              <Plus className="h-4 w-4" /> New Request
            </button>
          </div>
        )}

        {tab === "work" && (
          <div className="space-y-3">
            {workOrders.map((w) => (
              <Link
                key={w.id}
                to="/work-order/$workOrderId"
                params={{ workOrderId: w.id }}
                className="block border border-border/70 bg-card p-4"
              >
                <div className="flex items-start justify-between gap-2">
                  <p className="text-[17px] font-semibold text-navy">{w.title}</p>
                  <Badge tone={workStatusTone(w.status)}>{w.status}</Badge>
                </div>
                <p className="mt-1 text-[13px] text-muted-foreground">
                  {propertyById(w.propertyId)?.name} · {w.scheduled}
                </p>
              </Link>
            ))}
          </div>
        )}
      </Screen>
    </>
  );
}
