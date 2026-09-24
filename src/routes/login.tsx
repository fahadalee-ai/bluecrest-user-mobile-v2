import { Link, createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
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
      { title: "Sign In — Bluecrest Staff" },
      {
        name: "description",
        content: "Sign in to your Bluecrest Amenity Management staff account to start your shift.",
      },
      { property: "og:title", content: "Sign In — Bluecrest Staff" },
      {
        property: "og:description",
        content: "Sign in to your Bluecrest staff account to start your shift.",
      },
    ],
  }),
  component: Login,
});

function Login() {
  const navigate = useNavigate();
  const { signIn } = useApp();
  const [email, setEmail] = useState("m.bennett@bluecrestamenity.com");
  const [password, setPassword] = useState("••••••••");
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  const submit = () => {
    const next: typeof errors = {};
    if (!/^\S+@\S+\.\S+$/.test(email)) next.email = "Enter a valid work email address.";
    if (password.length < 6) next.password = "Password must be at least 6 characters.";
    setErrors(next);
    if (Object.keys(next).length) return;
    signIn();
    navigate({ to: "/home" });
  };

  return (
    <AuthShell
      title="Welcome Back"
      subtitle="Sign in with your Bluecrest work email to start your shift."
      footer={
        <p className="text-center text-[12px] text-[#093370]/50">
          Bluecrest Amenity Management · Ozone Park, NY
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
            placeholder="you@bluecrestamenity.com"
          />
        </AuthField>

        <AuthField label="Password" error={errors.password}>
          <input
            type="password"
            autoComplete="current-password"
            className={authInputClass}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
          />
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
        <AuthButton variant="ghost" onClick={() => navigate({ to: "/access" })}>
          Learn How to Get Access
        </AuthButton>
      </div>
    </AuthShell>
  );
}
