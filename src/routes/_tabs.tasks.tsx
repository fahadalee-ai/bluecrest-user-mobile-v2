import { Link, createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Card, NavBar, PullToRefresh, Screen } from "@/components/ios";
import { sites } from "@/data/bluecrest";
import { useApp } from "@/lib/app-state";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { TaskBadge } from "./_tabs.home";

export const Route = createFileRoute("/_tabs/tasks")({
  head: () => ({
    meta: [
      { title: "Tasks — Bluecrest Staff" },
      {
        name: "description",
        content: "Opening, ongoing and closing tasks for your assigned pool sites, with due times and status.",
      },
      { property: "og:title", content: "Tasks — Bluecrest Staff" },
      {
        property: "og:description",
        content: "Opening, ongoing and closing tasks with due times and status.",
      },
    ],
  }),
  component: TaskList,
});

const filters = ["All", "Pending", "Due Now", "Completed"] as const;

function TaskList() {
  const { tasks } = useApp();
  const [filter, setFilter] = useState<(typeof filters)[number]>("All");
  const [siteId, setSiteId] = useState("all");

  const visible = tasks.filter((t) => {
    if (siteId !== "all" && t.siteId !== siteId) return false;
    if (filter === "Pending") return t.status === "pending";
    if (filter === "Due Now") return t.status === "due";
    if (filter === "Completed") return t.status === "completed" || t.status === "review";
    return true;
  });

  const categories = ["Opening", "Ongoing", "Closing"] as const;

  return (
    <>
      <NavBar title="Tasks" />
      <div className="sticky top-11 z-20 border-b border-border/70 bg-background/95 px-4 py-2 backdrop-blur">
        <div className="hide-scrollbar flex gap-2 overflow-x-auto">
          {filters.map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setFilter(f)}
              className={cn(
                "min-h-9 shrink-0 px-3.5 text-[13px] font-semibold transition-colors",
                filter === f ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground",
              )}
            >
              {f}
            </button>
          ))}
          <select
            value={siteId}
            onChange={(e) => setSiteId(e.target.value)}
            aria-label="Filter by site"
            className="min-h-9 shrink-0 bg-muted px-3 text-[13px] font-semibold text-muted-foreground"
          >
            <option value="all">All Sites</option>
            {sites.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <Screen>
        <PullToRefresh />
        {categories.map((c) => {
          const items = visible.filter((t) => t.category === c);
          if (!items.length) return null;
          return (
            <section key={c} className="mb-5">
              <h2 className="mb-2 px-1 text-[13px] font-semibold tracking-wide text-muted-foreground uppercase">
                {c}
              </h2>
              <Card className="p-0">
                <div className="divide-y divide-border/70">
                  {items.map((t) => (
                    <Link
                      key={t.id}
                      to="/task/$taskId"
                      params={{ taskId: t.id }}
                      className="flex min-h-[56px] items-center gap-3 px-4 py-3 active:bg-muted"
                    >
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-[15px] font-medium">{t.name}</span>
                        <span className="block text-[12px] text-muted-foreground">
                          {t.completedTime ? `Completed ${t.completedTime}` : `Due ${t.dueTime}`}
                        </span>
                      </span>
                      <TaskBadge status={t.status} />
                      <ChevronRight className="h-4 w-4 text-muted-foreground" />
                    </Link>
                  ))}
                </div>
              </Card>
            </section>
          );
        })}
        {visible.length === 0 && (
          <p className="pt-16 text-center text-[15px] text-muted-foreground">
            No tasks match this filter.
          </p>
        )}
      </Screen>
    </>
  );
}
