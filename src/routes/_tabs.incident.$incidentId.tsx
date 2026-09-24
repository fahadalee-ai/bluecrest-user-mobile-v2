import { createFileRoute, notFound } from "@tanstack/react-router";
import { Badge, Card, NavBar, Screen, SectionHeader } from "@/components/ios";
import { incidents as seedIncidents, sites } from "@/data/bluecrest";
import { useApp } from "@/lib/app-state";
import { CheckCircle2 } from "lucide-react";

export const Route = createFileRoute("/_tabs/incident/$incidentId")({
  loader: ({ params }) => {
    const i = seedIncidents.find((x) => x.id === params.incidentId);
    return { title: i?.title ?? "Incident report" };
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: `${loaderData?.title ?? "Incident"} — Bluecrest Staff` },
      {
        name: "description",
        content: "Incident report detail with severity, description, photos and supervisor review timeline.",
      },
      { property: "og:title", content: `${loaderData?.title ?? "Incident"} — Bluecrest Staff` },
      {
        property: "og:description",
        content: "Severity, description, photos and review timeline for this incident.",
      },
    ],
  }),
  notFoundComponent: () => (
    <p className="pt-24 text-center text-[17px] text-muted-foreground">Incident not found.</p>
  ),
  component: IncidentDetail,
});

function IncidentDetail() {
  const { incidentId } = Route.useParams();
  const { incidents } = useApp();
  const incident = incidents.find((i) => i.id === incidentId);
  if (!incident) throw notFound();
  const site = sites.find((s) => s.id === incident.siteId);

  return (
    <>
      <NavBar title="Incident Report" />
      <Screen>
        <Card>
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-[12px] font-semibold tracking-wide text-primary uppercase">
                {incident.type}
              </p>
              <h1 className="mt-0.5 font-display text-[24px] leading-tight font-bold text-navy">
                {incident.title}
              </h1>
            </div>
            <Badge
              tone={
                incident.severity === "Critical" || incident.severity === "High"
                  ? "red"
                  : incident.severity === "Medium"
                    ? "amber"
                    : "green"
              }
            >
              {incident.severity}
            </Badge>
          </div>
          <p className="mt-2 text-[13px] text-muted-foreground">
            {site?.name} · {incident.date}
          </p>
          <div className="mt-3">
            <Badge tone={incident.status === "Resolved" ? "green" : "blue"}>{incident.status}</Badge>
          </div>
        </Card>

        <SectionHeader>Description</SectionHeader>
        <Card>
          <p className="text-[15px] leading-relaxed text-foreground">{incident.description}</p>
        </Card>

        {incident.photos.length > 0 && (
          <>
            <SectionHeader>Photos</SectionHeader>
            <div className="grid grid-cols-3 gap-2">
              {incident.photos.map((p, idx) => (
                <img
                  key={idx}
                  src={p}
                  alt={`Incident photo ${idx + 1}`}
                  className="aspect-square w-full object-cover"
                />
              ))}
            </div>
          </>
        )}

        <SectionHeader>Status Timeline</SectionHeader>
        <Card>
          <ol className="space-y-4">
            {incident.timeline.map((t, idx) => (
              <li key={idx} className="flex gap-3">
                <span className="relative flex flex-col items-center">
                  <CheckCircle2 className="h-5 w-5 text-success" />
                  {idx < incident.timeline.length - 1 && (
                    <span className="mt-1 w-px flex-1 bg-border" />
                  )}
                </span>
                <span className="pb-1">
                  <span className="block text-[15px] font-medium text-foreground">{t.label}</span>
                  <span className="block text-[13px] text-muted-foreground">{t.time}</span>
                </span>
              </li>
            ))}
          </ol>
        </Card>
      </Screen>
    </>
  );
}
