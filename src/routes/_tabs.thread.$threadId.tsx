import { Link, createFileRoute, notFound } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { NavBar } from "@/components/ios";
import { useApp } from "@/lib/app-state";
import { CheckCheck, Paperclip, Send } from "lucide-react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_tabs/thread/$threadId")({
  head: () => ({ meta: [{ title: "Message — Bluecrest Client" }] }),
  notFoundComponent: () => (
    <p className="pt-24 text-center text-[17px] text-muted-foreground">Conversation not found.</p>
  ),
  component: ChatThread,
});

function ChatThread() {
  const { threadId } = Route.useParams();
  const { threads, sendMessage, openThread } = useApp();
  const thread = threads.find((t) => t.id === threadId);
  if (!thread) throw notFound();

  const [text, setText] = useState("");
  const [typing, setTyping] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    openThread(threadId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [threadId]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [thread.messages.length, typing]);

  const send = (photo?: string) => {
    if (!text.trim() && !photo) return;
    sendMessage(threadId, {
      id: `m-${Date.now()}`,
      from: "me",
      text: text.trim() || "Photo",
      time: new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit" }),
      read: false,
      photo,
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
          text: "Thanks Sarah — I'll follow up shortly.",
          time: new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit" }),
        });
      }, 1800);
    }
  };

  return (
    <div className="flex min-h-screen flex-col">
      <NavBar title={thread.name} />
      {thread.context && (
        <div className="px-[18px] pt-1">
          <Link
            to={thread.context.to}
            params={thread.context.params as never}
            className="inline-flex min-h-9 items-center bg-accent px-3 text-[13px] font-semibold text-primary"
          >
            {thread.context.label}
          </Link>
        </div>
      )}
      {thread.kind === "announcement" && (
        <p className="mt-1 text-center text-[12px] text-muted-foreground">
          Bluecrest · company announcements
        </p>
      )}

      <div className="flex-1 space-y-3 px-4 pt-3 pb-40">
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
                {m.photo && <img src={m.photo} alt="" className="mb-2 max-h-56 object-cover" />}
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
                    className={cn("h-3.5 w-3.5", m.read ? "text-primary" : "text-muted-foreground")}
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

      {thread.kind !== "announcement" && (
        <div className="fixed inset-x-0 bottom-[var(--tab-chrome)] z-30 mx-auto flex max-w-[520px] items-end gap-2 border-t border-border/70 bg-background/95 px-3 py-2 backdrop-blur">
          <button
            type="button"
            aria-label="Attach photo"
            onClick={() => fileRef.current?.click()}
            className="flex h-11 w-11 shrink-0 items-center justify-center text-primary"
          >
            <Paperclip className="h-5 w-5" />
          </button>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (!f) return;
              const reader = new FileReader();
              reader.onload = () => send(String(reader.result));
              reader.readAsDataURL(f);
              e.target.value = "";
            }}
          />
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
            onClick={() => send()}
            className="flex h-11 w-11 shrink-0 items-center justify-center bg-primary text-primary-foreground disabled:opacity-40"
          >
            <Send className="h-5 w-5" />
          </button>
        </div>
      )}
    </div>
  );
}
