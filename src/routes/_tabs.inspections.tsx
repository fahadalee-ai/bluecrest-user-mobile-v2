import { Link, createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Badge, EmptyState, NavBar, PullToRefresh, Screen, SelectField } from "@/components/ios";
import { ClipboardCheck } from "lucide-react";
import {
  amenityById,
  inspections,
  propertyById,
  resultLabel,
  resultTone,
  withinDays,
} from "@/data/bluecrest";
import { useApp } from "@/lib/app-state";

export const Route = createFileRoute("/_tabs/inspections")({
  head: () => ({
    meta: [
      { title: "Inspections — Bluecrest Client" },
      { name: "description", content: "Inspection reports across your properties." },
    ],
  }),
  component: InspectionsList,
});

function InspectionsList() {
  const { properties } = useApp();
  const [propertyId, setPropertyId] = useState("all");
  const [range, setRange] = useState("90");
  const list = inspections.filter(
    (i) =>
      (propertyId === "all" || i.propertyId === propertyId) &&
      withinDays(i.dateIso, Number(range)),
  );

  return (
    <>
      <NavBar
        title="Inspections"
        back={false}
        trailing={
          <div className="flex items-center">
            <Link
              to="/inspection-history"
              className="min-h-11 px-2 text-[15px] font-semibold text-primary"
            >
              History
            </Link>
            <Link to="/photos" className="min-h-11 px-2 text-[15px] font-semibold text-primary">
              Gallery
            </Link>
          </div>
        }
      />
      <Screen>
        <PullToRefresh />
        <div className="mb-4 grid grid-cols-2 gap-3">
          <SelectField
            label="Property"
            value={propertyId}
            onChange={setPropertyId}
            options={[
              { value: "all", label: "All properties" },
              ...properties.map((p) => ({ value: p.id, label: p.name })),
            ]}
          />
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
        {list.length === 0 ? (
          <EmptyState
            icon={<ClipboardCheck className="h-7 w-7" />}
            title="No inspections in this range"
            description="Try another property or a wider date range."
          />
        ) : (
        <div className="space-y-3">
          {list.map((insp) => {
            const prop = propertyById(insp.propertyId);
            const amenity = amenityById(insp.amenityId);
            return (
              <Link
                key={insp.id}
                to="/inspection/$inspectionId"
                params={{ inspectionId: insp.id }}
                className="block border border-border/70 bg-card p-4 active:bg-muted"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate text-[17px] font-semibold text-navy">{prop?.name}</p>
                    <p className="mt-0.5 text-[15px] text-muted-foreground">{amenity?.name}</p>
                    <p className="mt-1 text-[13px] text-muted-foreground">
                      {insp.date} · {insp.time} · {insp.inspector}
                    </p>
                  </div>
                  <Badge tone={resultTone(insp.result)}>{resultLabel(insp.result)}</Badge>
                </div>
              </Link>
            );
          })}
        </div>
        )}
      </Screen>
    </>
  );
}
