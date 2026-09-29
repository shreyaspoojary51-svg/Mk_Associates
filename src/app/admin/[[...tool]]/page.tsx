import type { Metadata } from "next";
import Studio from "./Studio";
import Link from "next/link";
export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Editorial admin",
  robots: { index: false, follow: false },
};
export default function AdminPage() {
  if (
    !process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ||
    !process.env.NEXT_PUBLIC_SANITY_DATASET
  )
    return (
      <div className="page-intro section">
        <div className="container prose">
          <p className="eyebrow">Editorial workspace</p>
          <h1 className="section-heading">The studio is not connected yet.</h1>
          <p>
            This public demo uses reviewed concept content. Configure the Sanity
            project and dataset to enable the editorial workspace. No
            credentials or private client information are included in this demo.
          </p>
          <p className="note">
            Required environment variables: NEXT_PUBLIC_SANITY_PROJECT_ID and
            NEXT_PUBLIC_SANITY_DATASET. Sanity manages editor sign-in and
            project permissions.
          </p>
          <Link href="/" className="button" style={{ marginTop: 24 }}>
            Return to the website ↗
          </Link>
        </div>
      </div>
    );
  return <Studio />;
}
