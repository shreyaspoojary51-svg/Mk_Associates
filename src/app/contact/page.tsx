import { Suspense } from "react";
import type { Metadata } from "next";
import ContactForm from "@/components/tools/ContactForm";
export const metadata: Metadata = {
  title: "Start Your Interior Project",
  description:
    "Share your interior project details, design direction and inspiration with MK Associates.",
};
export const runtime = "nodejs";
export default function ContactPage() {
  return (
    <Suspense
      fallback={
        <div className="section">
          <div className="container">
            <p role="status">Preparing your enquiry…</p>
          </div>
        </div>
      }
    >
      <ContactForm />
    </Suspense>
  );
}
