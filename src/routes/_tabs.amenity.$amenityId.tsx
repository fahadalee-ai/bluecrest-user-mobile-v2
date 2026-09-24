import { Link, createFileRoute, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { Badge, Card, NavBar, Screen, SectionHeader } from "@/components/ios";
import { inspectionPhotos } from "@/data/bluecrest";
import { useApp } from "@/lib/app-state";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_tabs/amenity/$amenityId")({
  head: () => ({
    meta: [{ title: "Amenity — Bluecrest Client" }],
  }),
  notFoundComponent: () => (
    <Screen>
      <p className="pt-16 text-center text-[17px] text-muted-foreground">Amenity not found.</p>
    </Screen>
  ),
  component: AmenityDetail,
});

function AmenityDetail() {
  const { amenityId } = Route.useParams();
  const { amenities, properties } = useApp();
  const amenity = amenities.find((a) => a.id === amenityId);
  if (!amenity) throw notFound();
  const property = properties.find((p) => p.id === amenity.propertyId);
  const [open, setOpen] = useState(false);
  const photos = inspectionPhotos.filter((p) => p.amenityId === amenityId);
  const maxCl = Math.max(...amenity.history.map((h) => h.chlorine), 4);

  return (
    <>
      <NavBar title={amenity.name} />
      <div>
        <img src={amenity.photo} alt={amenity.name} className="h-52 w-full object-cover" />
        <Screen>
          <p className="text-[13px] text-muted-foreground">{property?.name}</p>
          <h1 className="text-title text-navy">{amenity.name}</h1>
          <p className="mt-1 text-[15px] text-muted-foreground">{amenity.type}</p>

          <Card className="mt-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-[15px] font-semibold text-navy">
                  Water Quality:{" "}
                  {amenity.waterStatus === "safe" ? "Within Safe Range" : "Needs Review"}{" "}
                  {amenity.waterStatus === "safe" ? "✓" : ""}
                </p>
                <p className="mt-1 text-[13px] text-muted-foreground">
                  Last tested {amenity.lastTestedLabel}
                </p>
              </div>
              <Badge tone={amenity.waterStatus === "safe" ? "green" : "amber"}>
                {amenity.waterStatus === "safe" ? "Safe" : "Watch"}
              </Badge>
            </div>
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              className="mt-3 flex min-h-11 items-center gap-1 text-[15px] font-semibold text-primary"
            >
              View Details
              <ChevronDown className={cn("h-4 w-4 transition-transform", open && "rotate-180")} />
            </button>
            {open && (
              <div className="mt-2 grid grid-cols-3 gap-2 border-t border-border/70 pt-3">
                <Stat label="Chlorine" value={`${amenity.readings.chlorine} ppm`} />
                <Stat label="pH" value={String(amenity.readings.ph)} />
                <Stat label="Temp" value={`${amenity.readings.temp}°F`} />
              </div>
            )}
          </Card>

          <SectionHeader>Recent Test History</SectionHeader>
          <Card>
            <div className="flex h-24 items-end gap-1.5">
              {amenity.history
                .slice()
                .reverse()
                .map((h) => (
                  <div key={`${h.date}-${h.time}`} className="flex flex-1 flex-col items-center gap-1">
                    <div
                      className="w-full bg-primary"
                      style={{ height: `${Math.max(18, (h.chlorine / maxCl) * 100)}%` }}
                    />
                    <span className="text-[10px] text-muted-foreground">{h.date.split(" ")[1] ?? h.date}</span>
                  </div>
                ))}
            </div>
            <ul className="mt-4 divide-y divide-border/70">
              {amenity.history.map((h) => (
                <li key={`${h.date}-${h.time}`} className="flex items-center justify-between py-2 text-[13px]">
                  <span className="text-muted-foreground">
                    {h.date} · {h.time}
                  </span>
                  <span className="font-semibold text-navy">
                    {h.chlorine} ppm · pH {h.ph}
                  </span>
                </li>
              ))}
            </ul>
          </Card>

          <SectionHeader>Recent Photos</SectionHeader>
          {photos.length === 0 ? (
            <p className="text-[15px] text-muted-foreground">No recent verification photos.</p>
          ) : (
            <div className="flex gap-2 overflow-x-auto hide-scrollbar">
              {photos.map((p) => (
                <Link
                  key={p.id}
                  to="/photos"
                  search={{ amenityId, propertyId: amenity.propertyId }}
                  className="shrink-0"
                >
                  <img src={p.src} alt={p.label} className="h-24 w-24 object-cover" />
                </Link>
              ))}
            </div>
          )}
        </Screen>
      </div>
    </>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-muted px-2 py-2 text-center">
      <p className="text-[15px] font-semibold text-navy">{value}</p>
      <p className="text-[11px] text-muted-foreground">{label}</p>
    </div>
  );
}
