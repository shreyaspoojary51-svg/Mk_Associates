import type { MetadataRoute } from "next";
import {
  getProjects,
  getServices,
  getArticles,
  getLocalities,
} from "@/lib/sanity";
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const configured = process.env.NEXT_PUBLIC_SITE_URL;
  if (!configured || process.env.NEXT_PUBLIC_LAUNCH_READY !== "true") return [];
  let origin: string;
  try {
    const url = new URL(configured);
    if (
      url.protocol !== "https:" ||
      ["localhost", "127.0.0.1"].includes(url.hostname)
    )
      return [];
    origin = url.origin;
  } catch {
    return [];
  }
  const [projects, services, articles, localities] = await Promise.all([
    getProjects(),
    getServices(),
    getArticles(),
    getLocalities(),
  ]);
  const staticPaths = [
    "",
    "/work",
    "/services",
    "/studio",
    "/process",
    "/journal",
    "/locations",
    "/contact",
    "/configure",
    "/estimator",
    "/privacy",
    "/terms",
    "/accessibility",
  ];
  return [
    ...staticPaths.map((path) => ({
      url: `${origin}${path}`,
      changeFrequency: "monthly" as const,
      priority: path ? 0.7 : 1,
    })),
    ...projects.map((item) => ({
      url: `${origin}/work/${item.slug}`,
      priority: 0.8,
    })),
    ...services.map((item) => ({
      url: `${origin}/services/${item.slug}`,
      priority: 0.8,
    })),
    ...localities.map((item) => ({
      url: `${origin}/locations/${item.slug}`,
      priority: 0.7,
    })),
    ...articles.map((item) => ({
      url: `${origin}/journal/${item.slug}`,
      ...(item.date ? { lastModified: new Date(item.date) } : {}),
      priority: 0.6,
    })),
  ];
}
