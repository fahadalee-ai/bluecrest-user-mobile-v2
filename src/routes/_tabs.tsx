import { Link, Outlet, createFileRoute, useLocation, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { ClipboardCheck, Home, Building2, Inbox, MessageCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { useApp } from "@/lib/app-state";

export const Route = createFileRoute("/_tabs")({
  component: TabsLayout,
});

const tabs = [
  {
    to: "/home",
    label: "Home",
    icon: Home,
    match: [
      "/home",
      "/notifications",
      "/profile",
      "/edit-profile",
      "/change-password",
      "/reports",
      "/settings",
      "/help",
    ],
  },
  { to: "/properties", label: "Properties", icon: Building2, match: ["/properties", "/property", "/property-new", "/amenity"] },
  {
    to: "/inspections",
    label: "Inspections",
    icon: ClipboardCheck,
    match: ["/inspections", "/inspection", "/inspection-history", "/photos"],
  },
  { to: "/requests", label: "Requests", icon: Inbox, match: ["/requests", "/issue", "/request", "/work-order"] },
  { to: "/messages", label: "Messages", icon: MessageCircle, match: ["/messages", "/thread"] },
];

function pathActive(pathname: string, match: string[]) {
  return match.some((m) => pathname === m || pathname.startsWith(`${m}/`));
}

function TabsLayout() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { threads, signedIn, sessionReady } = useApp();
  const unread = threads.reduce((n, t) => n + t.unread, 0);

  useEffect(() => {
    if (sessionReady && !signedIn) navigate({ to: "/login" });
  }, [sessionReady, signedIn, navigate]);

  if (!sessionReady || !signedIn) return null;

  return (
    <div className="min-h-screen bg-background">
      <Outlet />
      <nav
        aria-label="Main"
        className="fixed inset-x-0 bottom-0 z-40 mx-auto flex max-w-[520px] items-stretch bg-[#093370]"
        style={{
          paddingTop: "var(--tab-pad-top)",
          paddingBottom: "var(--safe-bottom)",
          minHeight: "var(--tab-chrome)",
        }}
      >
        {tabs.map((t) => {
          const on = pathActive(pathname, t.match);
          const Icon = t.icon;
          return (
            <Link
              key={t.to}
              to={t.to}
              className={cn(
                "flex min-h-11 flex-1 flex-col items-center justify-center gap-1 text-[10px] font-semibold tracking-wide transition-colors duration-200",
                on ? "text-white" : "text-white/55",
              )}
            >
              <span className="relative flex h-7 w-7 items-center justify-center">
                <Icon className="h-6 w-6" strokeWidth={on ? 2.4 : 1.9} />
                {t.label === "Messages" && unread > 0 && (
                  <span className="absolute -top-1 -right-2 flex h-4 min-w-4 items-center justify-center bg-danger px-1 text-[10px] font-bold text-white">
                    {unread}
                  </span>
                )}
              </span>
              {t.label}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
