import { Link, createFileRoute, notFound } from "@tanstack/react-router";
import { Badge, Card, NavBar, Screen, SectionHeader } from "@/components/ios";
import {
  amenitiesFor,
  inspections,
  issues,
  mapsUrl,
  properties,
  representative,
} from "@/data/bluecrest";
import { ChevronRight, ExternalLink, MessageCircle } from "lucide-react";

export const Route = createFileRoute("/_tabs/property/$propertyId")({
  loader: ({ params }) => {
    const p = properties.find((x) => x.id === params.propertyId);
    if (!p) throw notFound();
    return { name: p.name };
  },
  head: ({ loaderData }) => ({
    meta: [{ title: loaderData ? `${loaderData.name} — Bluecrest Client` : "Property" }],
  }),
  notFoundComponent: () => (
    <Screen>
      <p className="pt-16 text-center text-[17px] text-muted-foreground">Property not found.</p>
    </Screen>
  ),
  component: PropertyDetail,
});

function PropertyDetail() {
  const { propertyId } = Route.useParams();
  const property = properties.find((p) => p.id === propertyId)!;
  const list = amenitiesFor(propertyId);
  const last = inspections.find((i) => i.propertyId === propertyId);
  const open = issues.filter((i) => i.propertyId === propertyId && i.status !== "Resolved");

  return (
    <>
      <NavBar title="Property" />
      <div>
        <img src={property.photo} alt={property.name} className="h-52 w-full object-cover" />
        <Screen>
          <h1 className="text-title text-navy">{property.name}</h1>
          <a
            href={mapsUrl(property.mapsQuery)}
            target="_blank"
            rel="noreferrer"
            className="mt-2 inline-flex min-h-11 items-center gap-1.5 text-[15px] text-primary"
          >
            {property.address}
            <ExternalLink className="h-4 w-4" />
            Open in Maps
          </a>

          <Card className="mt-5 flex items-center gap-3">
            <img
              src={representative.avatar}
              alt=""
              className="h-12 w-12 shrink-0 object-cover"
            />
            <div className="min-w-0 flex-1">
              <p className="text-[13px] text-muted-foreground">Assigned representative</p>
              <p className="text-[17px] font-semibold text-navy">{representative.name}</p>
              <p className="text-[13px] text-muted-foreground">{representative.title}</p>
            </div>
            <Link
              to="/thread/$threadId"
              params={{ threadId: "dana" }}
              className="inline-flex min-h-11 items-center gap-1.5 px-3 text-[15px] font-semibold text-primary"
            >
              <MessageCircle className="h-4 w-4" />
              Message
            </Link>
          </Card>

          <SectionHeader>Amenities</SectionHeader>
          <div className="space-y-3">
            {list.map((a) => (
              <Link
                key={a.id}
                to="/amenity/$amenityId"
                params={{ amenityId: a.id }}
                className="flex items-center gap-3 border border-border/70 bg-card p-3 active:bg-muted"
              >
                <img src={a.photo} alt="" className="h-16 w-16 shrink-0 object-cover" />
                <div className="min-w-0 flex-1">
                  <p className="text-[17px] font-semibold text-navy">{a.name}</p>
                  <p className="text-[13px] text-muted-foreground">Last tested: {a.lastTestedLabel}</p>
                </div>
                <Badge tone={a.waterStatus === "safe" ? "green" : "amber"}>
                  {a.waterStatus === "safe" ? "Safe Range" : "Watch"}
                </Badge>
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              </Link>
            ))}
          </div>

          <SectionHeader>Current Status</SectionHeader>
          <Card>
            <div className="flex items-center justify-between">
              <span className="text-[15px] text-muted-foreground">Compliance</span>
              <Badge tone={property.compliance === "compliant" ? "green" : "amber"}>
                {property.compliance === "compliant" ? "Compliant" : "Needs Attention"}
              </Badge>
            </div>
            <p className="mt-3 text-[15px]">
              Last inspection: {last ? `${last.date} · ${last.time}` : "—"}
            </p>
            {open.length > 0 && (
              <div className="mt-3 space-y-2">
                {open.map((iss) => (
                  <Link
                    key={iss.id}
                    to="/issue/$issueId"
                    params={{ issueId: iss.id }}
                    className="block text-[15px] text-primary"
                  >
                    {iss.title}
                  </Link>
                ))}
              </div>
            )}
          </Card>

          <SectionHeader>Quick links</SectionHeader>
          <div className="space-y-2">
            <Link
              to="/inspection-history"
              search={{ propertyId }}
              className="flex min-h-12 items-center justify-between border border-border/70 bg-card px-4 text-[15px] font-semibold text-navy"
            >
              View Inspection History
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </Link>
            <Link
              to="/reports"
              className="flex min-h-12 items-center justify-between border border-border/70 bg-card px-4 text-[15px] font-semibold text-navy"
            >
              View Service History
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </Link>
            <Link
              to="/request-new"
              search={{ propertyId }}
              className="flex min-h-12 items-center justify-between border border-border/70 bg-card px-4 text-[15px] font-semibold text-navy"
            >
              Submit a Request for This Property
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </Link>
          </div>
        </Screen>
      </div>
    </>
  );
}
