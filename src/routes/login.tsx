import { Link, createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import {
  AuthButton,
  AuthField,
  AuthShell,
  authInputClass,
} from "@/components/auth/AuthShell";
import { useApp } from "@/lib/app-state";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Sign In — Bluecrest Client" },
      {
        name: "description",
        content: "Sign in to view your Bluecrest-serviced properties, inspections, and requests.",
      },
      { property: "og:title", content: "Sign In — Bluecrest Client" },
      {
        property: "og:description",
        content: "Sign in to view your properties and service history.",
      },
    ],
  }),
  component: Login,
});

function Login() {
  const navigate = useNavigate();
  const { signIn } = useApp();
  const [email, setEmail] = useState("s.kim@related.com");
  const [password, setPassword] = useState("••••••••");
  const [show, setShow] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  const submit = () => {
    const next: typeof errors = {};
    if (!/^\S+@\S+\.\S+$/.test(email)) next.email = "Enter a valid email address.";
    if (password.length < 6) next.password = "Password must be at least 6 characters.";
    setErrors(next);
    if (Object.keys(next).length) return;
    signIn();
    navigate({ to: "/home" });
  };

  return (
    <AuthShell
      title="Welcome Back"
      subtitle="Sign in to view your properties"
      footer={
        <p className="text-center text-[12px] text-[#093370]/50">
          Protected by Bluecrest secure client access
        </p>
      }
    >
      <div className="space-y-5">
        <AuthField label="Email" error={errors.email}>
          <input
            type="email"
            inputMode="email"
            autoComplete="email"
            className={authInputClass}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@company.com"
          />
        </AuthField>

        <AuthField label="Password" error={errors.password}>
          <div className="relative">
            <input
              type={show ? "text" : "password"}
              autoComplete="current-password"
              className={`${authInputClass} pr-12`}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
            />
            <button
              type="button"
              aria-label={show ? "Hide password" : "Show password"}
              onClick={() => setShow((v) => !v)}
              className="absolute top-0 right-0 flex h-12 w-12 items-center justify-center text-[#0258B8]"
            >
              {show ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>
        </AuthField>

        <div className="flex justify-end">
          <Link
            to="/forgot-password"
            className="min-h-11 py-2 text-[15px] font-semibold text-[#0258B8]"
          >
            Forgot Password?
          </Link>
        </div>

        <AuthButton onClick={submit}>Sign In</AuthButton>

        <div className="flex items-center gap-3 pt-1">
          <span className="h-px flex-1 bg-[#093370]/12" />
          <span className="text-[12px] font-semibold tracking-wide text-[#093370]/45 uppercase">
            Don&apos;t have access yet?
          </span>
          <span className="h-px flex-1 bg-[#093370]/12" />
        </div>

        <AuthButton variant="ghost" onClick={() => navigate({ to: "/access" })}>
          Learn How to Get Access
        </AuthButton>
      </div>
    </AuthShell>
  );
}
