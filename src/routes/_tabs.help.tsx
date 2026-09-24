import { BrandLogoMark } from "@/components/auth/AuthShell";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Card, ListGroup, ListRow, NavBar, Screen, SectionHeader } from "@/components/ios";
import { brand, faqs, representative } from "@/data/bluecrest";
import { ChevronDown, Mail, MessageCircle, Phone } from "lucide-react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_tabs/help")({
  head: () => ({ meta: [{ title: "Help & Support — Bluecrest Client" }] }),
  component: Help,
});

function Help() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <>
      <NavBar title="Help & Support" />
      <Screen>
        <SectionHeader>Frequently Asked</SectionHeader>
        <div className="space-y-2">
          {faqs.map((f, idx) => (
            <Card key={f.q} className="p-0">
              <button
                type="button"
                onClick={() => setOpen(open === idx ? null : idx)}
                aria-expanded={open === idx}
                className="flex min-h-[52px] w-full items-center gap-3 px-4 py-3 text-left"
              >
                <span className="flex-1 text-[15px] font-semibold text-navy">{f.q}</span>
                <ChevronDown
                  className={cn(
                    "h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200",
                    open === idx && "rotate-180",
                  )}
                />
              </button>
              {open === idx && (
                <p className="border-t border-border/70 px-4 py-3 text-[15px] leading-relaxed text-muted-foreground">
                  {f.a}
                </p>
              )}
            </Card>
          ))}
        </div>

        <SectionHeader>Contact Bluecrest</SectionHeader>
        <ListGroup>
          <ListRow
            to="/thread/$threadId"
            params={{ threadId: "dana" }}
            leading={
              <span className="flex h-8 w-8 items-center justify-center bg-accent text-primary">
                <MessageCircle className="h-4 w-4" />
              </span>
            }
            title={`Message ${representative.name}`}
            subtitle={representative.title}
          />
        </ListGroup>

        <div className="mt-2">
          <ListGroup>
            <a href={`tel:${brand.phone.replace(/[^\d+]/g, "")}`} className="block">
              <ListRow
                leading={
                  <span className="flex h-8 w-8 items-center justify-center bg-accent text-primary">
                    <Phone className="h-4 w-4" />
                  </span>
                }
                title="Call Bluecrest Office"
                subtitle={brand.phone}
              />
            </a>
            <a href={`mailto:${brand.email}`} className="block">
              <ListRow
                leading={
                  <span className="flex h-8 w-8 items-center justify-center bg-accent text-primary">
                    <Mail className="h-4 w-4" />
                  </span>
                }
                title="Email Client Services"
                subtitle={brand.email}
              />
            </a>
          </ListGroup>
        </div>

        <div className="mt-8 flex flex-col items-center gap-3">
          <BrandLogoMark width={168} variant="color" />
          <p className="text-center text-[12px] text-muted-foreground">
            {brand.company} · {brand.address}
          </p>
        </div>
      </Screen>
    </>
  );
}
