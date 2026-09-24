import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Alert, Card, ListGroup, ListRow, NavBar, Screen } from "@/components/ios";
import { staff } from "@/data/bluecrest";
import { useApp } from "@/lib/app-state";
import {
  CalendarCheck,
  ChevronRight,
  FileWarning,
  HelpCircle,
  Images,
  LogOut,
  Settings,
  ShieldCheck,
  UserRoundPen,
} from "lucide-react";

export const Route = createFileRoute("/_tabs/profile")({
  head: () => ({
    meta: [
      { title: "My Profile — Bluecrest Staff" },
      {
        name: "description",
        content: "Your Bluecrest lifeguard profile: attendance stats, certifications, incident reports and settings.",
      },
      { property: "og:title", content: "My Profile — Bluecrest Staff" },
      {
        property: "og:description",
        content: "Attendance stats, certifications, incident reports and app settings.",
      },
    ],
  }),
  component: Profile,
});

function Profile() {
  const navigate = useNavigate();
  const { signOut } = useApp();
  const [confirm, setConfirm] = useState(false);

  return (
    <>
      <NavBar title="Profile" back={false} />
      <Screen>
        <div className="mb-5 overflow-hidden border border-border/70 bg-card">
          <div className="h-1.5 bg-[#093370]" />
          <div className="flex items-center gap-3.5 px-4 py-3.5">
            <img
              src={staff.avatar}
              alt={staff.name}
              width={512}
              height={512}
              className="h-14 w-14 shrink-0 object-cover"
            />
            <div className="min-w-0 flex-1">
              <h1 className="truncate text-[17px] font-semibold text-navy">{staff.name}</h1>
              <p className="mt-0.5 truncate text-[13px] text-muted-foreground">{staff.role}</p>
              <p className="mt-1.5 inline-block bg-accent px-2 py-0.5 text-[11px] font-semibold tracking-wide text-primary uppercase">
                ID {staff.id}
              </p>
            </div>
          </div>
        </div>

        <div className="mb-5 grid grid-cols-3 gap-2">
          {[
            { l: "Attendance", v: staff.stats.attendance },
            { l: "Tasks Done", v: staff.stats.tasksCompleted },
            { l: "On-Time", v: staff.stats.onTime },
          ].map((s) => (
            <Card key={s.l} className="p-3 text-center">
              <p className="text-[20px] font-bold text-navy">{s.v}</p>
              <p className="text-[11px] text-muted-foreground">{s.l}</p>
            </Card>
          ))}
        </div>

        <ListGroup className="mb-4">
          <ListRow
            to="/edit-profile"
            leading={<Icon><UserRoundPen className="h-4 w-4" /></Icon>}
            title="Edit Profile"
            trailing={<ChevronRight className="h-4 w-4 text-muted-foreground" />}
          />
          <ListRow
            to="/certifications"
            leading={<Icon><ShieldCheck className="h-4 w-4" /></Icon>}
            title="Certifications & Documents"
            trailing={<ChevronRight className="h-4 w-4 text-muted-foreground" />}
          />
          <ListRow
            to="/attendance"
            leading={<Icon><CalendarCheck className="h-4 w-4" /></Icon>}
            title="Attendance / Shift History"
            trailing={<ChevronRight className="h-4 w-4 text-muted-foreground" />}
          />
          <ListRow
            to="/incidents"
            leading={<Icon><FileWarning className="h-4 w-4" /></Icon>}
            title="My Incident Reports"
            trailing={<ChevronRight className="h-4 w-4 text-muted-foreground" />}
          />
          <ListRow
            to="/photos"
            leading={<Icon><Images className="h-4 w-4" /></Icon>}
            title="My Submitted Photos"
            trailing={<ChevronRight className="h-4 w-4 text-muted-foreground" />}
          />
        </ListGroup>

        <ListGroup className="mb-6">
          <ListRow
            to="/settings"
            leading={<Icon><Settings className="h-4 w-4" /></Icon>}
            title="Settings"
            trailing={<ChevronRight className="h-4 w-4 text-muted-foreground" />}
          />
          <ListRow
            to="/help"
            leading={<Icon><HelpCircle className="h-4 w-4" /></Icon>}
            title="Help & Support"
            trailing={<ChevronRight className="h-4 w-4 text-muted-foreground" />}
          />
        </ListGroup>

        <ListGroup>
          <ListRow
            destructive
            onClick={() => setConfirm(true)}
            leading={
              <span className="flex h-8 w-8 items-center justify-center bg-danger-soft text-danger">
                <LogOut className="h-4 w-4" />
              </span>
            }
            title="Log Out"
          />
        </ListGroup>
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

function Icon({ children }: { children: React.ReactNode }) {
  return (
    <span className="flex h-8 w-8 items-center justify-center bg-accent text-primary">
      {children}
    </span>
  );
}
