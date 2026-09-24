import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Card, ListGroup, ListRow, NavBar, Screen, SectionHeader } from "@/components/ios";
import { brand, faqs, supervisor } from "@/data/bluecrest";
import { ChevronDown, Mail, MessageCircle, Phone } from "lucide-react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_tabs/help")({
  head: () => ({
    meta: [
      { title: "Help & Support — Bluecrest Staff" },
      {
        name: "description",
        content: "Answers to common lifeguard app questions plus direct lines to your supervisor and the Bluecrest office.",
      },
      { property: "og:title", content: "Help & Support — Bluecrest Staff" },
      {
        property: "og:description",
        content: "FAQs and direct contacts for supervisor and office support.",
      },
    ],
  }),
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

        <SectionHeader>Contact</SectionHeader>
        <ListGroup>
          <ListRow
            to="/thread/$threadId"
            params={{ threadId: "dana" }}
            leading={
              <span className="flex h-8 w-8 items-center justify-center bg-accent text-primary">
                <MessageCircle className="h-4 w-4" />
              </span>
            }
            title={`Message ${supervisor.name}`}
            subtitle={supervisor.role}
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
                title="Email Support"
                subtitle={brand.email}
              />
            </a>
          </ListGroup>
        </div>

        <p className="mt-6 text-center text-[12px] text-muted-foreground">
          {brand.company} · {brand.website} · v{brand.version}
        </p>
      </Screen>
    </>
  );
}
