import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Badge, EmptyState, NavBar, Screen, SegmentedControl } from "@/components/ios";
import { useApp, type SubmittedPhoto } from "@/lib/app-state";
import { sites } from "@/data/bluecrest";
import { Camera, CheckCircle2, Clock, MapPin, X } from "lucide-react";

export const Route = createFileRoute("/_tabs/photos")({
  head: () => ({
    meta: [
      { title: "My Photos — Bluecrest Staff" },
      {
        name: "description",
        content: "Every verification photo you've submitted, with GPS metadata and approval status.",
      },
      { property: "og:title", content: "My Photos — Bluecrest Staff" },
      {
        property: "og:description",
        content: "Submitted verification photos with GPS metadata and approval status.",
      },
    ],
  }),
  component: MyPhotos,
});

function MyPhotos() {
  const { photos } = useApp();
  const [filter, setFilter] = useState("All");
  const [open, setOpen] = useState<SubmittedPhoto | null>(null);

  const items = photos.filter((p) => filter === "All" || p.siteId === filter);

  return (
    <>
      <NavBar title="My Submitted Photos" />
      <Screen>
        <SegmentedControl
          className="mb-4"
          value={filter}
          onChange={setFilter}
          options={[{ value: "All", label: "All sites" }, ...sites.map((s) => ({ value: s.id, label: s.name.split(" ")[0]! }))]}
        />

        {items.length === 0 ? (
          <EmptyState
            icon={<Camera className="h-7 w-7" />}
            title="No photos yet"
            description="Verification photos you capture will appear here with their GPS and timestamp."
          />
        ) : (
          <div className="grid grid-cols-3 gap-2">
            {items.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => setOpen(p)}
                className="relative overflow-hidden border border-border/70"
              >
                <img src={p.dataUrl} alt={p.label} className="h-28 w-full object-cover" />
                <span className="absolute top-1 right-1 flex h-5 w-5 items-center justify-center bg-card/90 text-success">
                  <CheckCircle2 className="h-4 w-4" />
                </span>
              </button>
            ))}
          </div>
        )}
      </Screen>

      {open && (
        <div className="fixed inset-0 z-50 mx-auto flex max-w-[520px] flex-col bg-black">
          <div className="flex justify-end p-4">
            <button
              type="button"
              aria-label="Close"
              onClick={() => setOpen(null)}
              className="flex h-11 w-11 items-center justify-center bg-white/15 text-white"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          <img src={open.dataUrl} alt={open.label} className="min-h-0 flex-1 object-contain" />
          <div className="bg-card p-5 pb-8">
            <p className="text-[17px] font-semibold">{open.label}</p>
            <p className="mt-1 text-[15px] text-muted-foreground">{open.timestamp}</p>
            <p className="mt-1 flex items-center gap-1.5 text-[13px] text-muted-foreground">
              <MapPin className="h-4 w-4" /> {open.coords} · {open.address}
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              <Badge tone={open.verified ? "green" : "amber"}>
                {open.verified ? "GPS Verified" : "Outside radius"}
              </Badge>
              <Badge tone={open.approval === "approved" ? "green" : "amber"}>
                {open.approval === "approved" ? (
                  <>
                    <CheckCircle2 className="h-3.5 w-3.5" /> Approved
                  </>
                ) : (
                  <>
                    <Clock className="h-3.5 w-3.5" /> Pending Review
                  </>
                )}
              </Badge>
            </div>
            {open.note && <p className="mt-3 text-[15px]">{open.note}</p>}
          </div>
        </div>
      )}
    </>
  );
}
