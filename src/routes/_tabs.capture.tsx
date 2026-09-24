import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { Badge, Button, Card, NavBar, Screen } from "@/components/ios";
import { MapCard } from "@/components/map-card";
import { photoTypes, sites } from "@/data/bluecrest";
import { useApp } from "@/lib/app-state";
import { AlertTriangle, Check, CheckCircle2, MapPin, X, Zap } from "lucide-react";

export const Route = createFileRoute("/_tabs/capture")({
  validateSearch: (s: Record<string, unknown>) => ({
    type: typeof s['type'] === "string" ? (s['type'] as string) : "opening-pool",
    slot: typeof s['slot'] === "string" ? (s['slot'] as string) : "type:opening-pool",
    siteId: typeof s['siteId'] === "string" ? (s['siteId'] as string) : "manhattan-park",
    label: typeof s['label'] === "string" ? (s['label'] as string) : "",
  }),
  head: () => ({
    meta: [
      { title: "Live Capture — Bluecrest Staff" },
      {
        name: "description",
        content: "Live camera capture with GPS and timestamp confirmation before submission.",
      },
      { property: "og:title", content: "Live Capture — Bluecrest Staff" },
      {
        property: "og:description",
        content: "Capture, verify location and submit a compliance photo.",
      },
    ],
  }),
  component: CaptureFlow,
});

type Step = "camera" | "confirm" | "review" | "done";

function CaptureFlow() {
  const { type, slot, siteId, label } = Route.useSearch();
  const router = useRouter();
  const { setCapture, addPhoto } = useApp();
  const site = sites.find((s) => s.id === siteId) ?? sites[0]!;
  const photoType = photoTypes.find((p) => p.id === type) ?? photoTypes[0]!;
  const heading = label || `${photoType.group} — ${photoType.label}`;

  const videoRef = useRef<HTMLVideoElement>(null);
  const [streamOk, setStreamOk] = useState<boolean | null>(null);
  const [step, setStep] = useState<Step>("camera");
  const [image, setImage] = useState("");
  const [gps, setGps] = useState<"locating" | "verified" | "outside">("locating");
  const [note, setNote] = useState("");
  const [caption, setCaption] = useState("");
  const timestamp = useRef(new Date());

  useEffect(() => {
    let stream: MediaStream | null = null;
    let cancelled = false;
    navigator.mediaDevices
      ?.getUserMedia({ video: { facingMode: { ideal: "environment" } }, audio: false })
      .then((s) => {
        if (cancelled) {
          s.getTracks().forEach((t) => t.stop());
          return;
        }
        stream = s;
        setStreamOk(true);
        if (videoRef.current) videoRef.current.srcObject = s;
      })
      .catch(() => setStreamOk(false));
    return () => {
      cancelled = true;
      stream?.getTracks().forEach((t) => t.stop());
    };
  }, [step]);

  useEffect(() => {
    const id = setTimeout(() => setGps("verified"), 1400);
    return () => clearTimeout(id);
  }, []);

  const capture = () => {
    timestamp.current = new Date();
    const canvas = document.createElement("canvas");
    const video = videoRef.current;
    canvas.width = 720;
    canvas.height = 960;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      if (video && streamOk && video.videoWidth) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      } else {
        const grad = ctx.createLinearGradient(0, 0, 0, canvas.height);
        grad.addColorStop(0, "#0258B8");
        grad.addColorStop(1, "#093370");
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = "rgba(255,255,255,0.9)";
        ctx.font = "600 40px sans-serif";
        ctx.textAlign = "center";
        ctx.fillText(photoType.label, canvas.width / 2, canvas.height / 2 - 20);
        ctx.font = "400 28px sans-serif";
        ctx.fillText(site.name, canvas.width / 2, canvas.height / 2 + 30);
      }
      ctx.fillStyle = "rgba(9,51,112,0.75)";
      ctx.fillRect(0, canvas.height - 90, canvas.width, 90);
      ctx.fillStyle = "#ffffff";
      ctx.font = "500 26px sans-serif";
      ctx.textAlign = "left";
      ctx.fillText(timestamp.current.toLocaleString(), 24, canvas.height - 50);
      ctx.font = "400 22px sans-serif";
      ctx.fillText(`${site.coords.lat.toFixed(4)}, ${site.coords.lng.toFixed(4)}`, 24, canvas.height - 20);
    }
    setImage(canvas.toDataURL("image/jpeg", 0.85));
    setStep("confirm");
  };

  const submit = () => {
    setCapture(slot, image);
    addPhoto({
      id: `p-${Date.now()}`,
      typeId: photoType.id,
      label: heading,
      siteId: site.id,
      dataUrl: image,
      timestamp: timestamp.current.toLocaleString(),
      coords: `${site.coords.lat.toFixed(4)}, ${site.coords.lng.toFixed(4)}`,
      address: site.address,
      verified: gps === "verified",
      approval: "pending",
      ...(caption ? { note: caption } : {}),
    });
    setStep("done");
    toast.success(`Photo submitted for ${photoType.label}`);
    setTimeout(() => router.history.back(), 1200);
  };

  if (step === "camera") {
    return (
      <div className="fixed inset-0 z-50 mx-auto flex max-w-[520px] flex-col bg-black">
        <div className="flex items-center justify-between px-4 pt-4 text-white">
          <button
            type="button"
            aria-label="Cancel"
            onClick={() => router.history.back()}
            className="flex h-11 w-11 items-center justify-center bg-white/15"
          >
            <X className="h-5 w-5" />
          </button>
          <span className="bg-white/15 px-3 py-1.5 text-[13px] font-semibold">
            {heading}
          </span>
          <button
            type="button"
            aria-label="Toggle flash"
            className="flex h-11 w-11 items-center justify-center bg-white/15"
          >
            <Zap className="h-5 w-5" />
          </button>
        </div>

        <div className="relative flex-1 overflow-hidden">
          <video ref={videoRef} autoPlay playsInline muted className="h-full w-full object-cover" />
          {streamOk === false && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-b from-[#0258B8] to-[#093370] px-8 text-center text-white">
              <p className="text-[17px] font-semibold">Camera preview unavailable</p>
              <p className="mt-2 text-[15px] text-white/75">
                Allow camera access to capture live verification photos. You can still continue for
                this demo capture.
              </p>
            </div>
          )}
          <div className="absolute top-3 left-1/2 -translate-x-1/2">
            <span
              className={
                gps === "verified"
                  ? " bg-success px-3 py-1.5 text-[12px] font-semibold text-white"
                  : " bg-white/20 px-3 py-1.5 text-[12px] font-semibold text-white"
              }
            >
              {gps === "verified" ? "Location Verified ✓" : "Locating..."}
            </span>
          </div>
        </div>

        <div className="flex items-center justify-center py-8">
          <button
            type="button"
            aria-label="Capture photo"
            onClick={capture}
            className="h-[70px] w-[70px] border-4 border-white bg-white/20 transition-transform duration-200 active:scale-90"
          />
        </div>
        <p className="pb-6 text-center text-[12px] text-white/60">
          Live capture only — gallery uploads are disabled
        </p>
      </div>
    );
  }

  if (step === "confirm") {
    const outside = gps === "outside";
    return (
      <div className="fixed inset-0 z-50 mx-auto flex max-w-[520px] flex-col bg-black">
        <img src={image} alt="Captured verification" className="min-h-0 flex-1 object-cover" />
        <div className="bg-card p-4 pb-6">
          <p className="text-[13px] font-semibold text-muted-foreground">{heading}</p>
          <p className="mt-1 text-[17px] font-semibold">{timestamp.current.toLocaleString()}</p>
          <p className="mt-1 flex items-center gap-1.5 text-[13px] text-muted-foreground">
            <MapPin className="h-4 w-4" />
            {site.coords.lat.toFixed(4)}, {site.coords.lng.toFixed(4)} · {site.address}
          </p>
          <div className="mt-2">
            {outside ? (
              <Badge tone="red">
                <AlertTriangle className="h-3.5 w-3.5" /> You appear to be outside the site radius
              </Badge>
            ) : (
              <Badge tone="green">
                <CheckCircle2 className="h-3.5 w-3.5" /> Verified at {site.name}
              </Badge>
            )}
          </div>
          {outside && (
            <textarea
              rows={2}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Required: explain where you are"
              className="mt-3 w-full border border-input bg-card p-3 text-[15px]"
            />
          )}
          <MapCard siteName={site.name} compact className="mt-3" />
          <div className="mt-4 flex gap-3">
            <Button variant="secondary" onClick={() => setStep("camera")}>
              Retake
            </Button>
            <Button
              disabled={outside && note.trim().length < 4}
              onClick={() => setStep("review")}
            >
              {outside ? "Submit Anyway" : "Use Photo"}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (step === "review") {
    return (
      <>
        <NavBar title="Review & Submit" back={false} />
        <Screen>
          <img src={image} alt="Captured verification" className="mb-4 w-full object-cover" />
          <Card className="mb-4">
            <dl className="space-y-2 text-[15px]">
              <Row label="Type" value={heading} />
              <Row label="Site" value={site.name} />
              <Row label="Timestamp" value={timestamp.current.toLocaleString()} />
              <Row
                label="GPS"
                value={`${site.coords.lat.toFixed(4)}, ${site.coords.lng.toFixed(4)}`}
              />
            </dl>
          </Card>
          <label className="block">
            <span className="mb-1.5 block text-[13px] font-semibold text-muted-foreground">
              Caption (optional)
            </span>
            <textarea
              rows={3}
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="Anything your supervisor should know?"
              className="w-full border border-input bg-card p-3.5 text-[17px]"
            />
          </label>
          <div className="mt-6 space-y-3">
            <Button onClick={submit}>Submit Photo</Button>
            <Button variant="ghost" onClick={() => setStep("camera")}>
              Retake Photo
            </Button>
          </div>
        </Screen>
      </>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-8 text-center">
      <div className="flex h-24 w-24 items-center justify-center bg-success-soft text-success duration-300 animate-in zoom-in">
        <Check className="h-12 w-12" strokeWidth={2.5} />
      </div>
      <h1 className="mt-6 text-title text-navy">Photo Submitted</h1>
      <p className="mt-2 text-[15px] text-muted-foreground">
        {heading} · sent for supervisor review
      </p>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="text-right font-medium">{value}</dd>
    </div>
  );
}
