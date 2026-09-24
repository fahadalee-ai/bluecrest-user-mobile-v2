import { Link, useCanGoBack, useRouter } from "@tanstack/react-router";
import { Check, ChevronDown, ChevronLeft, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState, type ReactNode } from "react";

/** iOS navigation bar: Status/Dynamic Island (safe-area) + 44pt bar ≈ 91–103pt total. */
export function NavBar({
  title,
  back = true,
  trailing,
  large,
}: {
  title: string;
  back?: boolean;
  trailing?: ReactNode;
  large?: boolean;
}) {
  const router = useRouter();
  const canGoBack = useCanGoBack();

  return (
    <header
      className="sticky top-0 z-30 border-b border-border/70 bg-background/90 backdrop-blur"
      style={{ paddingTop: "var(--safe-top)" }}
    >
      <div
        className="flex items-center gap-1 px-1"
        style={{ height: "var(--nav-height)", minHeight: "var(--nav-height)" }}
      >
        <div className="flex w-11 shrink-0 justify-start">
          {back && (
            <button
              type="button"
              aria-label="Back"
              onClick={() => (canGoBack ? router.history.back() : router.navigate({ to: "/home" }))}
              className="flex w-11 items-center justify-center text-primary transition-colors duration-200 active:bg-muted"
              style={{ height: "var(--nav-height)", minHeight: "var(--touch-min)" }}
            >
              <ChevronLeft className="h-6 w-6" strokeWidth={2} />
            </button>
          )}
        </div>
        <h1 className="flex-1 truncate text-center text-[17px] font-semibold text-foreground">
          {large ? "" : title}
        </h1>
        <div className="flex w-11 shrink-0 items-center justify-end">{trailing}</div>
      </div>
      {large && (
        <h1 className="px-[18px] pb-2 text-large-title text-navy">{title}</h1>
      )}
    </header>
  );
}

/** Screen body — 16–20pt margins, tab + home-indicator clearance. */
export function Screen({
  children,
  className,
  padded = true,
}: {
  children: ReactNode;
  className?: string;
  padded?: boolean;
}) {
  return (
    <div
      className={cn(
        "pb-[calc(var(--tab-chrome)+1.5rem)]",
        padded && "px-[18px] pt-4",
        className,
      )}
    >
      {children}
    </div>
  );
}

export function Card({
  children,
  className,
  as = "div",
}: {
  children: ReactNode;
  className?: string;
  as?: "div" | "section";
}) {
  const Tag = as;
  return (
    <Tag
      className={cn(
        "border border-border/70 bg-card p-4 shadow-[0_1px_2px_rgba(9,51,112,0.06)]",
        className,
      )}
    >
      {children}
    </Tag>
  );
}

export function SectionHeader({ children, action }: { children: ReactNode; action?: ReactNode }) {
  return (
    <div className="mb-3 flex items-end justify-between px-0.5">
      <h2 className="text-[13px] font-semibold tracking-wide text-muted-foreground uppercase">
        {children}
      </h2>
      {action}
    </div>
  );
}

type ButtonProps = {
  children: ReactNode;
  variant?: "primary" | "secondary" | "ghost" | "danger";
  className?: string;
  disabled?: boolean;
  type?: "button" | "submit";
  onClick?: () => void;
};

/** Primary / Secondary / Text (ghost). Min height 48 (≥44pt). */
export function Button({
  children,
  variant = "primary",
  className,
  disabled,
  type = "button",
  onClick,
}: ButtonProps) {
  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={cn(
        "inline-flex min-h-12 w-full items-center justify-center gap-2 px-4 text-[17px] font-semibold transition-all duration-200 ease-[cubic-bezier(0.25,0.1,0.25,1)] active:opacity-80 disabled:pointer-events-none disabled:opacity-40",
        variant === "primary" && "bg-primary text-primary-foreground",
        variant === "secondary" && "bg-accent text-accent-foreground",
        variant === "ghost" && "text-primary",
        variant === "danger" && "bg-danger text-primary-foreground",
        className,
      )}
    >
      {children}
    </button>
  );
}

export function Badge({
  children,
  tone = "neutral",
  className,
}: {
  children: ReactNode;
  tone?: "neutral" | "blue" | "green" | "amber" | "red";
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 px-2.5 py-1 text-[12px] font-semibold",
        tone === "neutral" && "bg-muted text-muted-foreground",
        tone === "blue" && "bg-accent text-accent-foreground",
        tone === "green" && "bg-success-soft text-success",
        tone === "amber" && "bg-warning-soft text-warning",
        tone === "red" && "bg-danger-soft text-danger",
        className,
      )}
    >
      {children}
    </span>
  );
}

export function ListGroup({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={cn("divide-y divide-border/70 overflow-hidden border border-border/70 bg-card", className)}
    >
      {children}
    </div>
  );
}

export function ListRow({
  leading,
  title,
  subtitle,
  trailing,
  onClick,
  to,
  params,
  search,
  className,
  destructive,
}: {
  leading?: ReactNode;
  title: ReactNode;
  subtitle?: ReactNode;
  trailing?: ReactNode;
  onClick?: () => void;
  to?: string;
  params?: Record<string, string>;
  search?: Record<string, string>;
  className?: string;
  destructive?: boolean;
}) {
  const content = (
    <>
      {leading && <div className="shrink-0">{leading}</div>}
      <div className="min-w-0 flex-1 text-left">
        <div
          className={cn(
            "truncate text-[17px] font-medium",
            destructive ? "text-danger" : "text-foreground",
          )}
        >
          {title}
        </div>
        {subtitle && (
          <div className="mt-0.5 truncate text-[13px] text-muted-foreground">{subtitle}</div>
        )}
      </div>
      {trailing && <div className="shrink-0">{trailing}</div>}
    </>
  );

  const base = cn(
    "flex min-h-[52px] w-full items-center gap-3 px-4 py-3 transition-colors duration-200 active:bg-muted",
    className,
  );

  if (to) {
    return (
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      <Link to={to as any} params={params as any} search={search as any} className={base}>
        {content}
      </Link>
    );
  }
  if (!onClick) {
    return <div className={base}>{content}</div>;
  }
  return (
    <button type="button" onClick={onClick} className={base}>
      {content}
    </button>
  );
}

/** Empty state — icon, short message, primary action. */
export function EmptyState({
  icon,
  title,
  description,
  action,
}: {
  icon: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center px-[18px] py-16 text-center">
      <div className="mb-4 flex h-16 w-16 items-center justify-center bg-accent text-primary">
        {icon}
      </div>
      <p className="text-[17px] font-semibold text-foreground">{title}</p>
      {description && (
        <p className="mt-2 max-w-72 text-[15px] leading-relaxed text-muted-foreground">
          {description}
        </p>
      )}
      {action && <div className="mt-6 w-full max-w-64">{action}</div>}
    </div>
  );
}

export function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[13px] font-semibold text-muted-foreground">{label}</span>
      {children}
      {hint && <span className="mt-1 block text-[12px] text-muted-foreground">{hint}</span>}
    </label>
  );
}

export const inputClass =
  "min-h-12 w-full border border-input bg-card px-3.5 text-[17px] text-foreground outline-none transition-colors duration-200 placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-ring/25 disabled:bg-muted disabled:text-muted-foreground";

/** Custom select — sharp corners, brand chevron, bottom sheet options (no native OS chrome). */
export function SelectField<T extends string>({
  label,
  value,
  options,
  onChange,
  placeholder = "Select…",
}: {
  label: string;
  value: T;
  options: { value: T; label: string }[];
  onChange: (v: T) => void;
  placeholder?: string;
}) {
  const [open, setOpen] = useState(false);
  const selected = options.find((o) => o.value === value);

  return (
    <>
      <div className="block">
        <span className="mb-1.5 block text-[13px] font-semibold text-muted-foreground">{label}</span>
        <button
          type="button"
          aria-haspopup="listbox"
          aria-expanded={open}
          onClick={() => setOpen(true)}
          className="flex min-h-12 w-full items-center gap-3 border border-input bg-card px-3.5 text-left transition-colors duration-200 focus:border-primary focus:ring-2 focus:ring-ring/25 active:bg-muted"
        >
          <span
            className={cn(
              "min-w-0 flex-1 truncate text-[17px]",
              selected ? "text-foreground" : "text-muted-foreground",
            )}
          >
            {selected?.label ?? placeholder}
          </span>
          <ChevronDown className="h-5 w-5 shrink-0 text-primary" strokeWidth={2} />
        </button>
      </div>

      {open && (
        <div className="fixed inset-0 z-50 mx-auto flex max-w-[520px] flex-col justify-end">
          <button
            type="button"
            aria-label="Dismiss"
            className="absolute inset-0 bg-navy/40 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />
          <div className="relative z-10 max-h-[70vh] overflow-hidden bg-card duration-300 animate-in slide-in-from-bottom">
            <div className="flex h-11 items-center justify-between border-b border-border px-4">
              <span className="text-[13px] font-semibold tracking-wide text-muted-foreground uppercase">
                {label}
              </span>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="min-h-11 px-1 text-[17px] font-semibold text-primary"
              >
                Done
              </button>
            </div>
            <ul role="listbox" className="max-h-[60vh] overflow-y-auto hide-scrollbar">
              {options.map((o) => {
                const active = o.value === value;
                return (
                  <li key={o.value}>
                    <button
                      type="button"
                      role="option"
                      aria-selected={active}
                      onClick={() => {
                        onChange(o.value);
                        setOpen(false);
                      }}
                      className={cn(
                        "flex min-h-[52px] w-full items-center justify-between gap-3 border-b border-border/70 px-4 text-left text-[17px] transition-colors duration-200 active:bg-muted",
                        active ? "font-semibold text-primary" : "text-foreground",
                      )}
                    >
                      <span className="min-w-0 flex-1 truncate">{o.label}</span>
                      {active && <Check className="h-5 w-5 shrink-0 text-primary" strokeWidth={2.4} />}
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      )}
    </>
  );
}

export function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
  className,
}: {
  options: { value: T; label: string }[];
  value: T;
  onChange: (v: T) => void;
  className?: string;
}) {
  return (
    <div className={cn("flex gap-1 bg-muted p-1", className)}>
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          onClick={() => onChange(o.value)}
          className={cn(
            "min-h-11 flex-1 px-2 text-[13px] font-semibold transition-all duration-200",
            value === o.value ? "bg-card text-navy shadow-sm" : "text-muted-foreground",
          )}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

export function StickyFooter({ children }: { children: ReactNode }) {
  return (
    <div className="fixed inset-x-0 bottom-[var(--tab-chrome)] z-30 mx-auto max-w-[520px] border-t border-border/70 bg-background/95 px-[18px] py-3 backdrop-blur">
      {children}
    </div>
  );
}

/** Simple alert — title, short message, cancel + one primary action. */
export function Alert({
  open,
  title,
  message,
  confirmLabel = "Confirm",
  destructive,
  onConfirm,
  onCancel,
}: {
  open: boolean;
  title: string;
  message?: string;
  confirmLabel?: string;
  destructive?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy/40 px-[18px] backdrop-blur-sm">
      <div className="w-full max-w-72 overflow-hidden bg-card text-center shadow-xl duration-200 animate-in fade-in zoom-in-95">
        <div className="px-5 py-4">
          <p className="text-[17px] font-semibold text-foreground">{title}</p>
          {message && <p className="mt-1 text-[13px] text-muted-foreground">{message}</p>}
        </div>
        <div className="grid grid-cols-2 divide-x divide-border border-t border-border">
          <button
            type="button"
            onClick={onCancel}
            className="min-h-11 text-[17px] text-primary transition-colors duration-200 active:bg-muted"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className={cn(
              "min-h-11 text-[17px] font-semibold transition-colors duration-200 active:bg-muted",
              destructive ? "text-danger" : "text-primary",
            )}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

export function ProgressRing({ value, total }: { value: number; total: number }) {
  const pct = total ? value / total : 0;
  const r = 16;
  const c = 2 * Math.PI * r;
  return (
    <div className="relative h-11 w-11">
      <svg viewBox="0 0 40 40" className="h-11 w-11 -rotate-90">
        <circle cx="20" cy="20" r={r} className="fill-none stroke-muted" strokeWidth="4" />
        <circle
          cx="20"
          cy="20"
          r={r}
          className="fill-none stroke-primary transition-all duration-300"
          strokeWidth="4"
          strokeLinecap="butt"
          strokeDasharray={c}
          strokeDashoffset={c * (1 - pct)}
        />
      </svg>
      <span className="absolute inset-0 flex items-center justify-center text-[11px] font-semibold text-navy">
        {value}/{total}
      </span>
    </div>
  );
}

/** Activity indicator for short loading waits. */
export function ActivityIndicator({
  label = "Loading…",
  className,
}: {
  label?: string;
  className?: string;
}) {
  return (
    <div
      className={cn("flex flex-col items-center justify-center gap-3 py-12 text-muted-foreground", className)}
      role="status"
      aria-live="polite"
    >
      <Loader2 className="h-6 w-6 animate-spin text-primary" strokeWidth={2} />
      <p className="text-[13px]">{label}</p>
    </div>
  );
}

/** Skeleton block for content placeholders. */
export function Skeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn("animate-pulse bg-muted", className)}
      aria-hidden
    />
  );
}

export function PullToRefresh({ onRefresh }: { onRefresh?: () => void }) {
  return (
    <button
      type="button"
      onClick={onRefresh}
      className="mx-auto mb-2 block min-h-11 text-[12px] text-muted-foreground"
    >
      Pull to refresh
    </button>
  );
}
