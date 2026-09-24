import { Link, createFileRoute } from "@tanstack/react-router";
import { Badge, Button, Card, EmptyState, NavBar, Screen } from "@/components/ios";
import { sites } from "@/data/bluecrest";
import { useApp } from "@/lib/app-state";
import { FileWarning, Plus } from "lucide-react";

export const Route = createFileRoute("/_tabs/incidents")({
  head: () => ({
    meta: [
      { title: "Incident Reports — Bluecrest Staff" },
      {
        name: "description",
        content: "Every incident you've reported, with severity, status and supervisor review timeline.",
      },
      { property: "og:title", content: "Incident Reports — Bluecrest Staff" },
      {
        property: "og:description",
        content: "Reported incidents with severity, status and review timeline.",
      },
    ],
  }),
  component: Incidents,
});

export function severityTone(s: string) {
  return s === "Critical" || s === "High" ? "red" : s === "Medium" ? "amber" : "green";
}

function Incidents() {
  const { incidents } = useApp();

  return (
    <>
      <NavBar
        title="Incident Reports"
        trailing={
          <Link
            to="/incident-new"
            aria-label="New incident report"
            className="flex h-11 w-11 items-center justify-center text-primary"
          >
            <Plus className="h-5 w-5" />
          </Link>
        }
      />
      <Screen>
        {incidents.length === 0 ? (
          <EmptyState
            icon={<FileWarning className="h-7 w-7" />}
            title="No incidents reported"
            description="Report injuries, rescues, chemical issues or damage as soon as they happen."
            action={
              <Link to="/incident-new">
                <Button>Report an Incident</Button>
              </Link>
            }
          />
        ) : (
          <div className="space-y-3">
            {incidents.map((i) => (
              <Link key={i.id} to="/incident/$incidentId" params={{ incidentId: i.id }}>
                <Card className="active:bg-muted">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-[12px] font-semibold tracking-wide text-primary uppercase">
                        {i.type}
                      </p>
                      <p className="mt-0.5 text-[17px] leading-tight font-semibold text-navy">
                        {i.title}
                      </p>
                      <p className="mt-1 text-[13px] text-muted-foreground">
                        {sites.find((s) => s.id === i.siteId)?.name}
                      </p>
                      <p className="text-[13px] text-muted-foreground">{i.date}</p>
                    </div>
                    <Badge tone={severityTone(i.severity)}>{i.severity}</Badge>
                  </div>
                  <div className="mt-3 border-t border-border/70 pt-2">
                    <Badge tone={i.status === "Resolved" ? "green" : "blue"}>{i.status}</Badge>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        )}

        <div className="mt-6">
          <Link to="/incident-new">
            <Button variant="secondary">
              <Plus className="h-4 w-4" /> New Incident Report
            </Button>
          </Link>
        </div>
      </Screen>
    </>
  );
}
