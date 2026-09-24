import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import {
  Button,
  Field,
  NavBar,
  Screen,
  SelectField,
  StickyFooter,
  inputClass,
} from "@/components/ios";
import { PhotoPicker } from "@/components/client/widgets";
import { useApp } from "@/lib/app-state";
import type { RequestPriority } from "@/data/bluecrest";

export const Route = createFileRoute("/_tabs/request-new")({
  validateSearch: (s: Record<string, unknown>) => ({
    propertyId: typeof s.propertyId === "string" ? s.propertyId : undefined,
  }),
  head: () => ({ meta: [{ title: "New Service Request — Bluecrest Client" }] }),
  component: NewRequest,
});

function NewRequest() {
  const navigate = useNavigate();
  const search = Route.useSearch();
  const { addRequest, client, properties, amenities } = useApp();
  const [propertyId, setPropertyId] = useState(search.propertyId ?? properties[0]?.id ?? "");
  const [amenityId, setAmenityId] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<RequestPriority>("Standard");
  const [photos, setPhotos] = useState<string[]>([]);

  const amenityOpts = amenities.filter((a) => a.propertyId === propertyId);

  const submit = () => {
    if (!title.trim() || !description.trim()) {
      toast.error("Add a title and description.");
      return;
    }
    const number = String(1044 + Math.floor(Math.random() * 40));
    const id = `req-${number}`;
    addRequest({
      id,
      number,
      title: title.trim(),
      propertyId,
      amenityId: amenityId || undefined,
      description: description.trim(),
      priority,
      status: "Submitted",
      submitted: "Just now",
      submittedIso: new Date().toISOString().slice(0, 10),
      photos,
      comments: [
        {
          id: `c-${Date.now()}`,
          from: "me",
          sender: client.name,
          text: description.trim(),
          time: "Just now",
        },
      ],
      threadId: `request-${id}`,
    });
    toast.success("Request submitted");
    navigate({ to: "/request/$requestId", params: { requestId: id } });
  };

  return (
    <>
      <NavBar title="New Request" />
      <Screen className="pb-32">
        <div className="space-y-4">
          <SelectField
            label="Property"
            value={propertyId}
            onChange={(v) => {
              setPropertyId(v);
              setAmenityId("");
            }}
            options={properties.map((p) => ({ value: p.id, label: p.name }))}
          />
          <SelectField
            label="Amenity / area (optional)"
            value={amenityId}
            onChange={setAmenityId}
            options={[
              { value: "", label: "Entire property" },
              ...amenityOpts.map((a) => ({ value: a.id, label: a.name })),
            ]}
          />
          <Field label="Request title">
            <input
              className={inputClass}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="What do you need?"
            />
          </Field>
          <Field label="Description">
            <textarea
              className={`${inputClass} min-h-28 py-3`}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Share any timing, access notes, or guest-impact details…"
            />
          </Field>
          <SelectField
            label="Priority"
            value={priority}
            onChange={(v) => setPriority(v as RequestPriority)}
            options={[
              { value: "Standard", label: "Standard" },
              { value: "Urgent", label: "Urgent" },
            ]}
          />
          <Field label="Attach photos" hint="Gallery access is fine — these are your supporting photos.">
            <PhotoPicker
              photos={photos}
              onAdd={(src) => setPhotos((p) => [...p, src])}
              onRemove={(i) => setPhotos((p) => p.filter((_, idx) => idx !== i))}
            />
          </Field>
        </div>
      </Screen>
      <StickyFooter>
        <Button onClick={submit}>Submit</Button>
      </StickyFooter>
    </>
  );
}
