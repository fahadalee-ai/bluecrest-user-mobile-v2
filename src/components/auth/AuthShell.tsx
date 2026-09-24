import type { CSSProperties, ReactNode } from "react";
import { ChevronLeft } from "lucide-react";
import { useCanGoBack, useRouter } from "@tanstack/react-router";
import { cn } from "@/lib/utils";
import authBg from "@/assets/auth-pool.jpg";
import logoColor from "@/assets/bluecrest-logo.png";
import logoWhite from "@/assets/bluecrest-logo-white.png";

/** Sharp-corner primary CTA for auth / onboarding surfaces. Min 48pt height. */
export function AuthButton({
  children,
  variant = "primary",
  className,
  disabled,
  type = "button",
  onClick,
}: {
  children: ReactNode;
  variant?: "primary" | "secondary" | "ghost" | "light";
  className?: string;
  disabled?: boolean;
  type?: "button" | "submit";
  onClick?: () => void;
}) {
  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={cn(
        "inline-flex min-h-12 w-full items-center justify-center gap-2 px-4 text-[17px] font-semibold transition-all duration-200 ease-[cubic-bezier(0.25,0.1,0.25,1)] active:opacity-80 disabled:pointer-events-none disabled:opacity-40",
        variant === "primary" && "bg-[#0258B8] text-white hover:bg-[#024a9c]",
        variant === "secondary" && "border border-white/35 bg-white/10 text-white backdrop-blur-sm",
        variant === "ghost" && "text-[#0258B8]",
        variant === "light" && "bg-white text-[#093370]",
        className,
      )}
    >
      {children}
    </button>
  );
}

export const authInputClass =
  "min-h-12 w-full border border-[#093370]/20 bg-white px-3.5 text-[17px] text-[#093370] outline-none transition-colors duration-200 placeholder:text-[#093370]/40 focus:border-[#0258B8] focus:ring-2 focus:ring-[#0258B8]/20 disabled:bg-[#093370]/5 disabled:text-[#093370]/40";

export function AuthField({
  label,
  children,
  error,
}: {
  label: string;
  children: ReactNode;
  error?: string | undefined;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[12px] font-semibold tracking-[0.08em] text-[#093370]/65 uppercase">
        {label}
      </span>
      {children}
      {error && <span className="mt-1.5 block text-[13px] text-danger">{error}</span>}
    </label>
  );
}

/** Full-bleed brand atmosphere: navy→blue gradient + soft pool photo. */
export function BrandAtmosphere({
  image = authBg,
  imageOpacity = 0.22,
  className,
  style,
  children,
}: {
  image?: string;
  imageOpacity?: number;
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
}) {
  return (
    <div
      data-auth-surface
      className={cn("relative isolate flex min-h-0 flex-col overflow-hidden bg-[#093370]", className)}
      style={style}
    >
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(165deg, #093370 0%, #0a3d86 42%, #0258B8 100%)",
        }}
      />
      <img
        src={image}
        alt=""
        aria-hidden
        className="absolute inset-0 h-full w-full object-cover mix-blend-luminosity"
        style={{ opacity: imageOpacity }}
      />
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, rgba(9,51,112,0.35) 0%, rgba(9,51,112,0.55) 45%, rgba(9,51,112,0.88) 100%)",
        }}
      />
      <div className="relative z-10 flex min-h-0 flex-1 flex-col">{children}</div>
    </div>
  );
}

export function BrandLogoMark({
  width = 200,
  className,
  /** Use `white` on navy/blue gradients; `color` on light surfaces. */
  variant = "white",
}: {
  width?: number;
  className?: string;
  variant?: "white" | "color";
}) {
  return (
    <img
      src={variant === "white" ? logoWhite : logoColor}
      alt="Bluecrest Amenity Management"
      width={width}
      height={Math.round(width * 0.32)}
      className={cn("h-auto max-w-full object-contain", className)}
      style={{ width }}
    />
  );
}

/** Auth screen shell: atmospheric header + white form body. */
export function AuthShell({
  children,
  title,
  subtitle,
  showBack,
  footer,
}: {
  children: ReactNode;
  title: string;
  subtitle?: string;
  showBack?: boolean;
  footer?: ReactNode;
}) {
  const router = useRouter();
  const canGoBack = useCanGoBack();

  return (
    <div data-auth-surface className="auth-fullscreen bg-white">
      <BrandAtmosphere
        className="shrink-0 px-[18px] pb-8"
        style={{ paddingTop: "var(--safe-top)" }}
      >
        <div
          className="flex items-center"
          style={{ height: "var(--nav-height)", minHeight: "var(--nav-height)" }}
        >
          {showBack ? (
            <button
              type="button"
              aria-label="Back"
              onClick={() =>
                canGoBack ? router.history.back() : router.navigate({ to: "/login" })
              }
              className="flex w-11 items-center justify-center text-white/90 transition-colors duration-200 active:bg-white/10"
              style={{ height: "var(--nav-height)", minHeight: "var(--touch-min)" }}
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
          ) : (
            <span className="w-11" style={{ height: "var(--nav-height)" }} />
          )}
        </div>
        <div className="mt-2 flex flex-col items-start duration-300 animate-in fade-in slide-in-from-bottom-2">
          <BrandLogoMark width={168} />
          <h1 className="mt-6 text-large-title text-white">{title}</h1>
          {subtitle && (
            <p className="mt-2 max-w-[20rem] text-[15px] leading-relaxed text-white/80">
              {subtitle}
            </p>
          )}
        </div>
      </BrandAtmosphere>

      <div className="flex min-h-0 flex-1 flex-col overflow-y-auto px-[18px] pt-7 pb-[max(2rem,var(--safe-bottom))]">
        <div className="flex-1 duration-300 animate-in fade-in slide-in-from-bottom-3">
          {children}
        </div>
        {footer && <div className="mt-8">{footer}</div>}
      </div>
    </div>
  );
}
