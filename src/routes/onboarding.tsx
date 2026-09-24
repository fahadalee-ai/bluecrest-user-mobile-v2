import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { AuthButton } from "@/components/auth/AuthShell";
import { cn } from "@/lib/utils";
import siteImg from "@/assets/onboarding-site.jpg";
import verifyImg from "@/assets/onboarding-verify.jpg";
import connectImg from "@/assets/onboarding-connect.jpg";

export const Route = createFileRoute("/onboarding")({
  head: () => ({
    meta: [
      { title: "Getting Started — Bluecrest Staff" },
      {
        name: "description",
        content:
          "A quick tour of the Bluecrest staff app: your site, one-tap verification, and supervisor chat.",
      },
      { property: "og:title", content: "Getting Started — Bluecrest Staff" },
      {
        property: "og:description",
        content: "A quick tour of the Bluecrest staff app for lifeguards.",
      },
    ],
  }),
  component: Onboarding,
});

const slides = [
  {
    image: siteImg,
    eyebrow: "Your Assignment",
    title: "Your Site, All in One Place",
    body: "Shifts, tasks, water tests and site notes for every pool you cover — organized for the day you're actually working.",
  },
  {
    image: verifyImg,
    eyebrow: "Deck Compliance",
    title: "Verify With a Single Tap",
    body: "Live camera capture with GPS and timestamp proof. No gallery uploads, no guesswork — compliance handled on the deck.",
  },
  {
    image: connectImg,
    eyebrow: "Team Support",
    title: "Stay Connected With Your Supervisor",
    body: "Direct messages, site group threads and urgent Bluecrest announcements — all inside the app instead of scattered texts.",
  },
];

function Onboarding() {
  const [i, setI] = useState(0);
  const navigate = useNavigate();
  const slide = slides[i]!;
  const last = i === slides.length - 1;

  return (
    <div data-auth-surface className="auth-fullscreen relative overflow-hidden bg-[#093370]">
      {/* Full-bleed slide image */}
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

      {/* Readability overlays */}
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
        style={{
          background: "linear-gradient(180deg, transparent 0%, #093370 100%)",
        }}
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

        <div
          key={i}
          className="shrink-0 duration-300 animate-in fade-in slide-in-from-bottom-3"
        >
          <p className="text-[12px] font-semibold tracking-[0.22em] text-[#7eb6ff] uppercase">
            {slide.eyebrow}
          </p>
          <h1 className="mt-3 max-w-[18ch] text-large-title text-white">
            {slide.title}
          </h1>
          <p className="mt-3 max-w-[30ch] text-[15px] leading-relaxed text-white/85">
            {slide.body}
          </p>
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

        <div className="flex shrink-0 gap-3">
          {i > 0 && (
            <AuthButton
              variant="secondary"
              className="w-auto min-w-24 px-5"
              onClick={() => setI(i - 1)}
            >
              Back
            </AuthButton>
          )}
          <AuthButton
            variant="light"
            onClick={() => (last ? navigate({ to: "/login" }) : setI(i + 1))}
          >
            {last ? "Get Started" : "Continue"}
          </AuthButton>
        </div>
      </div>
    </div>
  );
}
