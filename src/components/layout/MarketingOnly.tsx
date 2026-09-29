"use client";
import { usePathname } from "next/navigation";
export default function MarketingOnly({
  children,
}: {
  children: React.ReactNode;
}) {
  return usePathname().startsWith("/admin") ? null : children;
}
