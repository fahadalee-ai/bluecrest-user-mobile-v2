import { Link, createFileRoute, notFound } from "@tanstack/react-router";
import { Badge, Card, NavBar, Screen, SectionHeader } from "@/components/ios";
import { CommentBox, PhotoGrid } from "@/components/client/widgets";
import { useApp } from "@/lib/app-state";
import { issueStatusTone, priorityTone, propertyById } from "@/data/bluecrest";

export const Route = createFileRoute("/_tabs/issue/$issueId")({
  loader: ({ params }) => ({ issueId: params.issueId }),
  head: () => ({ meta: [{ title: "Issue — Bluecrest Client" }] }),
  notFoundComponent: () => (
    <Screen>
      <p className="pt-16 text-center text-[17px] text-muted-foreground">Issue not found.</p>
    </Screen>
  ),
  component: IssueDetail,
});

function IssueDetail() {
  const { issueId } = Route.useParams();
  const { issues, addIssueComment } = useApp();
  const issue = issues.find((i) => i.id === issueId);
  if (!issue) throw notFound();

  return (
    <>
      <NavBar title="Issue" />
      <Screen>
        <div className="flex flex-wrap gap-2">
          <Badge tone={priorityTone(issue.priority)}>{issue.priority}</Badge>
          <Badge tone={issueStatusTone(issue.status)}>{issue.status}</Badge>
        </div>
        <h1 className="mt-3 text-title text-navy">{issue.title}</h1>
        <p className="mt-1 text-[15px] text-muted-foreground">
          {issue.type} · {propertyById(issue.propertyId)?.name} · {issue.date}
        </p>
        <p className="mt-4 text-[15px] leading-relaxed">{issue.description}</p>

        {issue.photos.length > 0 && (
          <>
            <SectionHeader>Supporting photos</SectionHeader>
            <PhotoGrid
              photos={issue.photos.map((src, i) => ({
                id: `${issue.id}-${i}`,
                src,
                label: "Issue photo",
                timestamp: issue.date,
              }))}
            />
          </>
        )}

        <SectionHeader>Resolution timeline</SectionHeader>
        <Card>
          <ol>
            {issue.timeline.map((step, i) => (
              <li key={step.label} className="flex gap-3">
                <div className="flex flex-col items-center">
                  <span className={`mt-1 h-3 w-3 ${step.done ? "bg-primary" : "bg-muted"}`} />
                  {i < issue.timeline.length - 1 && (
                    <span className={`w-0.5 flex-1 min-h-6 ${step.done ? "bg-primary" : "bg-border"}`} />
                  )}
                </div>
                <div className="pb-4">
                  <p className="text-[15px] font-semibold text-navy">{step.label}</p>
                  <p className="text-[13px] text-muted-foreground">{step.time}</p>
                </div>
              </li>
            ))}
          </ol>
        </Card>

        <SectionHeader
          action={
            <Link
              to="/thread/$threadId"
              params={{ threadId: issue.threadId }}
              className="text-[13px] font-semibold text-primary"
            >
              Open in Messages
            </Link>
          }
        >
          Comments
        </SectionHeader>
        <div className="mb-3 space-y-3">
          {issue.comments.map((c) => (
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
        <CommentBox onSend={(t) => addIssueComment(issue.id, t)} />
      </Screen>
    </>
  );
}
