import { createFileRoute, notFound } from "@tanstack/react-router";
import { Badge, Card, NavBar, Screen, SectionHeader, StickyFooter } from "@/components/ios";
import { DownloadButton, PhotoGrid } from "@/components/client/widgets";
import {
  amenityById,
  inspections,
  photosForInspection,
  propertyById,
  resultLabel,
  resultTone,
} from "@/data/bluecrest";
import { Check, Minus, X } from "lucide-react";

export const Route = createFileRoute("/_tabs/inspection/$inspectionId")({
  loader: ({ params }) => {
    const i = inspections.find((x) => x.id === params.inspectionId);
    if (!i) throw notFound();
    return { name: propertyById(i.propertyId)?.name ?? "Inspection" };
  },
  head: ({ loaderData }) => ({
    meta: [{ title: loaderData ? `${loaderData.name} inspection` : "Inspection" }],
  }),
  notFoundComponent: () => (
    <Screen>
      <p className="pt-16 text-center text-[17px] text-muted-foreground">Inspection not found.</p>
    </Screen>
  ),
  component: InspectionDetail,
});

function InspectionDetail() {
  const { inspectionId } = Route.useParams();
  const insp = inspections.find((i) => i.id === inspectionId)!;
  const property = propertyById(insp.propertyId);
  const amenity = amenityById(insp.amenityId);
  const photos = photosForInspection(insp.id);

  return (
    <>
      <NavBar title="Inspection" />
      <Screen className="pb-32">
        <p className="text-[13px] text-muted-foreground">
          {insp.date} · {insp.time}
        </p>
        <h1 className="mt-1 text-title text-navy">{property?.name}</h1>
        <p className="mt-1 text-[15px] text-muted-foreground">
          {amenity?.name} · {insp.inspector}
        </p>
        <div className="mt-3">
          <Badge tone={resultTone(insp.result)}>{resultLabel(insp.result)}</Badge>
        </div>

        <SectionHeader>Checklist Results</SectionHeader>
        <Card className="p-0">
          <ul className="divide-y divide-border/70">
            {insp.checklist.map((item) => (
              <li key={item.id} className="flex min-h-[52px] items-center gap-3 px-4 py-3">
                <StatusIcon status={item.status} />
                <span className="flex-1 text-[15px]">{item.label}</span>
              </li>
            ))}
          </ul>
        </Card>

        {insp.notes && (
          <>
            <SectionHeader>Inspector Notes</SectionHeader>
            <Card>
              <p className="text-[15px] leading-relaxed">{insp.notes}</p>
            </Card>
          </>
        )}

        {photos.length > 0 && (
          <>
            <SectionHeader>Photos from This Inspection</SectionHeader>
            <PhotoGrid
              photos={photos.map((p) => ({
                id: p.id,
                src: p.src,
                label: p.label,
                timestamp: p.timestamp,
                context: `${property?.name} · ${amenity?.name} inspection`,
              }))}
            />
          </>
        )}
      </Screen>
      <StickyFooter>
        <DownloadButton label={`${property?.name} inspection ${insp.dateIso}`} />
      </StickyFooter>
    </>
  );
}

function StatusIcon({ status }: { status: string }) {
  if (status === "fail") {
    return (
      <span className="flex h-7 w-7 items-center justify-center bg-danger-soft text-danger">
        <X className="h-4 w-4" />
      </span>
    );
  }
  if (status === "note") {
    return (
      <span className="flex h-7 w-7 items-center justify-center bg-warning-soft text-warning">
        <Minus className="h-4 w-4" />
      </span>
    );
  }
  return (
    <span className="flex h-7 w-7 items-center justify-center bg-success-soft text-success">
      <Check className="h-4 w-4" />
    </span>
  );
}
