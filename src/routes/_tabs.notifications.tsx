import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { EmptyState, NavBar, Screen } from "@/components/ios";
import { useApp } from "@/lib/app-state";
import {
  BadgeCheck,
  Bell,
  CheckCircle2,
  Droplets,
  MessageCircle,
  ShieldCheck,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_tabs/notifications")({
  head: () => ({
    meta: [
      { title: "Notifications — Bluecrest Staff" },
      {
        name: "description",
        content: "Task reminders, water test alerts, photo approvals and messages from your supervisor.",
      },
      { property: "og:title", content: "Notifications — Bluecrest Staff" },
      {
        property: "og:description",
        content: "Task reminders, water test alerts and supervisor messages in one place.",
      },
    ],
  }),
  component: NotificationsScreen,
});

const icons = {
  task: CheckCircle2,
  message: MessageCircle,
  photo: BadgeCheck,
  water: Droplets,
  cert: ShieldCheck,
};

function NotificationsScreen() {
  const { notifications, markAllRead, dismissNotification } = useApp();
  const navigate = useNavigate();
  const groups = ["Today", "Yesterday", "Earlier"] as const;

  const route = (type: string) => {
    if (type === "message") navigate({ to: "/thread/$threadId", params: { threadId: "dana" } });
    else if (type === "photo") navigate({ to: "/photos" });
    else if (type === "water") navigate({ to: "/water-test", search: { siteId: "manhattan-park" } });
    else if (type === "cert") navigate({ to: "/certifications" });
    else navigate({ to: "/tasks" });
  };

  return (
    <>
      <NavBar
        title="Notifications"
        trailing={
          <button
            type="button"
            onClick={markAllRead}
            className="min-h-11 px-2 text-[15px] font-medium text-primary"
          >
            Mark all as read
          </button>
        }
      />
      <Screen>
        {notifications.length === 0 ? (
          <EmptyState
            icon={<Bell className="h-7 w-7" />}
            title="You're all caught up"
            description="New reminders and messages will show up here."
          />
        ) : (
          groups.map((g) => {
            const items = notifications.filter((n) => n.group === g);
            if (!items.length) return null;
            return (
              <section key={g} className="mb-5">
                <h2 className="mb-2 px-1 text-[13px] font-semibold tracking-wide text-muted-foreground uppercase">
                  {g}
                </h2>
                <div className="divide-y divide-border/70 overflow-hidden border border-border/70 bg-card">
                  {items.map((n) => {
                    const Icon = icons[n.type];
                    return (
                      <div key={n.id} className="flex items-start gap-3 px-4 py-3">
                        <span
                          className={cn(
                            "mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center",
                            n.unread ? "bg-accent text-primary" : "bg-muted text-muted-foreground",
                          )}
                        >
                          <Icon className="h-4 w-4" />
                        </span>
                        <button
                          type="button"
                          onClick={() => route(n.type)}
                          className="min-w-0 flex-1 text-left"
                        >
                          <span
                            className={cn(
                              "flex items-center gap-2 text-[15px]",
                              n.unread ? "font-semibold text-foreground" : "text-foreground",
                            )}
                          >
                            {n.unread && <span className="h-2 w-2 bg-primary" />}
                            {n.title}
                          </span>
                          <span className="mt-0.5 block text-[13px] text-muted-foreground">
                            {n.description}
                          </span>
                          <span className="mt-1 block text-[12px] text-muted-foreground">
                            {n.time}
                          </span>
                        </button>
                        <button
                          type="button"
                          aria-label={`Dismiss ${n.title}`}
                          onClick={() => dismissNotification(n.id)}
                          className="flex h-11 w-11 shrink-0 items-center justify-center text-muted-foreground active:text-danger"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              </section>
            );
          })
        )}
      </Screen>
    </>
  );
}
