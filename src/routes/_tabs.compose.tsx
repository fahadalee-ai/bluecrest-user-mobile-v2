import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { NavBar, Screen } from "@/components/ios";
import { supervisor } from "@/data/bluecrest";
import { Send } from "lucide-react";
import { useApp } from "@/lib/app-state";

export const Route = createFileRoute("/_tabs/compose")({
  head: () => ({
    meta: [
      { title: "New Message — Bluecrest Staff" },
      {
        name: "description",
        content: "Start a new message to your assigned Bluecrest supervisor.",
      },
      { property: "og:title", content: "New Message — Bluecrest Staff" },
      {
        property: "og:description",
        content: "Start a new message to your assigned supervisor.",
      },
    ],
  }),
  component: Compose,
});

function Compose() {
  const navigate = useNavigate();
  const { sendMessage } = useApp();
  const [text, setText] = useState("");

  const send = () => {
    if (!text.trim()) return;
    sendMessage("dana", {
      id: `m-${Date.now()}`,
      from: "me",
      text: text.trim(),
      time: new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit" }),
      read: false,
    });
    navigate({ to: "/thread/$threadId", params: { threadId: "dana" } });
  };

  return (
    <>
      <NavBar title="New Message" />
      <Screen>
        <div className="mb-4 flex items-center gap-2">
          <span className="text-[13px] text-muted-foreground">To:</span>
          <span className="flex items-center gap-2 bg-accent py-1.5 pr-3 pl-1.5 text-[15px] font-semibold text-accent-foreground">
            <img src={supervisor.avatar} alt="" className="h-7 w-7 object-cover" />
            {supervisor.name}
          </span>
        </div>
        <p className="mb-4 text-[13px] text-muted-foreground">
          Guards can message their assigned supervisor and site group only.
        </p>
        <textarea
          rows={6}
          autoFocus
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Write your message..."
          className="w-full border border-input bg-card p-3.5 text-[17px] outline-none focus:border-primary focus:ring-2 focus:ring-ring/25"
        />
      </Screen>
      <div className="fixed inset-x-0 bottom-[var(--tab-chrome)] z-30 mx-auto flex max-w-[520px] justify-end border-t border-border/70 bg-background/95 px-4 py-2.5 backdrop-blur">
        <button
          type="button"
          aria-label="Send message"
          disabled={!text.trim()}
          onClick={send}
          className="flex h-11 w-11 items-center justify-center bg-primary text-primary-foreground disabled:opacity-40"
        >
          <Send className="h-5 w-5" />
        </button>
      </div>
    </>
  );
}
