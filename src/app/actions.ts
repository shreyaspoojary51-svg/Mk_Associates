"use server";
import { randomUUID, createHash } from "node:crypto";
import { headers } from "next/headers";
import { Resend } from "resend";
import { renderToBuffer } from "@react-pdf/renderer";
import ProposalDocument from "@/components/tools/ProposalDocument";
import { leadSchema, proposalSchema } from "@/lib/lead-schema";

export type LeadResult = {
  status: "sent" | "demo" | "partial" | "error";
  message: string;
  receiptId?: string;
};
export type ProposalResult = {
  ok: boolean;
  error?: string;
  data?: string;
  emailStatus?:
    | "sent"
    | "not-configured"
    | "not-requested"
    | "failed"
    | "verification-required"
    | "rate-limited";
};
const MAX_UPLOAD = 4 * 1024 * 1024;
// Best-effort per-instance protection. Use platform/WAF limits for multi-instance deployments.
const limits = new Map<string, { count: number; expires: number }>();
async function allowed(
  bucket: string,
  maximum = 6,
  duration = 10 * 60 * 1000,
  identity = "",
) {
  const h = await headers();
  const ip =
    h.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    h.get("x-real-ip") ||
    "unknown";
  const key = createHash("sha256")
    .update(`${bucket}:${ip}:${identity}`)
    .digest("hex");
  const now = Date.now();
  for (const [k, v] of limits) if (v.expires < now) limits.delete(k);
  const record = limits.get(key) || { count: 0, expires: now + duration };
  record.count++;
  limits.set(key, record);
  return record.count <= maximum;
}
async function verifyChallenge(
  token: string | undefined,
  action: "project_enquiry" | "proposal_email",
) {
  const secret = process.env.TURNSTILE_SECRET_KEY?.trim();
  const site = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY?.trim();
  if (!secret || !site || !token) return false;
  try {
    const origin = (await headers()).get("origin");
    if (!origin) return false;
    const response = await fetch(
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
      {
        method: "POST",
        body: new URLSearchParams({ secret, response: token }),
        signal: AbortSignal.timeout(10000),
      },
    );
    const check: unknown = response.ok ? await response.json() : null;
    return (
      !!check &&
      typeof check === "object" &&
      "success" in check &&
      check.success === true &&
      "action" in check &&
      check.action === action &&
      "hostname" in check &&
      check.hostname === new URL(origin).hostname
    );
  } catch {
    return false;
  }
}
function emailConfig() {
  const key = process.env.RESEND_API_KEY?.trim();
  const from = process.env.RESEND_FROM_EMAIL?.trim();
  return { key, from, enabled: !!(key && from), incomplete: !!key !== !!from };
}
function validFile(bytes: Buffer, mime: string) {
  if (mime === "application/pdf")
    return (
      bytes.subarray(0, 5).toString() === "%PDF-" &&
      bytes.subarray(-2048).toString("latin1").includes("%%EOF")
    );
  if (mime === "image/png")
    return bytes
      .subarray(0, 8)
      .equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]));
  if (mime === "image/jpeg")
    return (
      bytes[0] === 0xff &&
      bytes[1] === 0xd8 &&
      bytes[2] === 0xff &&
      bytes[bytes.length - 2] === 0xff &&
      bytes[bytes.length - 1] === 0xd9
    );
  if (mime === "image/webp")
    return (
      bytes.subarray(0, 4).toString() === "RIFF" &&
      bytes.subarray(8, 12).toString() === "WEBP"
    );
  return false;
}
export async function submitLead(formData: FormData): Promise<LeadResult> {
  try {
    if (!(await allowed("lead")))
      return {
        status: "error",
        message:
          "Too many requests. Please wait 10 minutes before trying again.",
      };
    const raw: Record<string, unknown> = {};
    for (const key of [
      "name",
      "email",
      "phone",
      "propertyType",
      "location",
      "area",
      "budget",
      "timeline",
      "message",
      "summary",
      "website",
      "verificationToken",
    ])
      raw[key] = formData.get(key);
    raw.consent = formData.get("consent") === "true";
    raw.area = Number(formData.get("area"));
    if (raw.website)
      return {
        status: "error",
        message: "This request could not be accepted.",
      };
    const parsed = leadSchema.safeParse(raw);
    if (!parsed.success)
      return {
        status: "error",
        message:
          parsed.error.issues[0]?.message || "Please check your details.",
      };
    const challengeSecret = process.env.TURNSTILE_SECRET_KEY?.trim();
    const challengeSite = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY?.trim();
    if (!!challengeSecret !== !!challengeSite)
      return {
        status: "error",
        message:
          "The anti-spam service is not fully configured. Please try again later.",
      };
    if (
      challengeSecret &&
      challengeSite &&
      !(await verifyChallenge(parsed.data.verificationToken, "project_enquiry"))
    )
      return {
        status: "error",
        message:
          "Verification expired or failed. Please reload the form and try again.",
      };
    const uploads = formData
      .getAll("files")
      .filter(
        (entry): entry is File => entry instanceof File && entry.size > 0,
      );
    if (
      uploads.length > 4 ||
      uploads.reduce((sum, file) => sum + file.size, 0) > MAX_UPLOAD
    )
      return {
        status: "error",
        message: "Upload up to 4 files, no more than 4 MB combined.",
      };
    const attachments: {
      filename: string;
      content: Buffer;
      contentType: string;
    }[] = [];
    for (const file of uploads) {
      if (file.size > MAX_UPLOAD)
        return {
          status: "error",
          message: "Each file must be 4 MB or smaller.",
        };
      const content = Buffer.from(await file.arrayBuffer());
      if (!validFile(content, file.type))
        return {
          status: "error",
          message:
            "Use a valid JPG, PNG, WebP or PDF. The file content must match its type.",
        };
      const ext = {
        "image/jpeg": "jpg",
        "image/png": "png",
        "image/webp": "webp",
        "application/pdf": "pdf",
      }[file.type];
      const stem =
        file.name
          .replace(/\.[^.]+$/, "")
          .replace(/[^a-zA-Z0-9_-]/g, "_")
          .slice(0, 60) || "reference";
      attachments.push({
        filename: `${stem}.${ext}`,
        content,
        contentType: file.type,
      });
    }
    const email = emailConfig();
    const to = process.env.LEAD_NOTIFICATION_EMAIL?.trim();
    const webhook = process.env.SHEETS_WEBHOOK_URL?.trim();
    const secret = process.env.SHEETS_WEBHOOK_SECRET?.trim();
    const anyConfig = !!(email.key || email.from || to || webhook || secret);
    const mailEnabled = email.enabled && !!to;
    const sheetsEnabled = !!(webhook && secret);
    if (
      ((email.key || email.from || to) && !mailEnabled) ||
      ((webhook || secret) && !sheetsEnabled)
    )
      return {
        status: "error",
        message:
          "The enquiry service is not fully configured. Please try again later.",
      };
    if (
      webhook &&
      (!webhook.startsWith("https://") ||
        new URL(webhook).username ||
        new URL(webhook).password)
    )
      return {
        status: "error",
        message: "The enquiry service is temporarily unavailable.",
      };
    const receiptId = randomUUID();
    if (!anyConfig)
      return {
        status: "demo",
        receiptId,
        message:
          "Demo receipt only. No enquiry, email or uploaded file was delivered or saved.",
      };
    const data = parsed.data;
    const {
      website: _website,
      verificationToken: _verificationToken,
      ...lead
    } = data;
    void _website;
    void _verificationToken;
    const text = `New project enquiry\nReceipt: ${receiptId}\nName: ${lead.name}\nEmail: ${lead.email}\nPhone: ${lead.phone}\nProject: ${lead.propertyType}\nLocality: ${lead.location}\nArea: ${lead.area} sq ft\nBudget: ${lead.budget}\nTiming: ${lead.timeline}\nNote: ${lead.message}\nPlanning summary: ${lead.summary}\nContact consent: yes`;
    const results: boolean[] = [];
    if (mailEnabled) {
      try {
        const result = await new Resend(email.key).emails.send(
          {
            from: email.from!,
            to: to!,
            replyTo: lead.email,
            subject: "New interior project enquiry",
            text,
            attachments,
          },
          { idempotencyKey: `lead-${receiptId}` },
        );
        results.push(!result.error && !!result.data?.id);
      } catch {
        results.push(false);
      }
    }
    if (sheetsEnabled) {
      try {
        let response = await fetch(webhook!, {
          method: "POST",
          redirect: "manual",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${secret}`,
          },
          body: JSON.stringify({
            webhookToken: secret,
            receiptId,
            submittedAt: new Date().toISOString(),
            ...lead,
            attachments: attachments.map((file) => ({
              filename: file.filename,
              contentType: file.contentType,
              base64: file.content.toString("base64"),
            })),
          }),
          signal: AbortSignal.timeout(15000),
        });
        // Apps Script ContentService uses a one-time Google-hosted GET redirect.
        // Never forward credentials or the POST body to a redirect destination.
        if (
          [302, 303].includes(response.status) &&
          new URL(webhook!).hostname === "script.google.com"
        ) {
          const location = response.headers.get("location");
          if (location) {
            const target = new URL(location);
            if (
              target.protocol === "https:" &&
              target.hostname.endsWith(".googleusercontent.com")
            )
              response = await fetch(target, {
                method: "GET",
                redirect: "error",
                signal: AbortSignal.timeout(15000),
              });
          }
        }
        // Receiver must return { ok: true } only after durable persistence.
        const acknowledgement: unknown = response.ok
          ? await response.json()
          : null;
        results.push(
          !!acknowledgement &&
            typeof acknowledgement === "object" &&
            "ok" in acknowledgement &&
            acknowledgement.ok === true,
        );
      } catch {
        results.push(false);
      }
    }
    if (results.every(Boolean))
      return {
        status: "sent",
        receiptId,
        message:
          "Your enquiry was accepted by the configured delivery service. This does not confirm a booking or response time.",
      };
    if (results.some(Boolean))
      return {
        status: "partial",
        receiptId,
        message:
          "Your enquiry reached one configured service, but another failed. Please keep this receipt; avoid resubmitting to prevent a duplicate.",
      };
    return {
      status: "error",
      message:
        "The delivery services did not confirm receipt. Your enquiry has not been confirmed; please try again later.",
    };
  } catch {
    return {
      status: "error",
      message: "We could not process this enquiry. Please try again later.",
    };
  }
}
export async function downloadProposal(
  input: unknown,
): Promise<ProposalResult> {
  try {
    if (!(await allowed("proposal")))
      return {
        ok: false,
        error: "Too many requests. Please wait 10 minutes and try again.",
      };
    const parsed = proposalSchema.safeParse(input);
    if (!parsed.success)
      return {
        ok: false,
        error: parsed.error.issues[0]?.message || "Please check your brief.",
      };
    const { estimate, brief, email: recipient } = parsed.data;
    const pdf = await renderToBuffer(ProposalDocument({ estimate, brief }));
    let emailStatus: ProposalResult["emailStatus"] = "not-requested";
    if (recipient) {
      const config = emailConfig();
      emailStatus = "not-configured";
      if (config.incomplete) emailStatus = "failed";
      if (config.enabled) {
        // No arbitrary-recipient email is allowed without genuine abuse verification,
        // even in development. Downloads remain available without sending mail.
        if (
          !(
            process.env.TURNSTILE_SECRET_KEY &&
            process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY
          ) ||
          !(await verifyChallenge(
            parsed.data.verificationToken,
            "proposal_email",
          ))
        )
          emailStatus = "verification-required";
        else if (
          !(await allowed("proposal-email-ip", 3, 60 * 60 * 1000)) ||
          !(await allowed(
            "proposal-email-recipient",
            3,
            60 * 60 * 1000,
            recipient.toLowerCase(),
          ))
        )
          emailStatus = "rate-limited";
        else {
          try {
            const result = await new Resend(config.key).emails.send({
              from: config.from!,
              to: recipient,
              subject: "Your MK Associates planning brief",
              text: "Your requested interior planning brief is attached. This is an indicative planning reference, not a quotation or confirmed booking.",
              attachments: [
                { filename: "mk-associates-planning-brief.pdf", content: pdf },
              ],
            });
            emailStatus = !result.error && result.data?.id ? "sent" : "failed";
          } catch {
            emailStatus = "failed";
          }
        }
      }
    }
    return { ok: true, data: pdf.toString("base64"), emailStatus };
  } catch (err) {
    console.error("PDF generation failed:", err);
    return {
      ok: false,
      error: "Your PDF could not be generated. Please try again.",
    };
  }
}
