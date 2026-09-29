import type { MetadataRoute } from "next";
export default function robots(): MetadataRoute.Robots {
  const ready = process.env.NEXT_PUBLIC_LAUNCH_READY === "true";
  const raw = process.env.NEXT_PUBLIC_SITE_URL;
  let origin: string | undefined;
  try {
    const url = new URL(raw || "");
    if (
      url.protocol === "https:" &&
      !["localhost", "127.0.0.1"].includes(url.hostname)
    )
      origin = url.origin;
  } catch {
    /* No unverifiable deployment URL is published. */
  }
  return {
    rules: {
      userAgent: "*",
      ...(ready && origin
        ? {
            allow: "/",
            disallow: ["/admin", "/api/", "/thank-you", "/contact/thank-you"],
          }
        : { disallow: "/" }),
    },
    ...(ready && origin ? { sitemap: `${origin}/sitemap.xml` } : {}),
  };
}
