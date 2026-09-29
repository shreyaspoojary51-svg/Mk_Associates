import "server-only";
import { createClient } from "@sanity/client";
import {
  projects,
  services,
  articles,
  localities,
  type Project,
  type Service,
  type Article,
  type Locality,
  type SiteConfig,
  type EditorialBlock,
} from "./content";

export const sanityConfigured = Boolean(
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID &&
  process.env.NEXT_PUBLIC_SANITY_DATASET,
);
const client = sanityConfigured
  ? createClient({
      projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
      dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
      apiVersion: "2026-09-01",
      useCdn: true,
      perspective: "published",
    })
  : null;
const demoAllowed =
  !sanityConfigured || process.env.NEXT_PUBLIC_LAUNCH_READY !== "true";
type Row = Record<string, unknown>;
const text = (value: unknown, fallback = ""): string =>
  typeof value === "string" && value.trim() ? value.trim() : fallback;
const strings = (value: unknown): string[] =>
  Array.isArray(value)
    ? value.filter((item): item is string => typeof item === "string")
    : [];
const validSlug = (value: unknown): value is string =>
  typeof value === "string" &&
  /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value) &&
  value.length <= 96;
const imageUrl = (value: unknown, fallback: string): string =>
  typeof value === "string" &&
  /^https:\/\/cdn\.sanity\.io\/images\//.test(value)
    ? `${value}?auto=format&w=1800&q=85`
    : fallback;
const blocks = (value: unknown): EditorialBlock[] | undefined =>
  Array.isArray(value)
    ? value.filter((item): item is EditorialBlock =>
        Boolean(
          item &&
          typeof item === "object" &&
          typeof item._type === "string" &&
          typeof item._key === "string" &&
          ["block", "image"].includes(item._type),
        ),
      )
    : undefined;
const published = '!(_id in path("drafts.**"))';
const projection =
  '{..., "slug": slug.current, "description": coalesce(description, desc), "image": image.asset->url, "alt": image.alt, "body": body[]{..., _type == "image" => {"url": asset->url, alt}}}';

/** Public published reads only. No write token, drafts or preview access in public pages. */
async function read(query: string): Promise<Row[]> {
  if (!client) return [];
  try {
    const result: unknown = await client.fetch(
      query,
      {},
      { next: { revalidate: 300, tags: ["sanity"] } },
    );
    return Array.isArray(result)
      ? result.filter((row): row is Row => !!row && typeof row === "object")
      : [];
  } catch {
    // A launched, configured CMS never silently resurrects the preview portfolio.
    if (!demoAllowed)
      throw new Error("Published content is temporarily unavailable.");
    return [];
  }
}
export async function getProjects(): Promise<Project[]> {
  const rows = (
    await read(
      `*[_type == "project" && ${published}] | order(order asc) ${projection}`,
    )
  ).filter((row) => validSlug(row.slug) && text(row.title));
  if (!rows.length) return demoAllowed ? projects : [];
  return rows.map((row, index) => {
    const fallback =
      projects.find((item) => item.slug === row.slug) ||
      projects[index % projects.length];
    const hasVerifiedMedia =
      typeof row.image === "string" &&
      /^https:\/\/cdn\.sanity\.io\/images\//.test(row.image) &&
      Boolean(text(row.alt));
    return {
      slug: row.slug as string,
      title: text(row.title),
      category: text(row.category, "Interior design"),
      locality: text(row.locality, "Mumbai"),
      area: text(row.area, "Area to be confirmed"),
      year: text(row.year, "Year to be confirmed"),
      description: text(row.description, "A considered interior design study."),
      image: imageUrl(row.image, fallback.image),
      alt: text(row.alt, fallback.alt),
      accent: /^#[a-fA-F0-9]{6}$/.test(text(row.accent))
        ? text(row.accent)
        : fallback.accent,
      investment: text(row.investment, "Investment available on enquiry"),
      story: text(row.story),
      concept: row.concept !== false || !hasVerifiedMedia,
      body: blocks(row.body),
    };
  });
}
export async function getServices(): Promise<Service[]> {
  const rows = (
    await read(
      `*[_type == "service" && ${published}] | order(order asc) ${projection}`,
    )
  ).filter((row) => validSlug(row.slug) && text(row.title));
  if (!rows.length) return demoAllowed ? services : [];
  return rows.map((row, index) => ({
    slug: row.slug as string,
    title: text(row.title),
    description: text(row.description),
    desc: text(row.description),
    price: text(row.price, "Scope-led proposal"),
    investment: text(row.price, "Scope-led proposal"),
    icon: text(row.icon, "◯"),
    number: String(index + 1).padStart(2, "0"),
    introduction: text(row.introduction, text(row.description)),
    includes: strings(row.includes).length
      ? strings(row.includes)
      : [
          "Brief and scope discussion",
          "Design direction review",
          "Written proposal before work begins",
        ],
    considerations: text(
      row.considerations,
      "Scope, fees and execution terms are confirmed in a written proposal.",
    ),
    image: imageUrl(row.image, services[index % services.length].image),
    alt: text(row.alt, "Illustrative interior design direction"),
    body: blocks(row.body),
  }));
}
export async function getArticles(): Promise<Article[]> {
  const rows = (
    await read(
      `*[_type == "article" && ${published}] | order(publishedAt desc) ${projection}`,
    )
  ).filter((row) => validSlug(row.slug) && text(row.title));
  if (!rows.length) return demoAllowed ? articles : [];
  return rows.map((row, index) => ({
    slug: row.slug as string,
    title: text(row.title),
    description: text(row.description),
    category: text(row.category, "Studio notes"),
    author: text(row.author, "MK Associates editorial"),
    readTime: text(row.readTime, "Journal note"),
    date:
      /^\d{4}-\d{2}-\d{2}/.test(text(row.publishedAt)) &&
      !Number.isNaN(Date.parse(text(row.publishedAt)))
        ? text(row.publishedAt).slice(0, 10)
        : "",
    image: imageUrl(row.image, articles[index % articles.length].image),
    alt: text(row.alt, "Editorial interior design image"),
    sections: [],
    relatedProjects: strings(row.relatedProjects),
    locality: text(row.locality),
    service: text(row.service),
    body: blocks(row.body),
  }));
}
export async function getLocalities(): Promise<Locality[]> {
  const rows = (
    await read(
      `*[_type == "locality" && ${published}] | order(name asc) ${projection}`,
    )
  ).filter((row) => validSlug(row.slug) && text(row.name));
  if (!rows.length) return demoAllowed ? localities : [];
  return rows.map((row, index) => ({
    slug: row.slug as string,
    name: text(row.name),
    title: text(row.title, text(row.name)),
    description: text(row.description),
    introduction: text(row.introduction, text(row.description)),
    priorities: Array.isArray(row.priorities)
      ? row.priorities
          .filter((item): item is Row => !!item && typeof item === "object")
          .map((item) => ({ title: text(item.title), text: text(item.text) }))
      : [],
    image: imageUrl(row.image, localities[index % localities.length].image),
    alt: text(row.alt, "Interior design concept"),
    body: blocks(row.body),
  }));
}
export async function getSiteConfig(): Promise<SiteConfig> {
  const [row] = await read(
    `*[_type == "siteConfig" && ${published}][0...1] ${projection}`,
  );
  const fallback: SiteConfig = {
    title: "MK Associates",
    description: demoAllowed
      ? "Thoughtful homes and workspaces in Mumbai."
      : "",
    founderNames: demoAllowed ? ["Mahindra", "Kunal"] : [],
  };
  if (!row) return fallback;
  return {
    title: text(row.title, fallback.title),
    description: text(row.description, fallback.description),
    email: text(row.email) || undefined,
    phone: text(row.phone) || undefined,
    address: text(row.address) || undefined,
    founderNames: strings(row.founderNames).length
      ? strings(row.founderNames)
      : fallback.founderNames,
    image: row.image ? imageUrl(row.image, "/images/hero.webp") : undefined,
    alt: text(row.alt) || undefined,
  };
}
