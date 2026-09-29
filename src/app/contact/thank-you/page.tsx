import { redirect } from "next/navigation";
export default async function LegacyEnquiryReceipt({
  searchParams,
}: {
  searchParams: Promise<{ demo?: string; receipt?: string }>;
}) {
  const params = await searchParams;
  const query = new URLSearchParams({ demo: params.demo === "1" ? "1" : "0" });
  if (params.receipt && /^[a-f0-9-]{36}$/.test(params.receipt))
    query.set("receipt", params.receipt);
  redirect(`/thank-you?${query.toString()}`);
}
