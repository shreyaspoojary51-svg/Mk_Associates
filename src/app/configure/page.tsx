import type { Metadata } from "next";
import Configurator from "@/components/tools/Configurator";
export const metadata: Metadata = {
  title: "Your Design Direction",
  description:
    "Explore room, palette and material combinations to create a personal interior planning brief.",
};
export const runtime = "nodejs";
export default async function ConfigurePage({
  searchParams,
}: {
  searchParams: Promise<{ palette?: string | string[] }>;
}) {
  const { palette } = await searchParams;
  const curated =
    palette === "earth" || palette === "stone" || palette === "calm"
      ? palette
      : undefined;
  return <Configurator curated={curated} />;
}
