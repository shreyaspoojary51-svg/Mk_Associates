import React from "react";
import { NextRequest, NextResponse } from "next/server";
import { renderToBuffer } from "@react-pdf/renderer";
import ProposalDocument from "@/components/tools/ProposalDocument";
import { proposalSchema, type DesignBrief } from "@/lib/lead-schema";
import type { EstimateInput } from "@/lib/estimate";

// Static standard-font imports to guarantee Next.js NFT dependency tracing on Vercel Serverless
import "pdfkit/standard-fonts/Helvetica";
import "pdfkit/standard-fonts/HelveticaBold";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const parsed = proposalSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { ok: false, error: parsed.error.issues[0]?.message || "Invalid proposal request." },
        { status: 400 }
      );
    }

    const { estimate, brief } = parsed.data;
    const element = React.createElement(ProposalDocument, { estimate, brief });
    const pdf = await renderToBuffer(element as unknown as Parameters<typeof renderToBuffer>[0]);

    return new NextResponse(pdf as unknown as BodyInit, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": 'attachment; filename="mk-associates-planning-brief.pdf"',
        "Content-Length": String(pdf.length),
        "Cache-Control": "no-store, max-age=0",
      },
    });
  } catch (err) {
    const message = err instanceof Error ? `${err.name}: ${err.message}` : String(err);
    console.error("API proposal-pdf POST error:", err);
    return NextResponse.json(
      { ok: false, error: "Failed to generate planning brief PDF.", details: message },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const room = searchParams.get("room") as DesignBrief["room"] | null;
    const palette = searchParams.get("palette") as DesignBrief["palette"] | null;
    const material = searchParams.get("material") as DesignBrief["material"] | null;

    const area = searchParams.get("area") ? Number(searchParams.get("area")) : undefined;
    const tier = searchParams.get("tier") as EstimateInput["tier"] | null;
    const propertyType = searchParams.get("propertyType") as EstimateInput["propertyType"] | null;

    const brief: DesignBrief | undefined =
      room && palette && material ? { room, palette, material } : undefined;

    const estimate: EstimateInput | undefined =
      area && tier && propertyType
        ? {
            area,
            tier,
            propertyType,
            addons: (searchParams.getAll("addons") || []) as EstimateInput["addons"],
          }
        : undefined;

    const element = React.createElement(ProposalDocument, {
      estimate,
      brief: brief || { room: "Living room", palette: "Warm neutrals", material: "Natural oak" },
    });
    const pdf = await renderToBuffer(element as unknown as Parameters<typeof renderToBuffer>[0]);

    return new NextResponse(pdf as unknown as BodyInit, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": 'attachment; filename="mk-associates-planning-brief.pdf"',
        "Content-Length": String(pdf.length),
        "Cache-Control": "no-store, max-age=0",
      },
    });
  } catch (err) {
    const message = err instanceof Error ? `${err.name}: ${err.message}` : String(err);
    console.error("API proposal-pdf GET error:", err);
    return NextResponse.json(
      { ok: false, error: "Failed to generate planning brief PDF.", details: message },
      { status: 500 }
    );
  }
}
