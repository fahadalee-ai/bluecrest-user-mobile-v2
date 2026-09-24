import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Alert, Card, ListGroup, ListRow, NavBar, Screen } from "@/components/ios";
import { IconTile } from "@/components/client/widgets";
import { properties } from "@/data/bluecrest";
import { useApp } from "@/lib/app-state";
import {
  ChevronRight,
  FileText,
  HelpCircle,
  KeyRound,
  LogOut,
  Settings,
  UserRoundPen,
} from "lucide-react";

export const Route = createFileRoute("/_tabs/profile")({
  head: () => ({
    meta: [
      { title: "Profile & Account — Bluecrest Client" },
      { name: "description", content: "Your company profile, reports, settings, and support." },
    ],
  }),
  component: Profile,
});

function Profile() {
  const navigate = useNavigate();
  const { client, signOut } = useApp();
  const [confirm, setConfirm] = useState(false);

  return (
    <>
      <NavBar title="Profile & Account" />
      <Screen>
        <div className="mb-5 overflow-hidden border border-border/70 bg-card">
          <div className="h-1.5 bg-[#093370]" />
          <div className="flex items-center gap-3.5 px-4 py-3.5">
            <img src={client.avatar} alt={client.name} className="h-14 w-14 shrink-0 object-cover" />
            <div className="min-w-0 flex-1">
              <h1 className="truncate text-[17px] font-semibold text-navy">{client.name}</h1>
              <p className="mt-0.5 truncate text-[13px] text-muted-foreground">{client.title}</p>
              <p className="mt-1 truncate text-[13px] font-semibold text-primary">{client.company}</p>
            </div>
          </div>
        </div>

        <Card className="mb-5">
          <p className="text-[13px] font-semibold tracking-wide text-muted-foreground uppercase">
            Company
          </p>
          <p className="mt-2 text-[17px] font-semibold text-navy">{client.company}</p>
          <p className="mt-1 text-[15px] text-muted-foreground">{client.billingAddress}</p>
          <p className="mt-3 text-[13px] text-muted-foreground">Properties on this account</p>
        </Card>
        <ListGroup className="mb-5">
          {properties.map((p) => (
            <ListRow
              key={p.id}
              to="/property/$propertyId"
              params={{ propertyId: p.id }}
              title={p.name}
              subtitle={p.address}
              trailing={<ChevronRight className="h-4 w-4 text-muted-foreground" />}
            />
          ))}
        </ListGroup>

        <ListGroup className="mb-4">
          <ListRow
            to="/edit-profile"
            leading={<IconTile><UserRoundPen className="h-4 w-4" /></IconTile>}
            title="Edit Contact Info"
            trailing={<ChevronRight className="h-4 w-4 text-muted-foreground" />}
          />
          <ListRow
            to="/change-password"
            leading={<IconTile><KeyRound className="h-4 w-4" /></IconTile>}
            title="Change Password"
            trailing={<ChevronRight className="h-4 w-4 text-muted-foreground" />}
          />
          <ListRow
            to="/reports"
            leading={<IconTile><FileText className="h-4 w-4" /></IconTile>}
            title="Reports & Service History"
            trailing={<ChevronRight className="h-4 w-4 text-muted-foreground" />}
          />
        </ListGroup>

        <ListGroup className="mb-6">
          <ListRow
            to="/settings"
            leading={<IconTile><Settings className="h-4 w-4" /></IconTile>}
            title="Settings"
            trailing={<ChevronRight className="h-4 w-4 text-muted-foreground" />}
          />
          <ListRow
            to="/help"
            leading={<IconTile><HelpCircle className="h-4 w-4" /></IconTile>}
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
