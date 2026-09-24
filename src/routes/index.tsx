import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { BrandAtmosphere, BrandLogoMark } from "@/components/auth/AuthShell";
import { useApp } from "@/lib/app-state";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Bluecrest Client" },
      {
        name: "description",
        content:
          "Your properties, fully verified — inspection reports, photo proof, and a direct line to Bluecrest.",
      },
      { property: "og:title", content: "Bluecrest Client" },
      {
        property: "og:description",
        content: "A professional window into the amenity service you're paying for.",
      },
    ],
  }),
  component: Splash,
});

function Splash() {
  const navigate = useNavigate();
  const { signedIn, seenOnboarding, sessionReady } = useApp();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const fade = requestAnimationFrame(() => setReady(true));
    if (!sessionReady) {
      return () => cancelAnimationFrame(fade);
    }
    const timer = window.setTimeout(() => {
      if (signedIn) navigate({ to: "/home" });
      else if (seenOnboarding) navigate({ to: "/login" });
      else navigate({ to: "/onboarding" });
    }, 1200);
    return () => {
      cancelAnimationFrame(fade);
      window.clearTimeout(timer);
    };
  }, [navigate, signedIn, seenOnboarding, sessionReady]);

  return (
    <BrandAtmosphere
      className="auth-fullscreen"
      imageOpacity={0.22}
      style={{ paddingTop: "var(--safe-top)" }}
    >
      <div className="flex min-h-0 flex-1 flex-col items-center justify-center px-[18px] text-center">
        <div
          className={
            ready
              ? "flex w-full max-w-[360px] flex-col items-center duration-300 animate-in fade-in zoom-in-95"
              : "flex w-full max-w-[360px] flex-col items-center opacity-0"
          }
        >
          <BrandLogoMark width={320} className="mx-auto" />
          <p className="mt-8 font-display text-[22px] leading-snug text-white">
            Your Properties, Fully Verified.
          </p>
        </div>
      </div>
    </BrandAtmosphere>
  );
}
