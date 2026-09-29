import { timingSafeEqual } from "node:crypto";
import { revalidateTag, revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
export async function POST(request: Request) {
  const secret = process.env.SANITY_REVALIDATE_SECRET;
  if (!secret)
    return NextResponse.json(
      { error: "Revalidation is not configured." },
      { status: 503 },
    );
  const supplied =
    request.headers.get("authorization")?.replace(/^Bearer /, "") || "";
  const expected = Buffer.from(secret);
  const received = Buffer.from(supplied);
  if (
    expected.length !== received.length ||
    !timingSafeEqual(expected, received)
  )
    return NextResponse.json({ error: "Unauthorised." }, { status: 401 });
  revalidateTag("sanity");
  for (const path of [
    "/",
    "/work",
    "/services",
    "/journal",
    "/locations",
    "/sitemap.xml",
  ])
    revalidatePath(path);
  for (const path of [
    "/work/[slug]",
    "/services/[slug]",
    "/journal/[slug]",
    "/locations/[slug]",
  ])
    revalidatePath(path, "page");
  return NextResponse.json({ revalidated: true });
}
