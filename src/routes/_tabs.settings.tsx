import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Alert, ListGroup, ListRow, NavBar, Screen, SectionHeader } from "@/components/ios";
import { brand, staff } from "@/data/bluecrest";
import { useApp } from "@/lib/app-state";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_tabs/settings")({
  head: () => ({
    meta: [
      { title: "Settings — Bluecrest Staff" },
      {
        name: "description",
        content: "Manage notifications, location permissions, appearance and account preferences.",
      },
      { property: "og:title", content: "Settings — Bluecrest Staff" },
      {
        property: "og:description",
        content: "Notifications, location permissions and account preferences.",
      },
    ],
  }),
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
  const { signOut } = useApp();
  const [push, setPush] = useState(true);
  const [shiftReminders, setShiftReminders] = useState(true);
  const [taskAlerts, setTaskAlerts] = useState(true);
  const [messages, setMessages] = useState(true);
  const [location, setLocation] = useState(true);
  const [confirm, setConfirm] = useState(false);

  return (
    <>
      <NavBar title="Settings" />
      <Screen>
        <SectionHeader>Notifications</SectionHeader>
        <ListGroup>
          <ListRow
            title="Push Notifications"
            trailing={<Toggle checked={push} onChange={setPush} label="Push notifications" />}
          />
          <ListRow
            title="Shift Reminders"
            subtitle="30 minutes before each shift"
            trailing={
              <Toggle checked={shiftReminders} onChange={setShiftReminders} label="Shift reminders" />
            }
          />
          <ListRow
            title="Task Alerts"
            trailing={<Toggle checked={taskAlerts} onChange={setTaskAlerts} label="Task alerts" />}
          />
          <ListRow
            title="Message Alerts"
            trailing={<Toggle checked={messages} onChange={setMessages} label="Message alerts" />}
          />
        </ListGroup>

        <SectionHeader>Permissions</SectionHeader>
        <ListGroup>
          <ListRow
            title="Location Access"
            subtitle="Required for clock-in and photo verification"
            trailing={<Toggle checked={location} onChange={setLocation} label="Location access" />}
          />
          <ListRow
            title="Camera Access"
            subtitle="Granted"
            trailing={<span className="text-[15px] text-muted-foreground">Granted</span>}
          />
        </ListGroup>

        <SectionHeader>Account</SectionHeader>
        <ListGroup>
          <ListRow title="Signed in as" subtitle={staff.email} />
          <ListRow
            title="Change Password"
            onClick={() => toast.info("A reset link has been sent to your email")}
          />
          <ListRow title="App Version" trailing={<span className="text-[15px] text-muted-foreground">{brand.version}</span>} />
        </ListGroup>

        <SectionHeader>Legal</SectionHeader>
        <ListGroup>
          <ListRow title="Privacy Policy" onClick={() => toast.info("Opening privacy policy")} />
          <ListRow title="Terms of Service" onClick={() => toast.info("Opening terms of service")} />
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
        message="You'll need to sign in again to continue your shift."
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
