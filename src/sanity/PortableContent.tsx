import Image from "next/image";
import { PortableText, type PortableTextComponents } from "@portabletext/react";
import type { EditorialBlock } from "@/lib/content";
export function headingText(value: { children?: unknown }): string {
  return Array.isArray(value.children)
    ? value.children
        .map((child) =>
          child &&
          typeof child === "object" &&
          "text" in child &&
          typeof child.text === "string"
            ? child.text
            : "",
        )
        .join("")
    : "";
}
export function headingId(value: { children?: unknown }): string {
  return `heading-${headingText(value)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")}`;
}
const safeHref = (href: unknown) =>
  typeof href === "string" &&
  (/^https?:\/\//.test(href) ||
    /^mailto:/.test(href) ||
    /^\/(?!\/)/.test(href) ||
    /^#/.test(href))
    ? href
    : undefined;
const components: PortableTextComponents = {
  block: {
    h1: ({ children, value }) => <h2 id={headingId(value)}>{children}</h2>,
    h2: ({ children, value }) => <h2 id={headingId(value)}>{children}</h2>,
    h3: ({ children, value }) => <h3 id={headingId(value)}>{children}</h3>,
  },
  marks: {
    link: ({ value, children }) => {
      const href = safeHref(value?.href);
      return href ? (
        <a
          href={href}
          rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
        >
          {children}
        </a>
      ) : (
        <>{children}</>
      );
    },
  },
  types: {
    image: ({ value }) => {
      if (
        typeof value.url !== "string" ||
        !/^https:\/\/cdn\.sanity\.io\/images\//.test(value.url) ||
        typeof value.alt !== "string" ||
        !value.alt.trim()
      )
        return null;
      return (
        <figure style={{ marginBlock: "2rem" }}>
          <Image
            src={`${value.url}?auto=format&w=1400&q=85`}
            alt={value.alt}
            width={1400}
            height={1000}
            sizes="(max-width: 800px) 100vw, 760px"
            style={{ width: "100%", height: "auto" }}
          />
        </figure>
      );
    },
  },
};
export default function PortableContent({
  value,
}: {
  value?: EditorialBlock[];
}) {
  if (!value?.length) return null;
  return (
    <div className="prose">
      <PortableText<EditorialBlock> value={value} components={components} />
    </div>
  );
}
