import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { BrandAtmosphere, BrandLogoMark } from "@/components/auth/AuthShell";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Bluecrest Staff — Lifeguard App" },
      {
        name: "description",
        content:
          "Sign in to the Bluecrest Amenity Management staff app to manage shifts, tasks, water tests and verified photos.",
      },
      { property: "og:title", content: "Bluecrest Staff — Lifeguard App" },
      {
        property: "og:description",
        content: "Shifts, tasks, water testing and photo verification for Bluecrest lifeguards.",
      },
    ],
  }),
  component: Splash,
});

function Splash() {
  const navigate = useNavigate();
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const start = performance.now();
    const duration = 1600;
    let frame = 0;

    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      setProgress(t);
      if (t < 1) {
        frame = requestAnimationFrame(tick);
      } else {
        navigate({ to: "/onboarding" });
      }
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [navigate]);

  return (
    <BrandAtmosphere
      className="auth-fullscreen"
      imageOpacity={0.28}
      style={{ paddingTop: "var(--safe-top)" }}
    >
      <div className="flex min-h-0 flex-1 flex-col items-center justify-center px-[18px] text-center">
        <div className="flex w-full max-w-[360px] flex-col items-center duration-300 animate-in fade-in zoom-in-95">
          <BrandLogoMark width={320} className="mx-auto" />
          <p className="mt-8 w-full text-center text-title text-white">
            Staff &amp; Lifeguard Portal
          </p>
          <p className="mt-2 w-full text-center text-[12px] tracking-[0.28em] text-white/65 uppercase">
            NYC Metro Aquatics
          </p>
        </div>
      </div>

      <div className="shrink-0 px-[18px] pb-[max(3rem,calc(var(--safe-bottom)+1.5rem))]">
        <div className="mx-auto h-0.5 w-full max-w-[280px] bg-white/20">
          <div
            className="h-full bg-white transition-[width] duration-200 ease-linear"
            style={{ width: `${Math.round(progress * 100)}%` }}
          />
        </div>
        <p className="mt-3 text-center text-[12px] tracking-wide text-white/55">
          Bluecrest Amenity Management
        </p>
      </div>
    </BrandAtmosphere>
  );
}
