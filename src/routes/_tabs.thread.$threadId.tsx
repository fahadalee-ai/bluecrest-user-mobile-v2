import { createFileRoute, notFound, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { NavBar } from "@/components/ios";
import { useApp } from "@/lib/app-state";
import { threads as seedThreads } from "@/data/bluecrest";
import { Camera, CheckCheck, Paperclip, Send, Users, X } from "lucide-react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_tabs/thread/$threadId")({
  loader: ({ params }) => {
    const t = seedThreads.find((x) => x.id === params.threadId);
    if (!t) throw notFound();
    return { name: t.name };
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: loaderData ? `${loaderData.name} — Bluecrest Chat` : "Chat — Bluecrest Staff" },
      {
        name: "description",
        content:
          "Message your supervisor and site team, and share photos or documents from the deck.",
      },
      {
        property: "og:title",
        content: loaderData ? `${loaderData.name} — Bluecrest Chat` : "Chat — Bluecrest Staff",
      },
      {
        property: "og:description",
        content: "Supervisor and site team messaging inside the Bluecrest staff app.",
      },
    ],
  }),
  notFoundComponent: () => (
    <p className="pt-24 text-center text-[17px] text-muted-foreground">Conversation not found.</p>
  ),
  component: ChatThread,
});

function ChatThread() {
  const { threadId } = Route.useParams();
  const navigate = useNavigate();
  const { threads, sendMessage, openThread, captures, clearCapture } = useApp();
  const thread = threads.find((t) => t.id === threadId)!;
  const [text, setText] = useState("");
  const [typing, setTyping] = useState(false);
  const [showMembers, setShowMembers] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  const members = thread.members ?? [];

  useEffect(() => {
    openThread(threadId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [threadId]);

  const attached = captures[`chat:${threadId}`];
  useEffect(() => {
    if (!attached) return;
    sendMessage(threadId, {
      id: `m-${Date.now()}`,
      from: "me",
      text: "Photo",
      time: new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit" }),
      photo: attached,
      read: false,
    });
    clearCapture(`chat:${threadId}`);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [attached]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [thread.messages.length, typing]);

  const send = () => {
    if (!text.trim()) return;
    sendMessage(threadId, {
      id: `m-${Date.now()}`,
      from: "me",
      text: text.trim(),
      time: new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit" }),
      read: false,
    });
    setText("");
    if (thread.kind === "direct") {
      setTyping(true);
      setTimeout(() => {
        setTyping(false);
        sendMessage(threadId, {
          id: `m-${Date.now() + 1}`,
          from: "them",
          sender: thread.name,
          text: "Thanks Marcus — noted. I'll follow up if anything changes.",
          time: new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit" }),
        });
      }, 2200);
    }
  };

  return (
    <div className="flex min-h-screen flex-col">
      <NavBar
        title={thread.name}
        trailing={
          thread.kind === "group" ? (
            <button
              type="button"
              aria-label="Group members"
              onClick={() => setShowMembers(true)}
              className="flex h-11 w-11 items-center justify-center text-primary"
            >
              <Users className="h-5 w-5" />
            </button>
          ) : undefined
        }
      />

      {thread.kind === "group" && (
        <button
          type="button"
          onClick={() => setShowMembers(true)}
          className="mx-auto -mt-1 mb-2 min-h-8 px-3 text-center text-[12px] font-semibold text-primary"
        >
          {members.length} members
        </button>
      )}

      {thread.kind === "announcement" && (
        <p className="-mt-1 mb-2 text-center text-[12px] text-muted-foreground">
          Bluecrest Admin · broadcast
        </p>
      )}

      <div className="flex-1 space-y-3 px-4 pt-2 pb-40">
        {thread.messages.map((m) => (
          <div key={m.id} className={cn("flex", m.from === "me" ? "justify-end" : "justify-start")}>
            <div className="max-w-[78%]">
              {m.from === "them" && thread.kind !== "direct" && (
                <p className="mb-0.5 px-1 text-[12px] font-semibold text-muted-foreground">
                  {m.sender}
                </p>
              )}
              <div
                className={cn(
                  "px-3.5 py-2.5 text-[15px] leading-relaxed",
                  m.from === "me" ? "bg-primary text-primary-foreground" : "bg-muted text-navy",
                )}
              >
                {m.photo && (
                  <img src={m.photo} alt="Shared" className="mb-2 max-h-56 object-cover" />
                )}
                {m.text}
              </div>
              <p
                className={cn(
                  "mt-1 flex items-center gap-1 px-1 text-[11px] text-muted-foreground",
                  m.from === "me" && "justify-end",
                )}
              >
                {m.time}
                {m.from === "me" && (
                  <CheckCheck
                    className={cn(
                      "h-3.5 w-3.5",
                      m.read ? "text-primary" : "text-muted-foreground",
                    )}
                  />
                )}
              </p>
            </div>
          </div>
        ))}
        {typing && (
          <div className="flex justify-start">
            <div className="flex gap-1 bg-muted px-4 py-3">
              {[0, 150, 300].map((d) => (
                <span
                  key={d}
                  className="h-2 w-2 animate-bounce bg-muted-foreground/60"
                  style={{ animationDelay: `${d}ms` }}
                />
              ))}
            </div>
          </div>
        )}
        <div ref={endRef} />
      </div>

      <div className="fixed inset-x-0 bottom-[var(--tab-chrome)] z-30 mx-auto flex max-w-[520px] items-end gap-2 border-t border-border/70 bg-background/95 px-3 py-2 backdrop-blur">
        <button
          type="button"
          aria-label="Attach photo from camera"
          onClick={() =>
            navigate({
              to: "/capture",
              search: {
                type: "incident",
                slot: `chat:${threadId}`,
                siteId: "manhattan-park",
                label: "Chat photo",
              },
            })
          }
          className="flex h-11 w-11 shrink-0 items-center justify-center text-primary"
        >
          <Camera className="h-5 w-5" />
        </button>
        <button
          type="button"
          aria-label="Attach document"
          className="flex h-11 w-11 shrink-0 items-center justify-center text-primary"
        >
          <Paperclip className="h-5 w-5" />
        </button>
        <textarea
          rows={1}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Message"
          className="max-h-28 min-h-11 flex-1 resize-none border border-input bg-card px-3.5 py-2.5 text-[15px] outline-none focus:border-primary"
        />
        <button
          type="button"
          aria-label="Send message"
          disabled={!text.trim()}
          onClick={send}
          className="flex h-11 w-11 shrink-0 items-center justify-center bg-primary text-primary-foreground disabled:opacity-40"
        >
          <Send className="h-5 w-5" />
        </button>
      </div>

      {showMembers && thread.kind === "group" && (
        <div className="fixed inset-0 z-50 mx-auto flex max-w-[520px] flex-col justify-end">
          <button
            type="button"
            aria-label="Dismiss"
            className="absolute inset-0 bg-navy/40 backdrop-blur-sm"
            onClick={() => setShowMembers(false)}
          />
          <div className="relative z-10 max-h-[78vh] overflow-hidden bg-card duration-300 animate-in slide-in-from-bottom">
            <div className="flex h-11 items-center justify-between border-b border-border px-4">
              <span className="text-[17px] font-semibold text-navy">Group members</span>
              <button
                type="button"
                aria-label="Close"
                onClick={() => setShowMembers(false)}
                className="flex h-11 w-11 items-center justify-center text-primary"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="border-b border-border/70 px-4 py-3">
              <p className="text-[15px] font-semibold text-navy">{thread.name}</p>
              <p className="mt-0.5 text-[13px] text-muted-foreground">{members.length} members</p>
            </div>
            <ul className="max-h-[60vh] overflow-y-auto hide-scrollbar">
              {members.map((m) => (
                <li
                  key={m.id}
                  className="flex min-h-[64px] items-center gap-3 border-b border-border/70 px-4 py-3"
                >
                  {m.avatar ? (
                    <img src={m.avatar} alt="" className="h-11 w-11 shrink-0 object-cover" />
                  ) : (
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center bg-accent text-[13px] font-bold text-primary">
                      {m.name
                        .split(" ")
                        .map((p) => p[0])
                        .join("")
                        .slice(0, 2)}
                    </span>
                  )}
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-[17px] font-semibold text-foreground">
                      {m.name}
                    </span>
                    <span className="mt-0.5 block truncate text-[13px] text-muted-foreground">
                      {m.role}
                    </span>
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
