import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { MailCheck } from "lucide-react";
import {
  AuthButton,
  AuthField,
  AuthShell,
  authInputClass,
} from "@/components/auth/AuthShell";

export const Route = createFileRoute("/forgot-password")({
  head: () => ({
    meta: [
      { title: "Reset Password — Bluecrest Staff" },
      {
        name: "description",
        content: "Request a password reset link for your Bluecrest Amenity Management staff account.",
      },
      { property: "og:title", content: "Reset Password — Bluecrest Staff" },
      {
        property: "og:description",
        content: "Request a password reset link for your Bluecrest staff account.",
      },
    ],
  }),
  component: ForgotPassword,
});

function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);
  const [cooldown, setCooldown] = useState(0);

  useEffect(() => {
    if (cooldown <= 0) return;
    const id = setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => clearTimeout(id);
  }, [cooldown]);

  const send = () => {
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      setError("Enter the work email on your Bluecrest account.");
      return;
    }
    setError("");
    setSent(true);
    setCooldown(30);
  };

  return (
    <AuthShell
      showBack
      title={sent ? "Check your email" : "Reset your password"}
      subtitle={
        sent
          ? `We sent a reset link to ${email}. The link expires in 30 minutes.`
          : "Enter your work email and we'll send a secure link to set a new password."
      }
    >
      {!sent ? (
        <div className="space-y-5">
          <AuthField label="Email" error={error}>
            <input
              type="email"
              inputMode="email"
              className={authInputClass}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@bluecrestamenity.com"
            />
          </AuthField>
          <AuthButton onClick={send}>Send Reset Link</AuthButton>
        </div>
      ) : (
        <div className="duration-300 animate-in fade-in slide-in-from-bottom-2">
          <div className="mb-6 flex h-16 w-16 items-center justify-center bg-[#0258B8]/10 text-[#0258B8]">
            <MailCheck className="h-8 w-8" strokeWidth={1.6} />
          </div>
          <p className="text-[15px] leading-relaxed text-[#093370]/70">
            Didn&apos;t get it? Check spam, or resend after the timer. Still stuck? Call the Bluecrest
            office and HR will reset it for you.
          </p>
          <div className="mt-8 space-y-3">
            <AuthButton
              variant="primary"
              disabled={cooldown > 0}
              onClick={() => {
                setCooldown(30);
              }}
            >
              {cooldown > 0 ? `Resend Email (${cooldown}s)` : "Resend Email"}
            </AuthButton>
            <AuthButton variant="ghost" onClick={() => navigate({ to: "/login" })}>
              Back to Sign In
            </AuthButton>
          </div>
        </div>
      )}
    </AuthShell>
  );
}
