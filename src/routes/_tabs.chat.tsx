import { Link, createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Button, EmptyState, NavBar, Screen, SegmentedControl } from "@/components/ios";
import { useApp } from "@/lib/app-state";
import { Megaphone, MessageSquarePlus, MessagesSquare, Users } from "lucide-react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_tabs/chat")({
  head: () => ({
    meta: [
      { title: "Messages — Bluecrest Staff" },
      {
        name: "description",
        content: "Direct messages with your supervisor, site group threads and Bluecrest announcements.",
      },
      { property: "og:title", content: "Messages — Bluecrest Staff" },
      {
        property: "og:description",
        content: "Supervisor chat, site group threads and urgent announcements.",
      },
    ],
  }),
  component: Conversations,
});

function Conversations() {
  const { threads, broadcastAcknowledged, acknowledgeBroadcast } = useApp();
  const [filter, setFilter] = useState("All");

  const urgent = threads.find((t) => t.kind === "announcement" && t.urgent && t.unread > 0);
  const visible = threads.filter((t) => {
    if (filter === "Direct") return t.kind === "direct";
    if (filter === "Site Group") return t.kind === "group";
    if (filter === "Announcements") return t.kind === "announcement";
    return true;
  });
  const sorted = [...visible].sort((a, b) => Number(b.kind === "announcement") - Number(a.kind === "announcement"));

  return (
    <>
      <NavBar
        title="Messages"
        back={false}
        trailing={
          <Link
            to="/compose"
            aria-label="New message"
            className="flex h-11 w-11 items-center justify-center text-primary"
          >
            <MessageSquarePlus className="h-5 w-5" />
          </Link>
        }
      />
      <Screen>
        <SegmentedControl
          className="mb-4"
          value={filter}
          onChange={setFilter}
          options={[
            { value: "All", label: "All" },
            { value: "Direct", label: "Direct" },
            { value: "Site Group", label: "Group" },
            { value: "Announcements", label: "News" },
          ]}
        />

        {sorted.length === 0 ? (
          <EmptyState
            icon={<MessagesSquare className="h-7 w-7" />}
            title="No messages yet"
            description="Reach out to your supervisor whenever you need support on site."
            action={
              <Link to="/thread/$threadId" params={{ threadId: "dana" }}>
                <Button>Message your Supervisor</Button>
              </Link>
            }
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
                  t.urgent && t.unread > 0 && "bg-danger-soft",
                )}
              >
                {t.kind === "announcement" ? (
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center bg-danger text-primary-foreground">
                    <Megaphone className="h-5 w-5" />
                  </span>
                ) : t.avatar ? (
                  <img src={t.avatar} alt="" className="h-11 w-11 shrink-0 object-cover" />
                ) : (
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center bg-accent text-primary">
                    <Users className="h-5 w-5" />
                  </span>
                )}
                <span className="min-w-0 flex-1">
                  <span className="flex items-baseline justify-between gap-2">
                    <span className="truncate text-[17px] font-semibold">{t.name}</span>
                    <span className="shrink-0 text-[12px] text-muted-foreground">{t.lastTime}</span>
                  </span>
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

      {urgent && !broadcastAcknowledged && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy/50 px-6 backdrop-blur-sm">
          <div className="w-full max-w-80 bg-card p-5 text-center duration-200 animate-in fade-in zoom-in-95">
            <span className="mx-auto mb-3 flex h-14 w-14 items-center justify-center bg-danger-soft text-danger">
              <Megaphone className="h-7 w-7" />
            </span>
            <p className="text-[22px] font-bold text-navy">Important Announcement</p>
            <p className="mt-2 text-[15px] leading-relaxed text-foreground">
              {urgent.messages[0]!.text}
            </p>
            <p className="mt-3 text-[12px] text-muted-foreground">
              Bluecrest Admin · {urgent.lastTime}
            </p>
            <div className="mt-5">
              <Button onClick={acknowledgeBroadcast}>Got It</Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
