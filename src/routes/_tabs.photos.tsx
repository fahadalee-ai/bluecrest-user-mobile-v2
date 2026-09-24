import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { EmptyState, NavBar, Screen, SelectField } from "@/components/ios";
import { PhotoLightbox } from "@/components/client/widgets";
import {
  amenityById,
  inspectionPhotos,
  inspections,
  propertyById,
  withinDays,
} from "@/data/bluecrest";
import { useApp } from "@/lib/app-state";
import { Images } from "lucide-react";

export const Route = createFileRoute("/_tabs/photos")({
  validateSearch: (s: Record<string, unknown>) => ({
    propertyId: typeof s.propertyId === "string" ? s.propertyId : undefined,
    amenityId: typeof s.amenityId === "string" ? s.amenityId : undefined,
  }),
  head: () => ({
    meta: [{ title: "Photo Gallery — Bluecrest Client" }],
  }),
  component: PhotoGallery,
});

function PhotoGallery() {
  const { properties, amenities } = useApp();
  const search = Route.useSearch();
  const [propertyId, setPropertyId] = useState(search.propertyId ?? "all");
  const [amenityId, setAmenityId] = useState(search.amenityId ?? "all");
  const [range, setRange] = useState("90");
  const [open, setOpen] = useState<(typeof inspectionPhotos)[number] | null>(null);

  const amenityOptions = amenities.filter((a) => propertyId === "all" || a.propertyId === propertyId);
  const items = inspectionPhotos.filter((p) => {
    const insp = inspections.find((i) => i.id === p.inspectionId);
    return (
      (propertyId === "all" || p.propertyId === propertyId) &&
      (amenityId === "all" || p.amenityId === amenityId) &&
      (!insp || withinDays(insp.dateIso, Number(range)))
    );
  });

  return (
    <>
      <NavBar title="Photo Gallery" />
      <Screen>
        <div className="mb-4 grid grid-cols-2 gap-3">
          <SelectField
            label="Property"
            value={propertyId}
            onChange={(v) => {
              setPropertyId(v);
              setAmenityId("all");
            }}
            options={[
              { value: "all", label: "All" },
              ...properties.map((p) => ({ value: p.id, label: p.name })),
            ]}
          />
          <SelectField
            label="Amenity"
            value={amenityId}
            onChange={setAmenityId}
            options={[
              { value: "all", label: "All" },
              ...amenityOptions.map((a) => ({ value: a.id, label: a.name })),
            ]}
          />
        </div>
        <div className="mb-4">
          <SelectField
            label="Date range"
            value={range}
            onChange={setRange}
            options={[
              { value: "7", label: "Last 7 days" },
              { value: "30", label: "Last 30 days" },
              { value: "90", label: "Last 90 days" },
            ]}
          />
        </div>
        {items.length === 0 ? (
          <EmptyState
            icon={<Images className="h-7 w-7" />}
            title="No photos yet"
            description="Verified inspection photos for this filter will appear here."
          />
        ) : (
          <div className="grid grid-cols-3 gap-2">
            {items.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => setOpen(p)}
                className="overflow-hidden border border-border/70"
              >
                <img src={p.src} alt={p.label} className="h-28 w-full object-cover" />
              </button>
            ))}
          </div>
        )}
      </Screen>
      {open && (
        <PhotoLightbox
          src={open.src}
          label={open.label}
          timestamp={open.timestamp}
          context={`${propertyById(open.propertyId)?.name} · ${amenityById(open.amenityId)?.name} inspection`}
          onClose={() => setOpen(null)}
        />
      )}
    </>
  );
}
