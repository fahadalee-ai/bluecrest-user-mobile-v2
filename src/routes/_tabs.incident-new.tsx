import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  Button,
  Card,
  Field,
  NavBar,
  Screen,
  SelectField,
  StickyFooter,
  inputClass,
} from "@/components/ios";
import { incidentTypes, sites, type IncidentSeverity } from "@/data/bluecrest";
import { useApp } from "@/lib/app-state";
import { AlertTriangle, Camera, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_tabs/incident-new")({
  head: () => ({
    meta: [
      { title: "Report an Incident — Bluecrest Staff" },
      {
        name: "description",
        content:
          "File an incident report with type, severity, description and live verification photos.",
      },
      { property: "og:title", content: "Report an Incident — Bluecrest Staff" },
      {
        property: "og:description",
        content: "File an incident report with severity and live verification photos.",
      },
    ],
  }),
  component: NewIncident,
});

const severities: IncidentSeverity[] = ["Low", "Medium", "High", "Critical"];

function NewIncident() {
  const navigate = useNavigate();
  const { activeSiteId, addIncident, captures, clearCapture } = useApp();
  const [type, setType] = useState(incidentTypes[0]!);
  const [siteId, setSiteId] = useState(activeSiteId);
  const [severity, setSeverity] = useState<IncidentSeverity>("Low");
  const [description, setDescription] = useState("");
  const [photos, setPhotos] = useState<string[]>([]);
  const [confirmCritical, setConfirmCritical] = useState(false);

  const captured = captures["incident:new"];
  useEffect(() => {
    if (!captured) return;
    setPhotos((prev) => [...prev, captured]);
    clearCapture("incident:new");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [captured]);

  const highSeverity = severity === "High" || severity === "Critical";
  const valid = description.trim().length >= 20;

  const submit = () => {
    if (highSeverity && !confirmCritical) {
      setConfirmCritical(true);
      return;
    }
    addIncident({
      id: `i-${Date.now()}`,
      type,
      title: description.trim().split(/[.\n]/)[0]!.slice(0, 60) || type,
      siteId,
      description: description.trim(),
      severity,
      date: new Date().toLocaleString([], {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit",
      }),
      status: "Open",
      photos,
      timeline: [
        {
          label: "Submitted",
          time: new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit" }),
        },
      ],
    });
    toast.success(
      highSeverity ? "Incident submitted — supervisor alerted immediately" : "Incident submitted",
    );
    navigate({ to: "/incidents" });
  };

  return (
    <>
      <NavBar title="Report Incident" />
      <Screen>
        <div className="space-y-4">
          <SelectField
            label="Incident Type"
            value={type}
            onChange={setType}
            options={incidentTypes.map((t) => ({ value: t, label: t }))}
          />

          <SelectField
            label="Site"
            value={siteId}
            onChange={setSiteId}
            options={sites.map((s) => ({ value: s.id, label: s.name }))}
          />

          <Field label="Severity">
            <div className="grid grid-cols-4 gap-2">
              {severities.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => {
                    setSeverity(s);
                    setConfirmCritical(false);
                  }}
                  className={cn(
                    "min-h-11 border text-[15px] font-semibold transition-colors duration-200",
                    severity === s
                      ? s === "Critical" || s === "High"
                        ? "border-danger bg-danger text-primary-foreground"
                        : s === "Medium"
                          ? "border-warning bg-warning-soft text-warning"
                          : "border-primary bg-primary text-primary-foreground"
                      : "border-border bg-card text-muted-foreground",
                  )}
                >
                  {s}
                </button>
              ))}
            </div>
          </Field>

          {highSeverity && (
            <Card className="flex gap-3 border-danger/40 bg-danger-soft">
              <AlertTriangle className="h-5 w-5 shrink-0 text-danger" />
              <p className="text-[13px] leading-relaxed text-danger">
                High and Critical reports alert your supervisor and the Bluecrest office
                immediately. If anyone is in danger, call 911 first.
              </p>
            </Card>
          )}

          <Field
            label="What happened?"
            hint="Minimum 20 characters — include time, people involved and action taken"
          >
            <textarea
              rows={6}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the incident in detail..."
              className={cn(inputClass, "h-auto resize-none py-3")}
            />
          </Field>

          <Field label="Photos" hint="Live camera only — gallery uploads are not accepted">
            <div className="grid grid-cols-3 gap-2">
              {photos.map((p, idx) => (
                <img
                  key={idx}
                  src={p}
                  alt={`Incident photo ${idx + 1}`}
                  className="aspect-square w-full object-cover"
                />
              ))}
              <button
                type="button"
                onClick={() =>
                  navigate({
                    to: "/capture",
                    search: {
                      type: "incident",
                      slot: "incident:new",
                      siteId,
                      label: "Incident photo",
                    },
                  })
                }
                className="flex aspect-square w-full flex-col items-center justify-center gap-1 border-2 border-dashed border-border text-muted-foreground active:bg-muted"
              >
                <span className="relative">
                  <Camera className="h-6 w-6" />
                  <Plus className="absolute -top-1 -right-2 h-3 w-3" />
                </span>
                <span className="text-[12px] font-medium">Capture</span>
              </button>
            </div>
          </Field>
        </div>
      </Screen>

      <StickyFooter>
        <Button
          variant={highSeverity ? "danger" : "primary"}
          disabled={!valid}
          onClick={submit}
        >
          {highSeverity && confirmCritical ? "Confirm & Alert Supervisor" : "Submit Report"}
        </Button>
      </StickyFooter>
    </>
  );
}
