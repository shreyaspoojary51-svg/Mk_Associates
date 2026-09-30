import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "MK Associates | Interior Architecture",
    short_name: "MK Associates",
    description:
      "Thoughtful interior architecture and design by Mahindra & Kunal in Mumbai.",
    start_url: "/",
    display: "standalone",
    background_color: "#1a1917",
    theme_color: "#1a1917",
    icons: [
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
      },
    ],
  };
}
