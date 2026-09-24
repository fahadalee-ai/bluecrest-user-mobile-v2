import { Link, createFileRoute } from "@tanstack/react-router";
import { EmptyState, NavBar, Screen } from "@/components/ios";
import { useApp } from "@/lib/app-state";
import logoWhite from "@/assets/bluecrest-logo-white.png";
import { MessagesSquare } from "lucide-react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_tabs/messages")({
  head: () => ({
    meta: [
      { title: "Messages — Bluecrest Client" },
      { name: "description", content: "Conversations with your Bluecrest representative." },
    ],
  }),
  component: MessagesList,
});

function MessagesList() {
  const { threads } = useApp();
  const sorted = [...threads].sort((a, b) => Number(!!b.pinned) - Number(!!a.pinned));

  return (
    <>
      <NavBar title="Messages" back={false} />
      <Screen>
        {sorted.length === 0 ? (
          <EmptyState
            icon={<MessagesSquare className="h-7 w-7" />}
            title="No messages yet"
            description="Your Bluecrest representative will appear here."
          />
        ) : (
          <div className="divide-y divide-border/70 overflow-hidden border border-border/70 bg-card">
            {sorted.map((t) => (
              <Link
                key={t.id}
                to="/thread/$threadId"
                params={{ threadId: t.id }}
                className={cn(
                  "flex min-h-[68px] items-center gap-3 px-4 py-3 active:bg-muted",
                  t.pinned && "bg-accent/60",
                )}
              >
                {t.kind === "announcement" ? (
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center bg-navy px-1">
                    <img src={logoWhite} alt="" className="h-7 w-full object-contain" />
                  </span>
                ) : t.avatar ? (
                  <img src={t.avatar} alt="" className="h-11 w-11 shrink-0 object-cover" />
                ) : (
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center bg-accent text-[13px] font-bold text-primary">
                    {t.name
                      .split(" ")
                      .map((p) => p[0])
                      .join("")
                      .slice(0, 2)}
                  </span>
                )}
                <span className="min-w-0 flex-1">
                  <span className="flex items-baseline justify-between gap-2">
                    <span className="truncate text-[17px] font-semibold">{t.name}</span>
                    <span className="shrink-0 text-[12px] text-muted-foreground">{t.lastTime}</span>
                  </span>
                  {t.title && (
                    <span className="block text-[12px] text-muted-foreground">{t.title}</span>
                  )}
                  <span className="mt-0.5 line-clamp-1 block text-[13px] text-muted-foreground">
                    {t.subtitle}
                  </span>
                </span>
                {t.unread > 0 && (
                  <span className="flex h-5 min-w-5 items-center justify-center bg-primary px-1.5 text-[11px] font-bold text-primary-foreground">
                    {t.unread}
                  </span>
                )}
              </Link>
            ))}
          </div>
        )}
      </Screen>
    </>
  );
}
