import { Link, createFileRoute, notFound } from "@tanstack/react-router";
import { Badge, Card, NavBar, Screen, SectionHeader } from "@/components/ios";
import { CommentBox, PhotoGrid, StepTracker } from "@/components/client/widgets";
import { useApp } from "@/lib/app-state";
import { propertyById, requestStatusTone } from "@/data/bluecrest";

export const Route = createFileRoute("/_tabs/request/$requestId")({
  head: () => ({ meta: [{ title: "Service Request — Bluecrest Client" }] }),
  notFoundComponent: () => (
    <Screen>
      <p className="pt-16 text-center text-[17px] text-muted-foreground">Request not found.</p>
    </Screen>
  ),
  component: RequestDetail,
});

function RequestDetail() {
  const { requestId } = Route.useParams();
  const { requests, addRequestComment } = useApp();
  const req = requests.find((r) => r.id === requestId);
  if (!req) throw notFound();

  return (
    <>
      <NavBar title={`Request #${req.number}`} />
      <Screen>
        <Badge tone={requestStatusTone(req.status)}>{req.status}</Badge>
        <h1 className="mt-3 text-title text-navy">{req.title}</h1>
        <p className="mt-1 text-[15px] text-muted-foreground">
          {propertyById(req.propertyId)?.name} · {req.submitted} · {req.priority}
        </p>
        <p className="mt-4 text-[15px] leading-relaxed">{req.description}</p>

        <SectionHeader>Status</SectionHeader>
        <Card>
          <StepTracker status={req.status} />
        </Card>

        {req.notes && (
          <>
            <SectionHeader>Notes from Bluecrest</SectionHeader>
            <Card>
              <p className="text-[15px] leading-relaxed">{req.notes}</p>
            </Card>
          </>
        )}

        {req.photos.length > 0 && (
          <>
            <SectionHeader>Attachments</SectionHeader>
            <PhotoGrid
              photos={req.photos.map((src, i) => ({
                id: `${req.id}-${i}`,
                src,
                label: "Attachment",
              }))}
            />
          </>
        )}

        <SectionHeader
          action={
            <Link
              to="/thread/$threadId"
              params={{ threadId: req.threadId }}
              className="text-[13px] font-semibold text-primary"
            >
              Open in Messages
            </Link>
          }
        >
          Comments
        </SectionHeader>
        <div className="mb-3 space-y-3">
          {req.comments.map((c) => (
            <div key={c.id} className={c.from === "me" ? "text-right" : ""}>
              <p className="text-[12px] text-muted-foreground">
                {c.sender} · {c.time}
              </p>
              <p
                className={
                  c.from === "me"
                    ? "mt-1 inline-block bg-primary px-3 py-2 text-left text-[15px] text-primary-foreground"
                    : "mt-1 inline-block bg-muted px-3 py-2 text-[15px] text-navy"
                }
              >
                {c.text}
              </p>
            </div>
          ))}
        </div>
        <CommentBox onSend={(t) => addRequestComment(req.id, t)} />
      </Screen>
    </>
  );
}
