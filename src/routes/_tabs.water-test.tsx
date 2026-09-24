import { createFileRoute, useRouter } from "@tanstack/react-router";
import { NavBar, Screen } from "@/components/ios";
import { WaterTestFields } from "@/components/water-test-form";
import { sites } from "@/data/bluecrest";

export const Route = createFileRoute("/_tabs/water-test")({
  validateSearch: (s: Record<string, unknown>) => ({
    siteId: typeof s["siteId"] === "string" ? (s["siteId"] as string) : "manhattan-park",
  }),
  head: () => ({
    meta: [
      { title: "Water Test — Bluecrest Staff" },
      {
        name: "description",
        content: "Log chlorine, pH, temperature and bather count with a live verification photo.",
      },
      { property: "og:title", content: "Water Test — Bluecrest Staff" },
      {
        property: "og:description",
        content: "Submit pool chemistry readings with photo verification.",
      },
    ],
  }),
  component: WaterTestPage,
});

function WaterTestPage() {
  const { siteId } = Route.useSearch();
  const router = useRouter();
  const site = sites.find((s) => s.id === siteId) ?? sites[0]!;

  return (
    <>
      <NavBar title={`Water Test — ${site.name}`} />
      <Screen>
        <WaterTestFields
          siteId={site.id}
          siteName={site.name}
          captureSlot="water-test"
          onSubmitted={() => router.history.back()}
        />
      </Screen>
    </>
  );
}
