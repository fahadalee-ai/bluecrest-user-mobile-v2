import { Link, Outlet, createFileRoute, useLocation } from "@tanstack/react-router";
import { Camera, Home, LayoutList, MessageCircle, UserRound } from "lucide-react";
import { cn } from "@/lib/utils";
import { useApp } from "@/lib/app-state";

export const Route = createFileRoute("/_tabs")({
  component: TabsLayout,
});

/** Max 5 tabs — Home, Sites, Camera, Chat, Profile */
const tabs = [
  { to: "/home", label: "Home", icon: Home, match: ["/home", "/notifications"] },
  {
    to: "/sites",
    label: "Sites",
    icon: LayoutList,
    match: ["/sites", "/site", "/tasks", "/task", "/water", "/schedule"],
  },
  { to: "/camera", label: "Camera", icon: Camera, match: ["/camera", "/capture", "/photos"] },
  { to: "/chat", label: "Chat", icon: MessageCircle, match: ["/chat", "/thread", "/compose"] },
  {
    to: "/profile",
    label: "Profile",
    icon: UserRound,
    match: [
      "/profile",
      "/edit-profile",
      "/certifications",
      "/attendance",
      "/incident",
      "/settings",
      "/help",
    ],
  },
];

function TabsLayout() {
  const { pathname } = useLocation();
  const { threads } = useApp();
  const unread = threads.reduce((n, t) => n + t.unread, 0);

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
          const active = t.match.some((m) => pathname.startsWith(m));
          const Icon = t.icon;
          return (
            <Link
              key={t.to}
              to={t.to}
              className={cn(
                "flex min-h-11 flex-1 flex-col items-center justify-center gap-1 text-[10px] font-semibold tracking-wide transition-colors duration-200",
                active ? "text-white" : "text-white/55",
              )}
            >
              <span className="relative flex h-7 w-7 items-center justify-center">
                <Icon className="h-6 w-6" strokeWidth={active ? 2.4 : 1.9} />
                {t.label === "Chat" && unread > 0 && (
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
