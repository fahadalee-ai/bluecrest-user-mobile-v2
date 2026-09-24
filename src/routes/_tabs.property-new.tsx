import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import {
  Button,
  Field,
  NavBar,
  Screen,
  StickyFooter,
  inputClass,
} from "@/components/ios";
import { PhotoPicker } from "@/components/client/widgets";
import { useApp } from "@/lib/app-state";
import { cn } from "@/lib/utils";
import type { Amenity, AmenityType } from "@/data/bluecrest";
import fallbackPhoto from "@/assets/site-manhattan-park.jpg";

export const Route = createFileRoute("/_tabs/property-new")({
  head: () => ({ meta: [{ title: "New Property — Bluecrest Client" }] }),
  component: NewProperty,
});

const amenityOptions: AmenityType[] = ["Main Pool", "Spa", "Kiddie Pool", "Rooftop Pool"];

function slugify(value: string) {
  const base = value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  return `${base || "property"}-${Date.now().toString(36)}`;
}

function NewProperty() {
  const navigate = useNavigate();
  const { addProperty } = useApp();
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [notes, setNotes] = useState("");
  const [photos, setPhotos] = useState<string[]>([]);
  const [types, setTypes] = useState<AmenityType[]>(["Main Pool"]);

  const toggleType = (type: AmenityType) => {
    setTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type],
    );
  };

  const submit = () => {
    if (name.trim().length < 2) {
      toast.error("Add a property name.");
      return;
    }
    if (address.trim().length < 5) {
      toast.error("Add the full street address.");
      return;
    }
    if (types.length === 0) {
      toast.error("Select at least one amenity.");
      return;
    }

    const id = slugify(name);
    const photo = photos[0] ?? fallbackPhoto;
    const extras: Amenity[] = types.map((type, i) => ({
      id: `${id}-a${i + 1}`,
      propertyId: id,
      name: type,
      type,
      photo,
      waterStatus: "safe",
      lastTested: "",
      lastTestedLabel: "Not yet tested",
      readings: { chlorine: 0, ph: 7.4, temp: 80 },
      history: [],
    }));

    addProperty(
      {
        id,
        name: name.trim(),
        address: address.trim(),
        photo,
        compliance: "compliant",
        amenityIds: extras.map((a) => a.id),
        coords: { lat: 40.758, lng: -73.9855 },
        mapsQuery: address.trim(),
      },
      extras,
    );
    toast.success(notes.trim() ? "Property added — Bluecrest will confirm service." : "Property added");
    navigate({ to: "/property/$propertyId", params: { propertyId: id } });
  };

  return (
    <>
      <NavBar title="New Property" />
      <Screen className="pb-32">
        <p className="mb-5 text-[15px] leading-relaxed text-muted-foreground">
          Add a building you manage so Bluecrest can attach it to your service agreement.
        </p>
        <div className="space-y-4">
          <Field label="Property name">
            <input
              className={inputClass}
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Hudson Yards Pool Deck"
            />
          </Field>
          <Field label="Address">
            <input
              className={inputClass}
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Street, city, state, ZIP"
            />
          </Field>
          <Field label="Amenities on site">
            <div className="flex flex-wrap gap-2">
              {amenityOptions.map((type) => {
                const on = types.includes(type);
                return (
                  <button
                    key={type}
                    type="button"
                    onClick={() => toggleType(type)}
                    className={cn(
                      "min-h-11 px-3 text-[15px] font-semibold transition-colors duration-200",
                      on ? "bg-primary text-primary-foreground" : "bg-muted text-navy",
                    )}
                  >
                    {type}
                  </button>
                );
              })}
            </div>
          </Field>
          <Field label="Hero photo" hint="Optional — a gallery photo from your phone is fine.">
            <PhotoPicker
              photos={photos}
              onAdd={(src) => setPhotos([src])}
              onRemove={() => setPhotos([])}
            />
          </Field>
          <Field label="Notes for Bluecrest" hint="Optional access, hours, or staffing details.">
            <textarea
              className={`${inputClass} min-h-24 py-3`}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Gate code, loading dock, preferred inspection window…"
            />
          </Field>
        </div>
      </Screen>
      <StickyFooter>
        <Button onClick={submit}>Add Property</Button>
      </StickyFooter>
    </>
  );
}
