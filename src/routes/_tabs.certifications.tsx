import { createFileRoute } from "@tanstack/react-router";
import { useRef } from "react";
import { toast } from "sonner";
import { Badge, Button, Card, NavBar, Screen } from "@/components/ios";
import { certifications } from "@/data/bluecrest";
import { FileText, Upload } from "lucide-react";

export const Route = createFileRoute("/_tabs/certifications")({
  head: () => ({
    meta: [
      { title: "Certifications — Bluecrest Staff" },
      {
        name: "description",
        content: "Your lifeguard certifications and documents with expiry tracking and renewals.",
      },
      { property: "og:title", content: "Certifications — Bluecrest Staff" },
      {
        property: "og:description",
        content: "Lifeguard certifications and documents with expiry tracking.",
      },
    ],
  }),
  component: Certs,
});

function Certs() {
  const fileRef = useRef<HTMLInputElement>(null);

  return (
    <>
      <NavBar title="Certifications" />
      <Screen>
        <div className="space-y-3">
          {certifications.map((c) => (
            <Card key={c.id} className="flex gap-3">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center bg-accent text-primary">
                <FileText className="h-5 w-5" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-[17px] leading-tight font-semibold text-navy">{c.name}</p>
                <p className="mt-0.5 text-[13px] text-muted-foreground">{c.issuer}</p>
                <p className="text-[13px] text-muted-foreground">
                  Issued {c.issued} · Expires {c.expires}
                </p>
                <div className="mt-2 flex items-center gap-2">
                  <Badge
                    tone={c.status === "valid" ? "green" : c.status === "expiring" ? "amber" : "red"}
                  >
                    {c.status === "valid"
                      ? "Valid"
                      : c.status === "expiring"
                        ? "Expiring soon"
                        : "Expired"}
                  </Badge>
                  <button
                    type="button"
                    onClick={() => toast.info("Opening document viewer")}
                    className="min-h-11 text-[15px] font-semibold text-primary"
                  >
                    View
                  </button>
                </div>
              </div>
            </Card>
          ))}
        </div>

        <div className="mt-6">
          <Button variant="secondary" onClick={() => fileRef.current?.click()}>
            <Upload className="h-4 w-4" /> Upload New Document
          </Button>
          <input
            ref={fileRef}
            type="file"
            accept="image/*,application/pdf"
            className="hidden"
            onChange={(e) => e.target.files?.[0] && toast.success("Document uploaded for review")}
          />
          <p className="mt-2 text-center text-[12px] text-muted-foreground">
            Renewal documents may be uploaded from your device.
          </p>
        </div>
      </Screen>
    </>
  );
}
