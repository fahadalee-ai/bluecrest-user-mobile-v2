import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Mail, Phone, ShieldCheck } from "lucide-react";
import { AuthButton, AuthShell } from "@/components/auth/AuthShell";
import { brand } from "@/data/bluecrest";

export const Route = createFileRoute("/access")({
  head: () => ({
    meta: [
      { title: "How to Get Access — Bluecrest Staff" },
      {
        name: "description",
        content:
          "Bluecrest staff accounts are created by your supervisor or the Bluecrest office. Here's how to request access.",
      },
      { property: "og:title", content: "How to Get Access — Bluecrest Staff" },
      {
        property: "og:description",
        content: "Bluecrest staff accounts are invite-only and created by your supervisor.",
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
      title="Accounts Are Invite-Only"
      subtitle="For site security and compliance, Bluecrest staff accounts are created only by an Administrator or your Site Supervisor."
    >
      <div className="mb-6 flex h-14 w-14 items-center justify-center bg-[#0258B8]/10 text-[#0258B8]">
        <ShieldCheck className="h-7 w-7" strokeWidth={1.6} />
      </div>

      <p className="text-[15px] leading-relaxed text-[#093370]/70">
        There is no public sign-up. Contact the office below and your supervisor will issue credentials
        for your assigned sites.
      </p>

      <div className="mt-7 border border-[#093370]/15 bg-[rgba(9,51,112,0.03)] p-4">
        <p className="text-[12px] font-semibold tracking-[0.14em] text-[#093370]/55 uppercase">
          Contact the Bluecrest Office
        </p>
        <a
          href={`tel:${brand.phone.replace(/\D/g, "")}`}
          className="mt-4 flex min-h-12 items-center gap-3 border-b border-[#093370]/10 text-[17px] text-[#093370]"
        >
          <Phone className="h-5 w-5 shrink-0 text-[#0258B8]" />
          {brand.phone}
        </a>
        <a
          href={`mailto:${brand.email}`}
          className="flex min-h-12 items-center gap-3 border-b border-[#093370]/10 text-[17px] break-all text-[#093370]"
        >
          <Mail className="h-5 w-5 shrink-0 text-[#0258B8]" />
          {brand.email}
        </a>
        <p className="mt-3 text-[13px] leading-relaxed text-[#093370]/55">{brand.address}</p>
      </div>

      <div className="mt-8">
        <AuthButton onClick={() => navigate({ to: "/login" })}>Back to Sign In</AuthButton>
      </div>
    </AuthShell>
  );
}
