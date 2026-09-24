import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Mail, Phone, ShieldCheck } from "lucide-react";
import { AuthButton, AuthShell } from "@/components/auth/AuthShell";
import { brand } from "@/data/bluecrest";

export const Route = createFileRoute("/access")({
  head: () => ({
    meta: [
      { title: "How to Get Access — Bluecrest Client" },
      {
        name: "description",
        content:
          "Client portal accounts are set up by Bluecrest when a service agreement begins.",
      },
      { property: "og:title", content: "How to Get Access — Bluecrest Client" },
      {
        property: "og:description",
        content: "Bluecrest client accounts are invite-only and set up by your representative.",
      },
    ],
  }),
  component: AccessScreen,
});

function AccessScreen() {
  const navigate = useNavigate();

  return (
    <AuthShell
      showBack
      title="Invite-Only Access"
      subtitle="Client portal accounts are set up by Bluecrest when a service agreement begins — not as a self-serve signup."
    >
      <div className="mb-6 flex h-14 w-14 items-center justify-center bg-[#0258B8]/10 text-[#0258B8]">
        <ShieldCheck className="h-7 w-7" strokeWidth={1.6} />
      </div>

      <p className="text-[15px] leading-relaxed text-[#093370]/70">
        Client access is set up by your Bluecrest account representative as part of your service
        agreement. If you manage a Bluecrest-serviced property and don&apos;t yet have access, reach
        out to your representative or our office.
      </p>

      <div className="mt-7 border border-[#093370]/15 bg-[rgba(9,51,112,0.03)] p-4">
        <p className="text-[12px] font-semibold tracking-[0.14em] text-[#093370]/55 uppercase">
          Contact Bluecrest
        </p>
        <a
          href={`tel:${brand.phone.replace(/\D/g, "")}`}
          className="mt-4 flex min-h-12 items-center gap-3 border-b border-[#093370]/10 text-[17px] text-[#093370]"
        >
          <Phone className="h-5 w-5 shrink-0 text-[#0258B8]" />
          Call Bluecrest Office
        </a>
        <a
          href={`mailto:${brand.email}`}
          className="flex min-h-12 items-center gap-3 text-[17px] text-[#093370]"
        >
          <Mail className="h-5 w-5 shrink-0 text-[#0258B8]" />
          Email Client Services
        </a>
        <p className="mt-3 text-[13px] leading-relaxed text-[#093370]/55">
          {brand.phone} · {brand.email}
        </p>
        <p className="mt-1 text-[13px] leading-relaxed text-[#093370]/55">{brand.address}</p>
      </div>

      <div className="mt-8">
        <AuthButton onClick={() => navigate({ to: "/login" })}>Back to Sign In</AuthButton>
      </div>
    </AuthShell>
  );
}
