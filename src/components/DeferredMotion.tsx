"use client";
import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
const MotionSystem = dynamic(() => import("./motion/MotionSystem"), {
  ssr: false,
  loading: () => null,
});
export default function DeferredMotion() {
  const pathname = usePathname();
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const timer = setTimeout(() => setReady(true), 1800);
    return () => clearTimeout(timer);
  }, []);
  return ready && !pathname.startsWith("/admin") ? <MotionSystem /> : null;
}
