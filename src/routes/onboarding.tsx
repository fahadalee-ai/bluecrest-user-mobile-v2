import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useRef, useState } from "react";
import { AuthButton } from "@/components/auth/AuthShell";
import { cn } from "@/lib/utils";
import inspectImg from "@/assets/site-soho-house.jpg";
import equipmentImg from "@/assets/onboarding-equipment.jpg";
import conciergeImg from "@/assets/onboarding-concierge.jpg";

export const Route = createFileRoute("/onboarding")({
  head: () => ({
    meta: [
      { title: "Getting Started — Bluecrest Client" },
      {
        name: "description",
        content:
          "See every inspection instantly, track service with full transparency, and message Bluecrest in one place.",
      },
      { property: "og:title", content: "Getting Started — Bluecrest Client" },
      {
        property: "og:description",
        content: "A quick tour of the Bluecrest client portal.",
      },
    ],
  }),
  component: Onboarding,
});

const slides = [
  {
    image: inspectImg,
    title: "See Every Inspection, Instantly",
    body: "Real-time inspection reports and live photo proof from every visit — no more waiting on a phone call to know your pool is safe and compliant.",
  },
  {
    image: equipmentImg,
    title: "Full Transparency, Always",
    body: "Track water testing results, maintenance history, and every service visit — organized by property, available whenever you need it.",
  },
  {
    image: conciergeImg,
    title: "A Direct Line to Bluecrest",
    body: "Request service, report an issue, or message your dedicated Bluecrest representative — all in one place.",
  },
];

function Onboarding() {
  const [i, setI] = useState(0);
  const navigate = useNavigate();
  const startX = useRef<number | null>(null);
  const slide = slides[i]!;
  const last = i === slides.length - 1;

  const onTouchStart = (e: React.TouchEvent) => {
    startX.current = e.touches[0]?.clientX ?? null;
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (startX.current == null) return;
    const dx = (e.changedTouches[0]?.clientX ?? startX.current) - startX.current;
    if (dx < -48 && i < slides.length - 1) setI(i + 1);
    if (dx > 48 && i > 0) setI(i - 1);
    startX.current = null;
  };

  return (
    <div
      data-auth-surface
      className="auth-fullscreen relative overflow-hidden bg-[#093370]"
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      {slides.map((s, idx) => (
        <img
          key={s.title}
          src={s.image}
          alt=""
          aria-hidden={idx !== i}
          className={cn(
            "absolute inset-0 h-full w-full object-cover transition-opacity duration-300",
            idx === i ? "opacity-100" : "opacity-0",
          )}
        />
      ))}

      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, rgba(9,51,112,0.55) 0%, rgba(9,51,112,0.15) 32%, rgba(9,51,112,0.45) 58%, rgba(9,51,112,0.94) 100%)",
        }}
      />
      <div
        aria-hidden
        className="absolute inset-x-0 bottom-0 h-2/5"
        style={{ background: "linear-gradient(180deg, transparent 0%, #093370 100%)" }}
      />

      <div
        className="relative z-10 flex min-h-0 flex-1 flex-col px-[18px] pb-[max(2rem,calc(var(--safe-bottom)+1rem))]"
        style={{ paddingTop: "var(--safe-top)" }}
      >
        <div
          className="flex shrink-0 items-center justify-between"
          style={{ height: "var(--nav-height)", minHeight: "var(--nav-height)" }}
        >
          <span className="text-[12px] font-semibold tracking-[0.2em] text-white/70 uppercase">
            Bluecrest
          </span>
          <button
            type="button"
            onClick={() => navigate({ to: "/login" })}
            className="px-2 text-[15px] font-semibold text-white/90 transition-colors duration-200"
            style={{ minHeight: "var(--touch-min)" }}
          >
            Skip
          </button>
        </div>

        <div className="min-h-0 flex-1" />

        <div key={i} className="shrink-0 duration-300 animate-in fade-in slide-in-from-bottom-3">
          <h1 className="max-w-[18ch] text-large-title text-white">{slide.title}</h1>
          <p className="mt-3 max-w-[32ch] text-[15px] leading-relaxed text-white/85">{slide.body}</p>
        </div>

        <div className="mt-8 mb-6 flex shrink-0 gap-1.5">
          {slides.map((s, idx) => (
            <button
              key={s.title}
              type="button"
              aria-label={`Go to slide ${idx + 1}`}
              onClick={() => setI(idx)}
              className={cn(
                "h-1 transition-all duration-300",
                idx === i ? "w-8 bg-white" : "w-4 bg-white/35",
              )}
            />
          ))}
        </div>

        <AuthButton variant="light" onClick={() => (last ? navigate({ to: "/login" }) : setI(i + 1))}>
          {last ? "Get Started" : "Continue"}
        </AuthButton>
      </div>
    </div>
  );
}
