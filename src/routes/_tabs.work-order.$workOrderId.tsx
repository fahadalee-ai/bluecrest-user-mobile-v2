import { createFileRoute, notFound } from "@tanstack/react-router";
import { Badge, Card, NavBar, Screen, SectionHeader } from "@/components/ios";
import { PhotoGrid } from "@/components/client/widgets";
import { propertyById, workOrders, workStatusTone } from "@/data/bluecrest";

export const Route = createFileRoute("/_tabs/work-order/$workOrderId")({
  loader: ({ params }) => {
    const w = workOrders.find((x) => x.id === params.workOrderId);
    if (!w) throw notFound();
    return { name: w.title };
  },
  head: ({ loaderData }) => ({
    meta: [{ title: loaderData?.name ?? "Work Order" }],
  }),
  notFoundComponent: () => (
    <Screen>
      <p className="pt-16 text-center text-[17px] text-muted-foreground">Work order not found.</p>
    </Screen>
  ),
  component: WorkOrderDetail,
});

function WorkOrderDetail() {
  const { workOrderId } = Route.useParams();
  const wo = workOrders.find((w) => w.id === workOrderId)!;

  return (
    <>
      <NavBar title="Work Order" />
      <Screen>
        <Badge tone={workStatusTone(wo.status)}>{wo.status}</Badge>
        <h1 className="mt-3 text-title text-navy">{wo.title}</h1>
        <p className="mt-1 text-[15px] text-muted-foreground">
          {propertyById(wo.propertyId)?.name} · {wo.scheduled}
        </p>
        <p className="mt-4 text-[15px] leading-relaxed">{wo.description}</p>

        <SectionHeader>Progress notes</SectionHeader>
        <Card className="p-0">
          <ul className="divide-y divide-border/70">
            {wo.progressNotes.map((n) => (
              <li key={n} className="px-4 py-3 text-[15px]">
                {n}
              </li>
            ))}
          </ul>
        </Card>

        {wo.completionNote && (
          <>
            <SectionHeader>Completion</SectionHeader>
            <Card>
              <p className="text-[15px] leading-relaxed">{wo.completionNote}</p>
            </Card>
          </>
        )}

        {wo.photos.length > 0 && (
          <>
            <SectionHeader>Proof of work</SectionHeader>
            <PhotoGrid
              photos={wo.photos.map((p, i) => ({
                id: `${wo.id}-${i}`,
                src: p.src,
                label: p.label,
                timestamp: wo.scheduled,
              }))}
            />
          </>
        )}
      </Screen>
    </>
  );
}
