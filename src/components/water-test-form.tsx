import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import {
  Button,
  Card,
  Field,
  SegmentedControl,
  StickyFooter,
  inputClass,
} from "@/components/ios";
import { ranges } from "@/data/bluecrest";
import { useApp } from "@/lib/app-state";
import { AlertTriangle, Camera, Minus, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const BODIES = [
  { value: "Main Pool", label: "Main Pool" },
  { value: "Spa", label: "Spa" },
  { value: "Kiddie Pool", label: "Kiddie Pool" },
] as const;

export type WaterBody = (typeof BODIES)[number]["value"];

function RangeBar({
  value,
  range,
}: {
  value: number;
  range: { min: number; max: number; scale: number[] };
}) {
  const [lo, hi] = [range.scale[0]!, range.scale[1]!];
  const pos = Math.min(100, Math.max(0, ((value - lo) / (hi - lo)) * 100));
  const left = ((range.min - lo) / (hi - lo)) * 100;
  const width = ((range.max - range.min) / (hi - lo)) * 100;
  const ok = value >= range.min && value <= range.max;
  return (
    <div className="mt-2">
      <div className="relative h-2.5 overflow-hidden bg-danger-soft">
        <span
          className="absolute inset-y-0 bg-success-soft"
          style={{ left: `${left}%`, width: `${width}%` }}
        />
        {Number.isFinite(value) && value > 0 && (
          <span
            className={cn(
              "absolute top-1/2 h-4 w-1.5 -translate-x-1/2 -translate-y-1/2",
              ok ? "bg-success" : "bg-danger",
            )}
            style={{ left: `${pos}%` }}
          />
        )}
      </div>
      <p className="mt-1 text-[12px] text-muted-foreground">
        Acceptable range {range.min}–{range.max}
      </p>
    </div>
  );
}

export function WaterTestFields({
  siteId,
  siteName,
  captureSlot = "water-test",
  onSubmitted,
  submitLabel = "Submit Water Test",
  alreadyDone = false,
}: {
  siteId: string;
  siteName: string;
  captureSlot?: string;
  onSubmitted?: () => void;
  submitLabel?: string;
  alreadyDone?: boolean;
}) {
  const navigate = useNavigate();
  const { addWaterTest, captures, clearCapture } = useApp();

  const [body, setBody] = useState<WaterBody>("Main Pool");
  const [chlorine, setChlorine] = useState("");
  const [ph, setPh] = useState("");
  const [temp, setTemp] = useState("");
  const [bathers, setBathers] = useState(0);
  const [corrective, setCorrective] = useState("");

  const cl = parseFloat(chlorine);
  const phv = parseFloat(ph);
  const tv = parseFloat(temp);

  const outOfRange =
    (chlorine !== "" && (cl < ranges.chlorine.min || cl > ranges.chlorine.max)) ||
    (ph !== "" && (phv < ranges.ph.min || phv > ranges.ph.max)) ||
    (temp !== "" && (tv < ranges.temp.min || tv > ranges.temp.max));

  const photo = captures[captureSlot];
  const complete =
    !alreadyDone &&
    chlorine !== "" &&
    ph !== "" &&
    temp !== "" &&
    !!photo &&
    (!outOfRange || corrective.trim().length > 4);

  const openCapture = () =>
    navigate({
      to: "/capture",
      search: {
        type: "water-verify",
        slot: captureSlot,
        siteId,
        label: `Water test — ${body}`,
      },
    });

  const submit = () => {
    addWaterTest({
      id: `wt-${Date.now()}`,
      siteId,
      body,
      time: new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit" }),
      date: "Today",
      chlorine: cl,
      ph: phv,
      temp: tv,
      bathers,
      status: outOfRange ? "flagged" : "ok",
      ...(outOfRange ? { correctiveAction: corrective } : {}),
    });
    clearCapture(captureSlot);
    toast.success("Water test submitted");
    onSubmitted?.();
  };

  return (
    <>
      <p className="mb-1.5 text-[13px] font-semibold text-muted-foreground">Body of Water</p>
      <SegmentedControl
        className="mb-5"
        value={body}
        onChange={(v) => {
          if (!alreadyDone) setBody(v);
        }}
        options={[...BODIES]}
      />

      <div className="space-y-5 pb-4">
        <div>
          <Field label="Free Chlorine / Sanitizer (ppm)">
            <input
              inputMode="decimal"
              className={inputClass}
              value={chlorine}
              onChange={(e) => setChlorine(e.target.value)}
              placeholder="2.0"
              disabled={alreadyDone}
            />
          </Field>
          <RangeBar value={cl} range={ranges.chlorine} />
        </div>

        <div>
          <Field label="pH">
            <input
              inputMode="decimal"
              className={inputClass}
              value={ph}
              onChange={(e) => setPh(e.target.value)}
              placeholder="7.4"
              disabled={alreadyDone}
            />
          </Field>
          <RangeBar value={phv} range={ranges.ph} />
        </div>

        <div>
          <Field label="Temperature (°F)">
            <input
              inputMode="decimal"
              className={inputClass}
              value={temp}
              onChange={(e) => setTemp(e.target.value)}
              placeholder="81"
              disabled={alreadyDone}
            />
          </Field>
          <RangeBar value={tv} range={ranges.temp} />
        </div>

        <div>
          <p className="mb-1.5 text-[13px] font-semibold text-muted-foreground">Bather Count</p>
          <div className="flex items-center gap-4">
            <button
              type="button"
              aria-label="Decrease bather count"
              disabled={alreadyDone}
              onClick={() => setBathers((b) => Math.max(0, b - 1))}
              className="flex h-11 w-11 items-center justify-center bg-muted text-navy disabled:opacity-40"
            >
              <Minus className="h-5 w-5" />
            </button>
            <span className="min-w-10 text-center text-[22px] font-semibold tabular-nums">
              {bathers}
            </span>
            <button
              type="button"
              aria-label="Increase bather count"
              disabled={alreadyDone}
              onClick={() => setBathers((b) => b + 1)}
              className="flex h-11 w-11 items-center justify-center bg-muted text-navy disabled:opacity-40"
            >
              <Plus className="h-5 w-5" />
            </button>
          </div>
        </div>

        {outOfRange && !alreadyDone && (
          <div className="duration-300 animate-in fade-in slide-in-from-top-2">
            <div className="mb-3 flex gap-2 bg-warning-soft p-3 text-warning">
              <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0" />
              <p className="text-[13px] leading-relaxed">
                A reading is outside the safe range. Please add a corrective action note before
                submitting.
              </p>
            </div>
            <Field label="Corrective Action (required)">
              <textarea
                rows={3}
                value={corrective}
                onChange={(e) => setCorrective(e.target.value)}
                placeholder="What did you do to correct it?"
                className="w-full border border-input bg-card p-3.5 text-[17px] outline-none focus:border-primary focus:ring-2 focus:ring-ring/25"
              />
            </Field>
          </div>
        )}

        <Card>
          <p className="text-[13px] font-semibold text-muted-foreground">
            Verification Photo (required)
          </p>
          {photo ? (
            <div className="mt-3 flex items-center gap-3">
              <img
                src={photo}
                alt={`Water test verification — ${siteName}`}
                className="h-16 w-16 object-cover"
              />
              {!alreadyDone && (
                <button
                  type="button"
                  onClick={openCapture}
                  className="min-h-11 text-[15px] font-semibold text-primary"
                >
                  Retake
                </button>
              )}
            </div>
          ) : (
            <button
              type="button"
              disabled={alreadyDone}
              onClick={openCapture}
              className="mt-3 flex min-h-12 w-full items-center justify-center gap-2 bg-accent text-[15px] font-semibold text-primary disabled:opacity-40"
            >
              <Camera className="h-4 w-4" /> Capture Verification Photo
            </button>
          )}
        </Card>
      </div>

      {!alreadyDone && (
        <StickyFooter>
          <Button disabled={!complete} onClick={submit}>
            {submitLabel}
          </Button>
        </StickyFooter>
      )}
    </>
  );
}
