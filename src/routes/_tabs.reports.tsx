import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Card, Field, NavBar, Screen, SectionHeader, SelectField, inputClass } from "@/components/ios";
import { DownloadButton } from "@/components/client/widgets";
import { properties } from "@/data/bluecrest";

export const Route = createFileRoute("/_tabs/reports")({
  head: () => ({ meta: [{ title: "Reports & Service History — Bluecrest Client" }] }),
  component: ReportsHub,
});

function ReportsHub() {
  return (
    <>
      <NavBar title="Reports & History" />
      <Screen>
        <p className="mb-5 text-[15px] text-muted-foreground">
          Export reports for the properties on your Related Property Group account.
        </p>
        <ExportCard
          title="Inspection Report"
          description="Checklist results, inspector notes, and verified photos."
          filename="Inspection Report"
        />
        <ExportCard
          title="Maintenance / Service History"
          description="Work orders, filter changes, and completed repairs."
          filename="Service History"
        />
        <ExportCard
          title="Property Activity History"
          description="A full timeline of inspections, issues, and requests."
          filename="Property Activity History"
        />
      </Screen>
    </>
  );
}

function ExportCard({
  title,
  description,
  filename,
}: {
  title: string;
  description: string;
  filename: string;
}) {
  const [propertyId, setPropertyId] = useState("all");
  const [from, setFrom] = useState("2026-05-08");
  const [to, setTo] = useState("2026-08-06");

  return (
    <Card className="mb-4">
      <SectionHeader>{title}</SectionHeader>
      <p className="-mt-2 mb-3 text-[13px] text-muted-foreground">{description}</p>
      <div className="space-y-3">
        <SelectField
          label="Property"
          value={propertyId}
          onChange={setPropertyId}
          options={[
            { value: "all", label: "All properties" },
            ...properties.map((p) => ({ value: p.id, label: p.name })),
          ]}
        />
        <div className="grid grid-cols-2 gap-3">
          <Field label="From">
            <input type="date" className={inputClass} value={from} onChange={(e) => setFrom(e.target.value)} />
          </Field>
          <Field label="To">
            <input type="date" className={inputClass} value={to} onChange={(e) => setTo(e.target.value)} />
          </Field>
        </div>
        <DownloadButton label={`${filename} ${from} to ${to}`} />
      </div>
    </Card>
  );
}
