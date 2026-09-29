"use client";
import { useEffect, useRef, useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { useForm, type FieldPath } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  leadSchema,
  briefSchema,
  estimateInputSchema,
  type LeadValues,
} from "@/lib/lead-schema";
import {
  TIERS,
  ADDONS,
  calculateEstimate,
  formatINR,
  whatsappLink,
} from "@/lib/estimate";
import { submitLead, type LeadResult } from "@/app/actions";
import s from "./tools.module.css";
import { readSessionJSON, boundedText } from "./session";
import AntiSpam from "./AntiSpam";
const stepLabels = ["You", "Project", "Details", "Review"];
const stepFields: FieldPath<LeadValues>[][] = [
  ["name", "email", "phone"],
  ["propertyType", "location", "area", "budget"],
  ["timeline", "message"],
  ["consent"],
];
export default function ContactForm() {
  const router = useRouter();
  const query = useSearchParams();
  const [step, setStep] = useState(0);
  const [files, setFiles] = useState<File[]>([]);
  const [fileError, setFileError] = useState("");
  const [verificationRevision, setVerificationRevision] = useState(0);
  const [result, setResult] = useState<LeadResult>();
  const [pending, startTransition] = useTransition();
  const titleRef = useRef<HTMLHeadingElement>(null);
  const uploadRef = useRef<HTMLInputElement>(null);
  const {
    register,
    trigger,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<LeadValues>({
    resolver: zodResolver(leadSchema),
    mode: "onChange",
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      propertyType: "Apartment",
      location: "",
      area: 1000,
      budget: "Still exploring",
      timeline: "Just exploring",
      message: "",
      summary: "",
      consent: false,
      website: "",
      verificationToken: "",
    },
  });
  useEffect(() => {
    const intent = query.get("intent");
    if (
      boundedText(intent) &&
      [
        "I’m planning a 2 / 3 BHK home",
        "I’d like to arrange a site visit",
        "Can we review my floor plan?",
      ].includes(intent)
    )
      setValue("message", intent);
    const fromQuery = query.get("summary");
    if (boundedText(fromQuery) && fromQuery) {
      setValue("summary", fromQuery.slice(0, 2000));
      return;
    }
    try {
      const brief = briefSchema.safeParse(readSessionJSON("mk-design-brief"));
      const estimate = estimateInputSchema.safeParse(
        readSessionJSON("mk-estimate"),
      );
      const parts: string[] = [];
      if (brief.success)
        parts.push(
          `Design direction: ${brief.data.room} / ${brief.data.palette} / ${brief.data.material}`,
        );
      if (estimate.success) {
        const e = estimate.data,
          r = calculateEstimate(e);
        setValue("area", e.area);
        setValue("propertyType", e.propertyType);
        parts.push(
          `Planning estimate: ${e.area} sq ft / ${TIERS[e.tier].label} / ${formatINR(r.low)}–${formatINR(r.high)}. Add-ons: ${e.addons.map((a) => ADDONS[a].label).join(", ") || "None"}. Indicative; excluding taxes.`,
        );
      }
      setValue("summary", parts.join("\n").slice(0, 2000));
    } catch {}
  }, [query, setValue]);
  const values = watch();
  const whatsapp = whatsappLink(
    "Hello MK Associates, I would like to discuss an interior project.",
  );
  function go(target: number) {
    setStep(target);
    window.setTimeout(() => titleRef.current?.focus(), 0);
  }
  async function next() {
    if ((await trigger(stepFields[step], { shouldFocus: true })) && !fileError)
      go(Math.min(3, step + 1));
  }
  function selectFiles(list: FileList | null) {
    const chosen = Array.from(list || []);
    if (
      chosen.length > 4 ||
      chosen.some((f) => f.size > 4 * 1024 * 1024) ||
      chosen.reduce((sum, f) => sum + f.size, 0) > 4 * 1024 * 1024
    ) {
      setFileError(
        "Choose up to 4 files with a combined size of 4 MB or less.",
      );
      setFiles([]);
      return;
    }
    if (
      chosen.some(
        (f) =>
          ![
            "image/jpeg",
            "image/png",
            "image/webp",
            "application/pdf",
          ].includes(f.type),
      )
    ) {
      setFileError("Please use JPG, PNG, WebP or PDF files only.");
      setFiles([]);
      return;
    }
    setFileError("");
    setFiles(chosen);
  }
  const onSubmit = handleSubmit(
    (data) => {
      if (step !== 3 || pending || fileError || result?.status === "partial")
        return;
      if (
        process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY &&
        !data.verificationToken
      ) {
        setResult({
          status: "error",
          message: "Please complete the anti-spam verification before sending.",
        });
        return;
      }
      setResult(undefined);
      startTransition(async () => {
        try {
          const formData = new FormData();
          Object.entries(data).forEach(([key, value]) =>
            formData.set(key, String(value)),
          );
          files.forEach((file) => formData.append("files", file));
          const response = await submitLead(formData);
          setResult(response);
          setVerificationRevision((v) => v + 1);
          if (response.status === "sent" || response.status === "demo") {
            setFiles([]);
            router.push(
              `/thank-you?demo=${response.status === "demo" ? "1" : "0"}&receipt=${encodeURIComponent(response.receiptId || "")}`,
            );
          }
        } catch {
          setResult({
            status: "error",
            message:
              "We could not confirm your enquiry. Please try again later.",
          });
        }
      });
    },
    (invalid) => {
      const invalidStep = stepFields.findIndex((fields) =>
        fields.some((field) => invalid[field]),
      );
      if (invalidStep >= 0) go(invalidStep);
    },
  );
  const input = (
    name: "name" | "email" | "phone" | "location",
    label: string,
    type = "text",
    autoComplete?: string,
  ) => (
    <div className={`field ${s.field}`} key={name} style={{ marginBottom: 0 }}>
      <label htmlFor={`contact-${name}`}>{label}</label>
      <input
        id={`contact-${name}`}
        type={type}
        autoComplete={autoComplete}
        {...register(name)}
        aria-invalid={!!errors[name]}
        aria-describedby={`${name}-error`}
        maxLength={
          name === "email"
            ? 254
            : name === "phone"
              ? 24
              : name === "location"
                ? 120
                : 100
        }
      />
      <span
        id={`${name}-error`}
        className={`form-error ${s.error}`}
        style={{ minHeight: 20, marginTop: 0 }}
        aria-live="polite"
      >
        {errors[name]?.message}
      </span>
    </div>
  );
  return (
    <div className={s.shell}>
      <div className="container">
        <header className={`page-intro ${s.intro}`}>
          <span className={`eyebrow ${s.overline}`}>
            Start a conversation / 03
          </span>
          <h1 className="display">
            Tell us what
            <br />
            home means to you.
          </h1>
          <p className="body-large">
            A few thoughtful details are all we need to begin. Share your
            project, your hopes, and the way you want to live.
          </p>
        </header>
        <div className={s.formGrid}>
          <aside className={s.formAside}>
            <span className={s.overline}>The first step is a conversation</span>
            <h2>
              Good design begins
              <br />
              with listening.
            </h2>
            <p>
              This form helps frame your project before a consultation. It is
              not a booking, a quotation or a promise of availability.
            </p>
            <p>
              We only use your details to respond to this enquiry and plan the
              project you describe. No marketing subscription is included.
            </p>
            {whatsapp && (
              <a
                className={`button-outline ${s.secondary}`}
                href={whatsapp}
                target="_blank"
                rel="noopener noreferrer"
              >
                Prefer WhatsApp? ↗
              </a>
            )}
            <Image
              src="/images/project-2.webp"
              width={800}
              height={600}
              sizes="(max-width: 740px) 1px, 35vw"
              alt="A considered interior detail"
              className={s.asidePhoto}
            />
            <p className={s.note}>
              Reference files are optional. Please do not upload identity
              documents, financial information or anything you do not have
              permission to share.
            </p>
          </aside>
          <section
            className={`tool-panel ${s.panel}`}
            aria-labelledby="contact-step-title"
          >
            <ol className={`stepper ${s.steps}`} aria-label="Enquiry progress">
              {stepLabels.map((label, i) => (
                <li
                  key={label}
                  aria-current={i === step ? "step" : undefined}
                  data-complete={i < step}
                >
                  <span className={s.stepNumber}>{i < step ? "✓" : i + 1}</span>
                  <span>{label}</span>
                </li>
              ))}
            </ol>
            <span className={s.overline}>Step {step + 1} of 4</span>
            <h2 id="contact-step-title" tabIndex={-1} ref={titleRef}>
              {
                [
                  "First, a little about you.",
                  "A sense of your space.",
                  "The details that matter.",
                  "A considered beginning.",
                ][step]
              }
            </h2>
            <form
              onSubmit={(e) => {
                if (step < 3) {
                  e.preventDefault();
                  void next();
                } else void onSubmit(e);
              }}
              noValidate
            >
              <div className={s.honeypot} aria-hidden="true">
                <label>
                  Leave this empty
                  <input
                    tabIndex={-1}
                    autoComplete="off"
                    {...register("website")}
                  />
                </label>
              </div>
              <input type="hidden" {...register("summary")} />
              <input type="hidden" {...register("verificationToken")} />
              {step === 0 && (
                <div className={s.stack}>
                  {input("name", "Your name", "text", "name")}
                  {input("email", "Email address", "email", "email")}
                  {input("phone", "Phone number", "tel", "tel")}
                  <p className={`note ${s.note}`}>
                    Include your country code if you are outside India. All
                    fields on this step are required.
                  </p>
                </div>
              )}
              {step === 1 && (
                <div className={s.stack}>
                  <label className={`field ${s.field}`}>
                    Property type
                    <select {...register("propertyType")}>
                      {[
                        "2 BHK",
                        "3 BHK",
                        "4 BHK / Penthouse",
                        "Boutique commercial",
                        "Apartment",
                        "Independent home",
                        "Office",
                      ].map((item) => (
                        <option key={item}>{item}</option>
                      ))}
                    </select>
                    {errors.propertyType && (
                      <span className={s.error}>
                        {errors.propertyType.message}
                      </span>
                    )}
                  </label>
                  {input("location", "Project locality / city", "text")}
                  <div className={s.fields}>
                    <label className={`field ${s.field}`}>
                      Carpet area (sq ft)
                      <input
                        type="number"
                        inputMode="decimal"
                        min={150}
                        max={25000}
                        step="0.01"
                        {...register("area", { valueAsNumber: true })}
                        aria-invalid={!!errors.area}
                        aria-describedby="area-form-error"
                      />
                      <span id="area-form-error" className={s.error}>
                        {errors.area?.message}
                      </span>
                    </label>
                    <label className={`field ${s.field}`}>
                      Planning budget
                      <select {...register("budget")}>
                        {[
                          "Under ₹25 lakh",
                          "₹25–50 lakh",
                          "₹50 lakh–₹1 crore",
                          "₹1 crore+",
                          "Still exploring",
                        ].map((item) => (
                          <option key={item}>{item}</option>
                        ))}
                      </select>
                      {errors.budget && (
                        <span className={s.error}>{errors.budget.message}</span>
                      )}
                    </label>
                  </div>
                  <p className={s.note}>
                    An approximate carpet area is fine. Your budget is a
                    planning preference, not an agreed project cost.
                  </p>
                </div>
              )}
              {step === 2 && (
                <div className={s.stack}>
                  <label className={`field ${s.field}`}>
                    When would you like to begin?
                    <select {...register("timeline")}>
                      {[
                        "As soon as practical",
                        "Within 3 months",
                        "3–6 months",
                        "Just exploring",
                      ].map((item) => (
                        <option key={item}>{item}</option>
                      ))}
                    </select>
                    {errors.timeline && (
                      <span className={s.error}>{errors.timeline.message}</span>
                    )}
                  </label>
                  <label className={`field ${s.field}`}>
                    What should we know? (optional)
                    <textarea
                      {...register("message")}
                      maxLength={3000}
                      placeholder="Your wish list, what works, what doesn't, and anything you would love us to consider."
                      aria-invalid={!!errors.message}
                    />
                    {errors.message && (
                      <span className={s.error}>{errors.message.message}</span>
                    )}
                  </label>
                  <div className={s.upload}>
                    <label className={`field ${s.field}`}>
                      Plans or inspiration (optional)
                      <input
                        type="file"
                        ref={uploadRef}
                        multiple
                        accept="image/jpeg,image/png,image/webp,application/pdf"
                        onChange={(e) => selectFiles(e.target.files)}
                        aria-describedby="upload-note upload-error"
                      />
                    </label>
                    <p id="upload-note" className={s.note}>
                      JPG, PNG, WebP or PDF. Up to 4 files, maximum 4 MB
                      combined. Files are sent only with your enquiry; delivery
                      depends on configured services.
                    </p>
                    {(files.length > 0 || !!fileError) && (
                      <>
                        <ul className={s.files}>
                          {files.map((file, i) => (
                            <li key={`${file.name}-${i}`}>
                              {file.name} ·{" "}
                              {(file.size / 1024 / 1024).toFixed(2)} MB
                            </li>
                          ))}
                        </ul>
                        <button
                          className={s.chip}
                          type="button"
                          onClick={() => {
                            if (uploadRef.current) {
                              uploadRef.current.value = "";
                              uploadRef.current.focus();
                            }
                            setFiles([]);
                            setFileError("");
                          }}
                        >
                          Remove selected files
                        </button>
                      </>
                    )}
                    <p id="upload-error" role="alert" className={s.error}>
                      {fileError}
                    </p>
                  </div>
                </div>
              )}
              {step === 3 && (
                <div className={s.stack}>
                  <dl className={s.review}>
                    {[
                      ["Name", values.name],
                      ["Email", values.email],
                      ["Phone", values.phone],
                      [
                        "Project",
                        `${values.propertyType} · ${values.location}`,
                      ],
                      ["Area", `${values.area} sq ft`],
                      ["Budget", values.budget],
                      ["Timing", values.timeline],
                      ["Note", values.message || "No additional note"],
                      ["Brief", values.summary || "No saved planning brief"],
                      [
                        "Files",
                        files.map((f) => f.name).join(", ") || "No attachments",
                      ],
                    ].map(([label, value]) => (
                      <div key={label}>
                        <dt>{label}</dt>
                        <dd>{value}</dd>
                      </div>
                    ))}
                  </dl>
                  <label className={s.consent}>
                    <input
                      type="checkbox"
                      {...register("consent")}
                      aria-invalid={!!errors.consent}
                      aria-describedby="consent-error"
                    />
                    I consent to MK Associates processing the contact details,
                    project information and optional files I provide to respond
                    to this enquiry. I understand these may be sent to the
                    configured email and project-record services. This is not
                    consent to marketing.
                  </label>
                  <span id="consent-error" className={`form-error ${s.error}`}>
                    {errors.consent?.message}
                  </span>
                  <AntiSpam
                    key={verificationRevision}
                    onToken={(token) => setValue("verificationToken", token)}
                  />
                  <p className={s.note}>
                    If delivery services are not configured, you will receive a
                    clearly labelled demo receipt. No email, enquiry or file
                    will be delivered in demo mode.
                  </p>
                </div>
              )}
              {result && (
                <p
                  className={result.status === "error" ? s.error : s.status}
                  role="status"
                >
                  {result.message}
                  {result.receiptId && <> Receipt: {result.receiptId}</>}
                </p>
              )}
              <div className={s.actions}>
                {step > 0 && (
                  <button
                    className={`button-outline ${s.secondary}`}
                    type="button"
                    disabled={pending}
                    onClick={() => go(step - 1)}
                  >
                    ← Back
                  </button>
                )}
                {step < 3 ? (
                  <button
                    className={`button ${s.primary}`}
                    type="button"
                    onClick={next}
                  >
                    Continue →
                  </button>
                ) : (
                  <button
                    className={`button ${s.primary}`}
                    type="submit"
                    disabled={pending || result?.status === "partial"}
                  >
                    {pending
                      ? "Sending your enquiry…"
                      : "Send project enquiry ↗"}
                  </button>
                )}
              </div>
            </form>
          </section>
        </div>
      </div>
    </div>
  );
}
