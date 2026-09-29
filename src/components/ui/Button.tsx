import Link from "next/link";
import { cva } from "class-variance-authority";
import { clsx } from "clsx";
const button = cva("button", {
  variants: {
    tone: { ink: "", outline: "button-outline", light: "button-light" },
    size: { normal: "", small: "button-small" },
  },
  defaultVariants: { tone: "ink", size: "normal" },
});
export default function Button({
  href,
  children,
  tone = "ink",
  className,
}: {
  href: string;
  children: React.ReactNode;
  tone?: "ink" | "outline" | "light";
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={clsx(button({ tone }), className)}
      data-cursor="EXPLORE"
    >
      {children}
      <span aria-hidden="true">↗</span>
    </Link>
  );
}
