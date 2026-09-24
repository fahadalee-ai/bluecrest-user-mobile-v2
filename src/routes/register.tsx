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

export const Route = createFileRoute("/register")({
  head: () => ({
    meta: [
      { title: "Create Account — Bluecrest Client" },
      {
        name: "description",
        content: "Create a Bluecrest client portal account to view your properties and inspections.",
      },
      { property: "og:title", content: "Create Account — Bluecrest Client" },
      {
        property: "og:description",
        content: "Register for Bluecrest client access to your serviced properties.",
      },
    ],
  }),
  component: Register,
});

type Errors = {
  name?: string;
  company?: string;
  email?: string;
  phone?: string;
  password?: string;
  confirm?: string;
};

function Register() {
  const navigate = useNavigate();
  const { signIn, updateClient } = useApp();
  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [title, setTitle] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [show, setShow] = useState(false);
  const [errors, setErrors] = useState<Errors>({});

  const submit = () => {
    const next: Errors = {};
    if (name.trim().length < 2) next.name = "Enter your full name.";
    if (company.trim().length < 2) next.company = "Enter your company name.";
    if (!/^\S+@\S+\.\S+$/.test(email)) next.email = "Enter a valid work email.";
    if (phone.replace(/\D/g, "").length < 10) next.phone = "Enter a 10-digit phone number.";
    if (password.length < 8) next.password = "Use at least 8 characters.";
    if (password !== confirm) next.confirm = "Passwords do not match.";
    setErrors(next);
    if (Object.keys(next).length) return;

    const trimmed = name.trim();
    updateClient({
      name: trimmed,
      firstName: trimmed.split(" ")[0] ?? trimmed,
      title: title.trim() || "Property Manager",
      company: company.trim(),
      email: email.trim(),
      phone: phone.trim(),
    });
    signIn();
    navigate({ to: "/home" });
  };

  return (
    <AuthShell
      showBack
      title="Create Account"
      subtitle="Register to view inspections, photo proof, and a direct line to Bluecrest."
      footer={
        <p className="text-center text-[12px] text-[#093370]/50">
          Already have access?{" "}
          <Link to="/login" className="font-semibold text-[#0258B8]">
            Sign In
          </Link>
        </p>
      }
    >
      <div className="space-y-5">
        <AuthField label="Full name" error={errors.name}>
          <input
            type="text"
            autoComplete="name"
            className={authInputClass}
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Sarah Kim"
          />
        </AuthField>

        <AuthField label="Company" error={errors.company}>
          <input
            type="text"
            autoComplete="organization"
            className={authInputClass}
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            placeholder="Related Property Group"
          />
        </AuthField>

        <AuthField label="Title">
          <input
            type="text"
            autoComplete="organization-title"
            className={authInputClass}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Property Manager"
          />
        </AuthField>

        <AuthField label="Work email" error={errors.email}>
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

        <AuthField label="Phone" error={errors.phone}>
          <input
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            className={authInputClass}
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="(212) 555-0194"
          />
        </AuthField>

        <AuthField label="Password" error={errors.password}>
          <div className="relative">
            <input
              type={show ? "text" : "password"}
              autoComplete="new-password"
              className={`${authInputClass} pr-12`}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="At least 8 characters"
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

        <AuthField label="Confirm password" error={errors.confirm}>
          <input
            type={show ? "text" : "password"}
            autoComplete="new-password"
            className={authInputClass}
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            placeholder="Re-enter your password"
          />
        </AuthField>

        <AuthButton onClick={submit}>Create Account</AuthButton>
      </div>
    </AuthShell>
  );
}
