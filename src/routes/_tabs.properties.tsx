import { Link, createFileRoute } from "@tanstack/react-router";
import { Badge, NavBar, PullToRefresh, Screen } from "@/components/ios";
import { amenitiesFor, properties } from "@/data/bluecrest";

export const Route = createFileRoute("/_tabs/properties")({
  head: () => ({
    meta: [
      { title: "My Properties — Bluecrest Client" },
      {
        name: "description",
        content: "Every Bluecrest-serviced property on your account, with compliance status.",
      },
    ],
  }),
  component: PropertiesScreen,
});

function PropertiesScreen() {
  return (
    <>
      <NavBar title="My Properties" back={false} />
      <Screen>
        <PullToRefresh />
        <div className="space-y-4">
          {properties.map((p) => {
            const count = amenitiesFor(p.id).length;
            return (
              <Link
                key={p.id}
                to="/property/$propertyId"
                params={{ propertyId: p.id }}
                className="block overflow-hidden border border-border/70 bg-card transition-transform duration-200 active:scale-[0.99]"
              >
                <img
                  src={p.photo}
                  alt={p.name}
                  width={1280}
                  height={720}
                  className="h-40 w-full object-cover"
                />
                <div className="p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="truncate text-[17px] font-bold text-navy">{p.name}</p>
                      <p className="mt-0.5 truncate text-[15px] text-muted-foreground">{p.address}</p>
                    </div>
                    <Badge tone={p.compliance === "compliant" ? "green" : "amber"}>
                      {p.compliance === "compliant" ? "Compliant" : "Needs Attention"}
                    </Badge>
                  </div>
                  <span className="mt-3 inline-block bg-muted px-2.5 py-1 text-[12px] font-semibold text-navy">
                    {count} {count === 1 ? "Amenity" : "Amenities"}
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </Screen>
    </>
  );
}
