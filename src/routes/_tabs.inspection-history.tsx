import { Link, createFileRoute } from "@tanstack/react-router";
import { Badge, Card, NavBar, Screen, SectionHeader } from "@/components/ios";
import {
  amenityById,
  inspectionTrend,
  inspections,
  properties,
  propertyById,
  resultLabel,
  resultTone,
} from "@/data/bluecrest";

export const Route = createFileRoute("/_tabs/inspection-history")({
  validateSearch: (s: Record<string, unknown>) => ({
    propertyId: typeof s.propertyId === "string" ? s.propertyId : undefined,
  }),
  head: () => ({
    meta: [{ title: "Inspection History — Bluecrest Client" }],
  }),
  component: InspectionHistory,
});

function InspectionHistory() {
  const { propertyId } = Route.useSearch();
  const list = inspections.filter((i) => !propertyId || i.propertyId === propertyId);
  const title = propertyId ? (propertyById(propertyId)?.name ?? "History") : "All properties";

  return (
    <>
      <NavBar title="Inspection History" />
      <Screen>
        <Card className="mb-5">
          <p className="text-[13px] text-muted-foreground">{inspectionTrend.windowLabel}</p>
          <p className="mt-1 font-display text-[28px] text-navy">
            {inspectionTrend.passedClean} of {inspectionTrend.total}
          </p>
          <p className="mt-1 text-[15px] text-muted-foreground">
            inspections passed clean at {title}.
          </p>
          <div className="mt-4 flex h-20 items-end gap-1.5">
            {list
              .slice()
              .reverse()
              .map((i) => (
                <div
                  key={i.id}
                  className={
                    i.result === "passed"
                      ? "flex-1 bg-success"
                      : i.result === "notes"
                        ? "flex-1 bg-warning"
                        : "flex-1 bg-danger"
                  }
                  style={{ height: i.result === "passed" ? "100%" : i.result === "notes" ? "70%" : "45%" }}
                />
              ))}
          </div>
        </Card>

        <SectionHeader>Chronological</SectionHeader>
        <div className="space-y-2">
          {list.map((insp) => (
            <Link
              key={insp.id}
              to="/inspection/$inspectionId"
              params={{ inspectionId: insp.id }}
              className="flex items-center justify-between gap-3 border border-border/70 bg-card px-4 py-3"
            >
              <div className="min-w-0">
                <p className="truncate text-[15px] font-semibold text-navy">
                  {propertyById(insp.propertyId)?.name}
                </p>
                <p className="text-[13px] text-muted-foreground">
                  {amenityById(insp.amenityId)?.name} · {insp.date} · {insp.time}
                </p>
              </div>
              <Badge tone={resultTone(insp.result)}>{resultLabel(insp.result)}</Badge>
            </Link>
          ))}
        </div>

        {!propertyId && (
          <p className="mt-4 text-[13px] text-muted-foreground">
            Open a property for a filtered history. Properties:{" "}
            {properties.map((p) => p.name).join(", ")}.
          </p>
        )}
      </Screen>
    </>
  );
}
