import { cn } from "@/lib/utils";
import { MapPin, UserRound } from "lucide-react";

/** Stylized site map with geofence radius, guard pin and site pin. */
export function MapCard({
  siteName,
  className,
  showGuard = true,
  compact,
}: {
  siteName: string;
  className?: string;
  showGuard?: boolean;
  compact?: boolean;
}) {
  return (
    <div
      className={cn(
        "relative overflow-hidden border border-border/70 bg-[oklch(0.93_0.02_220)]",
        compact ? "h-28" : "h-44",
        className,
      )}
      role="img"
      aria-label={`Map showing ${siteName} and your location`}
    >
      <svg viewBox="0 0 320 180" className="h-full w-full">
        <rect width="320" height="180" fill="oklch(0.94 0.015 220)" />
        <path d="M0 120 H320" stroke="oklch(0.88 0.02 220)" strokeWidth="10" />
        <path d="M0 60 H320" stroke="oklch(0.9 0.02 220)" strokeWidth="6" />
        <path d="M90 0 V180" stroke="oklch(0.9 0.02 220)" strokeWidth="8" />
        <path d="M230 0 V180" stroke="oklch(0.9 0.02 220)" strokeWidth="6" />
        <rect x="20" y="20" width="55" height="30" fill="oklch(0.91 0.01 230)" />
        <rect x="245" y="20" width="55" height="30" fill="oklch(0.91 0.01 230)" />
        <rect x="245" y="135" width="55" height="30" fill="oklch(0.91 0.01 230)" />
        <path
          d="M105 70 h110 v52 h-110 z"
          fill="oklch(0.82 0.09 220)"
        />
        <circle
          cx="160"
          cy="96"
          r="62"
          fill="oklch(0.5 0.16 258 / 0.12)"
          stroke="oklch(0.5 0.16 258 / 0.45)"
          strokeWidth="2"
        />
      </svg>
      <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-full text-navy">
        <MapPin className="h-6 w-6 fill-navy/15" strokeWidth={2.2} />
      </span>
      {showGuard && (
        <span className="absolute top-[62%] left-[38%] flex h-7 w-7 -translate-x-1/2 items-center justify-center border-2 border-card bg-primary text-primary-foreground shadow">
          <UserRound className="h-4 w-4" />
        </span>
      )}
      <span className="absolute bottom-2 left-2 bg-card/90 px-2.5 py-1 text-[12px] font-semibold text-navy shadow-sm">
        {siteName}
      </span>
    </div>
  );
}
