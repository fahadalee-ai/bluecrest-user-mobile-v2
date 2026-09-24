import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { Button, Field, NavBar, Screen, StickyFooter, inputClass } from "@/components/ios";
import { useApp } from "@/lib/app-state";
import { Camera } from "lucide-react";

export const Route = createFileRoute("/_tabs/edit-profile")({
  head: () => ({ meta: [{ title: "Edit Contact Info — Bluecrest Client" }] }),
  component: EditProfile,
});

function EditProfile() {
  const router = useRouter();
  const { client, updateClient } = useApp();
  const fileRef = useRef<HTMLInputElement>(null);
  const [avatar, setAvatar] = useState(client.avatar);
  const [name, setName] = useState(client.name);
  const [phone, setPhone] = useState(client.phone);

  return (
    <>
      <NavBar title="Edit Contact Info" />
      <Screen>
        <div className="mb-6 flex flex-col items-center">
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            className="relative h-24 w-24 overflow-hidden"
          >
            <img src={avatar} alt="Profile photo" className="h-full w-full object-cover" />
            <span className="absolute inset-x-0 bottom-0 flex h-8 items-center justify-center gap-1 bg-navy/70 text-[11px] font-semibold text-navy-foreground">
              <Camera className="h-3.5 w-3.5" /> Change
            </span>
          </button>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) setAvatar(URL.createObjectURL(f));
            }}
          />
        </div>

        <div className="space-y-4">
          <Field label="Full Name">
            <input className={inputClass} value={name} onChange={(e) => setName(e.target.value)} />
          </Field>
          <Field label="Phone">
            <input
              className={inputClass}
              inputMode="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </Field>
          <Field label="Email" hint="Email may be managed by Bluecrest. Contact Client Services to update.">
            <input className={inputClass} value={client.email} disabled />
          </Field>
        </div>
      </Screen>
      <StickyFooter>
        <Button
          onClick={() => {
            updateClient({
              name,
              firstName: name.split(" ")[0] ?? name,
              phone,
              avatar,
            });
            toast.success("Contact info updated");
            router.history.back();
          }}
        >
          Save Changes
        </Button>
      </StickyFooter>
    </>
  );
}
