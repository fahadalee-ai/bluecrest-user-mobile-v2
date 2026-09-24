import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { Button, Field, NavBar, Screen, StickyFooter, inputClass } from "@/components/ios";
import { staff } from "@/data/bluecrest";
import { Camera } from "lucide-react";

export const Route = createFileRoute("/_tabs/edit-profile")({
  head: () => ({
    meta: [
      { title: "Edit Profile — Bluecrest Staff" },
      {
        name: "description",
        content: "Update your contact details, profile photo and emergency contact information.",
      },
      { property: "og:title", content: "Edit Profile — Bluecrest Staff" },
      {
        property: "og:description",
        content: "Update contact details, profile photo and emergency contact.",
      },
    ],
  }),
  component: EditProfile,
});

function EditProfile() {
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);
  const [avatar, setAvatar] = useState(staff.avatar);
  const [name, setName] = useState(staff.name);
  const [phone, setPhone] = useState(staff.phone);
  const [ecName, setEcName] = useState(staff.emergencyContactName);
  const [ecPhone, setEcPhone] = useState(staff.emergencyContactPhone);

  return (
    <>
      <NavBar title="Edit Profile" />
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
          <p className="mt-2 text-[12px] text-muted-foreground">
            Profile photos may be uploaded from your device.
          </p>
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
          <Field label="Email" hint="Contact your supervisor to update this">
            <input className={inputClass} value={staff.email} disabled />
          </Field>
          <Field label="Emergency Contact Name">
            <input className={inputClass} value={ecName} onChange={(e) => setEcName(e.target.value)} />
          </Field>
          <Field label="Emergency Contact Phone">
            <input
              className={inputClass}
              inputMode="tel"
              value={ecPhone}
              onChange={(e) => setEcPhone(e.target.value)}
            />
          </Field>
        </div>
      </Screen>
      <StickyFooter>
        <Button
          onClick={() => {
            toast.success("Profile updated");
            router.history.back();
          }}
        >
          Save Changes
        </Button>
      </StickyFooter>
    </>
  );
}
