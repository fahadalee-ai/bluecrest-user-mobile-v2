import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { AppStateProvider } from "../lib/app-state";
import { Toaster } from "sonner";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-[18px] safe-pt safe-pb">
      <div className="max-w-md text-center">
        <h1 className="text-large-title text-navy">404</h1>
        <h2 className="mt-4 text-[17px] font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-[15px] text-muted-foreground">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex min-h-12 items-center justify-center bg-primary px-4 text-[17px] font-semibold text-primary-foreground transition-colors duration-200"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-[18px] safe-pt safe-pb">
      <div className="max-w-md text-center">
        <h1 className="text-[17px] font-semibold tracking-tight text-foreground">
          This page didn&apos;t load
        </h1>
        <p className="mt-2 text-[15px] text-muted-foreground">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <button
            type="button"
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex min-h-12 items-center justify-center bg-primary px-4 text-[17px] font-semibold text-primary-foreground transition-colors duration-200"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex min-h-12 items-center justify-center border border-input bg-background px-4 text-[17px] font-semibold text-foreground transition-colors duration-200"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1, viewport-fit=cover",
      },
      { title: "Bluecrest Client" },
      {
        name: "description",
        content:
          "Bluecrest Amenity Management client portal — inspection reports, photo proof, issues, and a direct line to your representative.",
      },
      { name: "author", content: "Bluecrest Amenity Management" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "theme-color", content: "#093370" },
      { name: "apple-mobile-web-app-capable", content: "yes" },
      { name: "apple-mobile-web-app-status-bar-style", content: "black-translucent" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "icon", type: "image/png", href: "/favicon.png" },
      { rel: "apple-touch-icon", href: "/apple-touch-icon.png" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      <AppStateProvider>
        <main className="mx-auto flex min-h-dvh w-full max-w-[520px] flex-col bg-background shadow-sm [&:has([data-auth-surface])]:bg-[#093370]">
          <Outlet />
        </main>
        <Toaster position="top-center" richColors duration={3000} />
      </AppStateProvider>
    </QueryClientProvider>
  );
}
