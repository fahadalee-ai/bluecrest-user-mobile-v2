import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { EmptyState, NavBar, Screen } from "@/components/ios";
import { useApp } from "@/lib/app-state";
import { Bell, ClipboardCheck, Inbox, Megaphone, MessageCircle, Wrench, X } from "lucide-react";
import { cn } from "@/lib/utils";
import type { NotificationType } from "@/data/bluecrest";

export const Route = createFileRoute("/_tabs/notifications")({
  head: () => ({
    meta: [
      { title: "Notifications — Bluecrest Client" },
      {
        name: "description",
        content: "Inspection, issue, work order, request, and announcement alerts.",
      },
    ],
  }),
  component: NotificationsScreen,
});

const icons: Record<NotificationType, typeof Bell> = {
  inspection: ClipboardCheck,
  issue: Inbox,
  work: Wrench,
  request: Inbox,
  announcement: Megaphone,
};

function NotificationsScreen() {
  const { notifications, markAllRead, dismissNotification } = useApp();
  const navigate = useNavigate();
  const groups = ["Today", "Yesterday", "Earlier"] as const;

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
            description="New inspections, issues, and request updates will show up here."
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
                    const Icon = icons[n.type] ?? MessageCircle;
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
                          onClick={() => navigate(n.href as never)}
                          className="min-w-0 flex-1 text-left"
                        >
                          <span
                            className={cn(
                              "flex items-center gap-2 text-[15px]",
                              n.unread ? "font-semibold text-foreground" : "text-foreground",
                            )}
                          >
                            {n.unread && <span className="h-2 w-2 shrink-0 bg-primary" />}
                            {n.title}
                          </span>
                          <span className="mt-0.5 block text-[13px] text-muted-foreground">
                            {n.description}
                          </span>
                          <span className="mt-1 block text-[12px] text-muted-foreground">{n.time}</span>
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
