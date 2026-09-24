import { Link, createFileRoute, useNavigate } from "@tanstack/react-router";
import { NavBar, Screen } from "@/components/ios";
import { photoTypes, sites } from "@/data/bluecrest";
import { useApp } from "@/lib/app-state";
import {
  AlertTriangle,
  Camera,
  Check,
  Droplets,
  FlaskConical,
  Images,
  LifeBuoy,
  Waves,
  Wrench,
} from "lucide-react";

export const Route = createFileRoute("/_tabs/camera")({
  head: () => ({
    meta: [
      { title: "Verify Photo — Bluecrest Staff" },
      {
        name: "description",
        content: "Capture live, GPS-stamped verification photos for opening, closing, water tests and incidents.",
      },
      { property: "og:title", content: "Verify Photo — Bluecrest Staff" },
      {
        property: "og:description",
        content: "Live camera verification with GPS and timestamp — no gallery uploads.",
      },
    ],
  }),
  component: PhotoTypeSelector,
});

const iconMap: Record<string, typeof Waves> = {
  waves: Waves,
  wrench: Wrench,
  "life-buoy": LifeBuoy,
  flask: FlaskConical,
  droplet: Droplets,
  alert: AlertTriangle,
};

function PhotoTypeSelector() {
  const navigate = useNavigate();
  const { photos, activeSiteId } = useApp();
  const site = sites.find((s) => s.id === activeSiteId)!;
  const groups = ["Opening", "Closing", "Water Test Verification", "Incident"];

  return (
    <>
      <NavBar
        title="Verify Photo"
        back={false}
        trailing={
          <Link
            to="/photos"
            aria-label="My submitted photos"
            className="flex h-11 w-11 items-center justify-center text-primary"
          >
            <Images className="h-5 w-5" />
          </Link>
        }
      />
      <Screen>
        <p className="mb-4 text-[15px] text-muted-foreground">
          Photos are captured live with GPS and timestamp verification at{" "}
          <span className="font-semibold text-foreground">{site.name}</span>. Gallery uploads are
          not permitted for compliance photos.
        </p>

        {groups.map((g) => {
          const items = photoTypes.filter((p) => p.group === g);
          return (
            <section key={g} className="mb-5">
              <h2 className="mb-2 px-1 text-[13px] font-semibold tracking-wide text-muted-foreground uppercase">
                {g}
              </h2>
              <div className="grid grid-cols-2 gap-3">
                {items.map((p) => {
                  const Icon = iconMap[p.icon] ?? Camera;
                  const done = photos.some((ph) => ph.typeId === p.id);
                  return (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() =>
                        navigate({
                          to: "/capture",
                          search: { type: p.id, slot: `type:${p.id}`, siteId: site.id },
                        })
                      }
                      className="relative flex min-h-[92px] flex-col items-start justify-between border border-border/70 bg-card p-3.5 text-left active:scale-[0.98]"
                    >
                      <span className="flex h-9 w-9 items-center justify-center bg-accent text-primary">
                        <Icon className="h-5 w-5" />
                      </span>
                      <span className="text-[15px] font-semibold">{p.label}</span>
                      {done && (
                        <>
                          <span className="absolute top-3 right-3 flex h-6 w-6 items-center justify-center bg-success text-primary-foreground">
                            <Check className="h-4 w-4" />
                          </span>
                          <span className="absolute right-3 bottom-3 text-[12px] font-semibold text-primary">
                            Retake
                          </span>
                        </>
                      )}
                    </button>
                  );
                })}
              </div>
            </section>
          );
        })}
      </Screen>
    </>
  );
}
