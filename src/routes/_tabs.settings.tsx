import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Alert, ListGroup, ListRow, NavBar, Screen, SectionHeader } from "@/components/ios";
import { brand } from "@/data/bluecrest";
import { useApp } from "@/lib/app-state";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_tabs/settings")({
  head: () => ({ meta: [{ title: "Settings — Bluecrest Client" }] }),
  component: SettingsScreen,
});

function Toggle({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={cn(
        "relative h-[31px] w-[51px] shrink-0 transition-colors duration-200",
        checked ? "bg-success" : "bg-muted-foreground/35",
      )}
    >
      <span
        className={cn(
          "absolute top-[2px] h-[27px] w-[27px] bg-card shadow transition-transform duration-200",
          checked ? "translate-x-[22px]" : "translate-x-[2px]",
        )}
      />
    </button>
  );
}

function SettingsScreen() {
  const navigate = useNavigate();
  const { signOut, notifPrefs, setNotifPref, client } = useApp();
  const [confirm, setConfirm] = useState(false);

  return (
    <>
      <NavBar title="Settings" />
      <Screen>
        <SectionHeader>Push notifications</SectionHeader>
        <ListGroup>
          <ListRow
            title="New Inspection"
            trailing={
              <Toggle
                checked={notifPrefs.inspections}
                onChange={(v) => setNotifPref("inspections", v)}
                label="New inspection"
              />
            }
          />
          <ListRow
            title="New Issue"
            trailing={
              <Toggle checked={notifPrefs.issues} onChange={(v) => setNotifPref("issues", v)} label="New issue" />
            }
          />
          <ListRow
            title="Work Completed"
            trailing={
              <Toggle checked={notifPrefs.work} onChange={(v) => setNotifPref("work", v)} label="Work completed" />
            }
          />
          <ListRow
            title="Request Updates"
            trailing={
              <Toggle
                checked={notifPrefs.requests}
                onChange={(v) => setNotifPref("requests", v)}
                label="Request updates"
              />
            }
          />
          <ListRow
            title="Announcements"
            trailing={
              <Toggle
                checked={notifPrefs.announcements}
                onChange={(v) => setNotifPref("announcements", v)}
                label="Announcements"
              />
            }
          />
        </ListGroup>

        <SectionHeader>Preferences</SectionHeader>
        <ListGroup>
          <ListRow title="Language" subtitle="English" trailing={<span className="text-[15px] text-muted-foreground">Default</span>} />
          <ListRow title="Signed in as" subtitle={client.email} />
          <ListRow title="App Version" trailing={<span className="text-[15px] text-muted-foreground">{brand.version}</span>} />
        </ListGroup>

        <SectionHeader>Support</SectionHeader>
        <ListGroup>
          <ListRow title="Help & Support" to="/help" />
        </ListGroup>

        <div className="mt-4">
          <ListGroup>
            <ListRow destructive title="Log Out" onClick={() => setConfirm(true)} />
          </ListGroup>
        </div>
      </Screen>

      <Alert
        open={confirm}
        title="Log out of Bluecrest?"
        message="You'll need to sign in again to view your properties."
        confirmLabel="Log Out"
        destructive
        onCancel={() => setConfirm(false)}
        onConfirm={() => {
          signOut();
          navigate({ to: "/login" });
        }}
      />
    </>
  );
}
