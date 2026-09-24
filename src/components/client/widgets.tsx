import { useRef, useState, type ReactNode } from "react";
import { BadgeCheck, Send, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ios";
import { requestSteps, type RequestStatus } from "@/data/bluecrest";

export function PhotoLightbox({
  src,
  label,
  timestamp,
  context,
  onClose,
}: {
  src: string;
  label: string;
  timestamp?: string;
  context?: string;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 mx-auto flex max-w-[520px] flex-col bg-black">
      <div className="flex items-center justify-between px-2" style={{ paddingTop: "var(--safe-top)" }}>
        <span className="px-3 text-[13px] font-semibold text-white/80">{label}</span>
        <button
          type="button"
          aria-label="Close"
          onClick={onClose}
          className="flex h-11 w-11 items-center justify-center text-white"
        >
          <X className="h-5 w-5" />
        </button>
      </div>
      <img src={src} alt={label} className="min-h-0 flex-1 object-contain" />
      <div className="px-4 pb-[max(1.5rem,var(--safe-bottom))]">
        <div className="space-y-1">
          {timestamp && (
            <p className="flex items-center gap-2 text-[13px] text-white/80">
              <BadgeCheck className="h-4 w-4 text-success" />
              Verified · {timestamp}
            </p>
          )}
          {context && <p className="text-[12px] text-white/60">{context}</p>}
        </div>
      </div>
    </div>
  );
}

export function PhotoGrid({
  photos,
}: {
  photos: { id: string; src: string; label: string; timestamp?: string; context?: string }[];
}) {
  const [open, setOpen] = useState<(typeof photos)[number] | null>(null);
  if (!photos.length) return null;
  return (
    <>
      <div className="grid grid-cols-3 gap-2">
        {photos.map((p) => (
          <button
            key={p.id}
            type="button"
            onClick={() => setOpen(p)}
            className="relative overflow-hidden border border-border/70"
          >
            <img src={p.src} alt={p.label} className="h-28 w-full object-cover" />
          </button>
        ))}
      </div>
      {open && (
        <PhotoLightbox
          src={open.src}
          label={open.label}
          timestamp={open.timestamp}
          context={open.context}
          onClose={() => setOpen(null)}
        />
      )}
    </>
  );
}

export function CommentBox({
  onSend,
  placeholder = "Ask a follow-up question…",
}: {
  onSend: (text: string) => void;
  placeholder?: string;
}) {
  const [text, setText] = useState("");
  const send = () => {
    if (!text.trim()) return;
    onSend(text.trim());
    setText("");
  };
  return (
    <div className="flex items-end gap-2">
      <textarea
        rows={2}
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder={placeholder}
        className="max-h-28 min-h-11 flex-1 resize-none border border-input bg-card px-3.5 py-2.5 text-[15px] outline-none focus:border-primary"
      />
      <button
        type="button"
        aria-label="Send comment"
        disabled={!text.trim()}
        onClick={send}
        className="flex h-11 w-11 shrink-0 items-center justify-center bg-primary text-primary-foreground disabled:opacity-40"
      >
        <Send className="h-5 w-5" />
      </button>
    </div>
  );
}

export function StepTracker({ status }: { status: RequestStatus }) {
  const idx = requestSteps.indexOf(status);
  return (
    <ol className="space-y-0">
      {requestSteps.map((step, i) => {
        const done = i <= idx;
        const current = i === idx;
        return (
          <li key={step} className="flex gap-3">
            <div className="flex flex-col items-center">
              <span
                className={cn(
                  "mt-0.5 flex h-4 w-4 items-center justify-center",
                  done ? "bg-primary" : "bg-muted",
                )}
              >
                {done && <span className="h-1.5 w-1.5 bg-white" />}
              </span>
              {i < requestSteps.length - 1 && (
                <span className={cn("w-0.5 flex-1 min-h-6", i < idx ? "bg-primary" : "bg-border")} />
              )}
            </div>
            <p
              className={cn(
                "pb-4 text-[15px]",
                current ? "font-semibold text-navy" : done ? "text-foreground" : "text-muted-foreground",
              )}
            >
              {step}
            </p>
          </li>
        );
      })}
    </ol>
  );
}

export function IconTile({ children }: { children: ReactNode }) {
  return (
    <span className="flex h-8 w-8 items-center justify-center bg-accent text-primary">
      {children}
    </span>
  );
}

export function PhotoPicker({
  photos,
  onAdd,
  onRemove,
}: {
  photos: string[];
  onAdd: (dataUrl: string) => void;
  onRemove: (i: number) => void;
}) {
  const ref = useRef<HTMLInputElement>(null);
  return (
    <div>
      <div className="flex flex-wrap gap-2">
        {photos.map((src, i) => (
          <button
            key={src}
            type="button"
            onClick={() => onRemove(i)}
            className="relative h-20 w-20 overflow-hidden border border-border"
          >
            <img src={src} alt="" className="h-full w-full object-cover" />
          </button>
        ))}
        <button
          type="button"
          onClick={() => ref.current?.click()}
          className="flex h-20 w-20 items-center justify-center border border-dashed border-input text-[12px] font-semibold text-primary"
        >
          Add
        </button>
      </div>
      <input
        ref={ref}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (!f) return;
          const reader = new FileReader();
          reader.onload = () => onAdd(String(reader.result));
          reader.readAsDataURL(f);
          e.target.value = "";
        }}
      />
    </div>
  );
}

export function DownloadButton({ label }: { label: string }) {
  return (
    <Button
      onClick={() => {
        const blob = new Blob(
          [`Bluecrest Amenity Management\n${label}\nGenerated for Related Property Group.\n`],
          { type: "text/plain" },
        );
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${label.replace(/\s+/g, "-").toLowerCase()}.txt`;
        a.click();
        URL.revokeObjectURL(url);
      }}
    >
      Download PDF
    </Button>
  );
}
