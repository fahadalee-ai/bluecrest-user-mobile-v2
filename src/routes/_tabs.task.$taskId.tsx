import { createFileRoute, notFound, useNavigate, useRouter } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Badge, Button, Card, NavBar, Screen, StickyFooter } from "@/components/ios";
import { WaterTestFields } from "@/components/water-test-form";
import { sites, tasks as seedTasks } from "@/data/bluecrest";
import { useApp } from "@/lib/app-state";
import { Camera, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { TaskBadge } from "./_tabs.home";

export const Route = createFileRoute("/_tabs/task/$taskId")({
  loader: ({ params }) => {
    const task = seedTasks.find((t) => t.id === params.taskId);
    if (!task) throw notFound();
    return { name: task.name };
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: loaderData ? `${loaderData.name} — Bluecrest Staff` : "Task — Bluecrest Staff" },
      {
        name: "description",
        content:
          "Complete each checklist item, attach required verification photos and mark the task complete.",
      },
      {
        property: "og:title",
        content: loaderData ? `${loaderData.name} — Bluecrest Staff` : "Task — Bluecrest Staff",
      },
      {
        property: "og:description",
        content: "Checklist completion with photo proof for Bluecrest lifeguard tasks.",
      },
    ],
  }),
  notFoundComponent: () => (
    <Screen>
      <p className="pt-16 text-center text-[17px] text-muted-foreground">Task not found.</p>
    </Screen>
  ),
  component: TaskDetail,
});

function TaskDetail() {
  const { taskId } = Route.useParams();
  const navigate = useNavigate();
  const router = useRouter();
  const { tasks, completeTask, captures } = useApp();
  const task = tasks.find((t) => t.id === taskId)!;
  const site = sites.find((s) => s.id === task.siteId)!;

  const isWaterTest = task.items.some((i) => i.linksTo === "water-test");
  const alreadyDone = task.status === "completed" || task.status === "review";

  const [checked, setChecked] = useState<Record<string, boolean>>(
    alreadyDone ? Object.fromEntries(task.items.map((i) => [i.id, true])) : {},
  );
  const [notes, setNotes] = useState("");

  const photoOk = (itemId: string) =>
    alreadyDone || Boolean(captures[`task:${task.id}:${itemId}`]);

  const canComplete = task.items.every(
    (i) => checked[i.id] && (!i.requiresPhoto || photoOk(i.id)),
  );

  if (isWaterTest) {
    return (
      <>
        <NavBar title={task.name} />
        <Screen>
          <Card className="mb-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-[17px] font-semibold text-navy">{site.name}</p>
                <p className="mt-0.5 text-[13px] text-muted-foreground">
                  Due {task.dueTime} · {task.assignedBy}
                </p>
              </div>
              <TaskBadge status={task.status} />
            </div>
          </Card>

          <WaterTestFields
            siteId={site.id}
            siteName={site.name}
            captureSlot={`task:${task.id}:water-test`}
            alreadyDone={alreadyDone}
            submitLabel="Submit Water Test & Complete"
            onSubmitted={() => {
              completeTask(task.id);
              router.history.back();
            }}
          />

          {task.status === "review" && (
            <div className="mt-4 flex justify-center">
              <Badge tone="amber">Awaiting Supervisor Review</Badge>
            </div>
          )}
        </Screen>
      </>
    );
  }

  return (
    <>
      <NavBar title={task.name} />
      <Screen>
        <Card className="mb-5">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-[17px] font-semibold text-navy">{site.name}</p>
              <p className="mt-0.5 text-[13px] text-muted-foreground">
                Due {task.dueTime} · {task.assignedBy}
              </p>
            </div>
            <TaskBadge status={task.status} />
          </div>
        </Card>

        <h2 className="mb-2 px-1 text-[13px] font-semibold tracking-wide text-muted-foreground uppercase">
          Checklist
        </h2>
        <Card className="mb-5 p-0">
          <div className="divide-y divide-border/70">
            {task.items.map((item) => {
              const captureKey = `task:${task.id}:${item.id}`;
              const thumb = captures[captureKey];
              return (
                <div key={item.id} className="flex items-center gap-3 px-4 py-3">
                  <button
                    type="button"
                    aria-label={`Mark ${item.label}`}
                    aria-pressed={!!checked[item.id]}
                    disabled={alreadyDone}
                    onClick={() => setChecked((c) => ({ ...c, [item.id]: !c[item.id] }))}
                    className={cn(
                      "flex h-11 w-11 shrink-0 items-center justify-center border-2 transition-colors duration-200",
                      checked[item.id]
                        ? "border-success bg-success text-primary-foreground"
                        : "border-border text-transparent",
                    )}
                  >
                    <Check className="h-5 w-5" />
                  </button>
                  <span className="min-w-0 flex-1 text-[15px]">{item.label}</span>
                  {item.requiresPhoto &&
                    (thumb ? (
                      <img src={thumb} alt="Attached proof" className="h-11 w-11 object-cover" />
                    ) : (
                      <button
                        type="button"
                        aria-label={`Capture photo for ${item.label}`}
                        onClick={() =>
                          navigate({
                            to: "/capture",
                            search: {
                              type: "opening-equipment",
                              slot: captureKey,
                              siteId: site.id,
                              label: item.label,
                            },
                          })
                        }
                        className="flex h-11 w-11 items-center justify-center bg-accent text-primary"
                      >
                        <Camera className="h-4 w-4" />
                      </button>
                    ))}
                </div>
              );
            })}
          </div>
        </Card>

        <label className="block">
          <span className="mb-1.5 block text-[13px] font-semibold text-muted-foreground">
            Notes (optional)
          </span>
          <textarea
            rows={4}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Add any comments about this task..."
            className="w-full border border-input bg-card p-3.5 text-[17px] outline-none focus:border-primary focus:ring-2 focus:ring-ring/25"
          />
        </label>

        {task.requiresSignoff && (
          <p className="mt-3 text-center text-[13px] text-muted-foreground">
            This task requires supervisor sign-off after completion.
          </p>
        )}
        {task.status === "review" && (
          <div className="mt-4 flex justify-center">
            <Badge tone="amber">Awaiting Supervisor Review</Badge>
          </div>
        )}
      </Screen>

      {!alreadyDone && (
        <StickyFooter>
          <Button
            disabled={!canComplete}
            onClick={() => {
              completeTask(task.id);
              toast.success("Task completed");
              router.history.back();
            }}
          >
            Mark Task Complete
          </Button>
        </StickyFooter>
      )}
    </>
  );
}
