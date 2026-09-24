import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Button, Field, NavBar, Screen, StickyFooter, inputClass } from "@/components/ios";

export const Route = createFileRoute("/_tabs/change-password")({
  head: () => ({ meta: [{ title: "Change Password — Bluecrest Client" }] }),
  component: ChangePassword,
});

function ChangePassword() {
  const router = useRouter();
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [confirm, setConfirm] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const save = () => {
    const e: Record<string, string> = {};
    if (current.length < 6) e.current = "Enter your current password.";
    if (next.length < 8) e.next = "Use at least 8 characters.";
    if (next !== confirm) e.confirm = "Passwords do not match.";
    setErrors(e);
    if (Object.keys(e).length) return;
    toast.success("Password updated");
    router.history.back();
  };

  return (
    <>
      <NavBar title="Change Password" />
      <Screen>
        <div className="space-y-4">
          <Field label="Current password" hint={errors.current}>
            <input
              type="password"
              className={inputClass}
              value={current}
              onChange={(e) => setCurrent(e.target.value)}
            />
          </Field>
          <Field label="New password" hint={errors.next}>
            <input
              type="password"
              className={inputClass}
              value={next}
              onChange={(e) => setNext(e.target.value)}
            />
          </Field>
          <Field label="Confirm new password" hint={errors.confirm}>
            <input
              type="password"
              className={inputClass}
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
            />
          </Field>
        </div>
      </Screen>
      <StickyFooter>
        <Button onClick={save}>Update Password</Button>
      </StickyFooter>
    </>
  );
}
