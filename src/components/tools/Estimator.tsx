"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ADDONS,
  TIERS,
  PROPERTY_TYPES,
  calculateEstimate,
  formatINR,
  formatLakhs,
  whatsappLink,
  type EstimateInput,
  type Addon,
  type Tier,
} from "@/lib/estimate";
import { estimateInputSchema } from "@/lib/lead-schema";
import ProposalDownload from "./ProposalDownload";
import s from "./tools.module.css";
import { readSessionJSON } from "./session";
const initial: EstimateInput = {
  area: 1000,
  tier: "signature",
  propertyType: "Apartment",
  addons: [],
};
export default function Estimator() {
  const [input, setInput] = useState<EstimateInput>(initial);
  const [areaText, setAreaText] = useState("1000");
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => {
    try {
      const saved = readSessionJSON("mk-estimate");
      const parsed = estimateInputSchema.safeParse(saved);
      if (parsed.success) {
        setInput(parsed.data);
        setAreaText(String(parsed.data.area));
      }
    } catch {}
    setHydrated(true);
  }, []);
  useEffect(() => {
    if (hydrated)
      try {
        sessionStorage.setItem("mk-estimate", JSON.stringify(input));
      } catch {}
  }, [input, hydrated]);
  const areaValue = Number(areaText);
  const validArea =
    areaText.trim() !== "" &&
    Number.isFinite(areaValue) &&
    areaValue >= 150 &&
    areaValue <= 25000;
  const result = calculateEstimate(input);
  const summary = `${input.propertyType} · ${input.area} sq ft · ${TIERS[input.tier].label}\nPlanning range: ${formatINR(result.low)}–${formatINR(result.high)}\nAdd-ons: ${input.addons.map((a) => ADDONS[a].label).join(", ") || "None"}\nIndicative, excluding taxes; subject to survey.`;
  const contactUrl = `/contact?summary=${encodeURIComponent(summary)}`;
  const whatsapp = whatsappLink(
    `Hello MK Associates, I'd like to discuss my interior project.\n${summary}`,
  );
  function toggleAddon(addon: Addon) {
    setInput((prev) => ({
      ...prev,
      addons: prev.addons.includes(addon)
        ? prev.addons.filter((a) => a !== addon)
        : [...prev.addons, addon],
    }));
  }
  return (
    <div className={s.shell}>
      <div className="container">
        <header className={`page-intro ${s.intro}`}>
          <span className={`eyebrow ${s.overline}`}>
            Plan with clarity / 01
          </span>
          <h1 className="display">
            Great spaces.
            <br />
            Considered budgets.
          </h1>
          <p className="body-large">
            A little clarity before the first conversation. Explore a realistic
            planning range for your Mumbai interior project.
          </p>
        </header>
        <div className={`tool-layout ${s.grid}`}>
          <section
            className={`tool-panel ${s.panel}`}
            aria-labelledby="estimate-inputs"
          >
            <span className={s.overline}>Make it yours</span>
            <h2 id="estimate-inputs">The shape of your project</h2>
            <div className={s.stack}>
              <fieldset className={s.fieldset}>
                <legend>Property type</legend>
                <div className={`chip-grid ${s.chips}`}>
                  {PROPERTY_TYPES.map((type) => (
                    <button
                      type="button"
                      className={`chip ${s.chip}`}
                      key={type}
                      aria-pressed={input.propertyType === type}
                      onClick={() =>
                        setInput((prev) => ({ ...prev, propertyType: type }))
                      }
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </fieldset>
              <label className={`field ${s.field}`}>
                Carpet area in square feet
                <input
                  type="number"
                  min={150}
                  max={25000}
                  step="0.01"
                  inputMode="decimal"
                  value={areaText}
                  aria-invalid={!validArea}
                  aria-describedby="area-note"
                  onChange={(e) => {
                    const value = e.target.value;
                    setAreaText(value);
                    const n = Number(value);
                    if (
                      value.trim() &&
                      Number.isFinite(n) &&
                      n >= 150 &&
                      n <= 25000
                    )
                      setInput((prev) => ({ ...prev, area: n }));
                  }}
                />
                <span id="area-note" className={validArea ? s.note : s.error}>
                  {validArea
                    ? "Use the usable carpet area, not the built-up area. 150–25,000 sq ft."
                    : "Enter an area between 150 and 25,000 sq ft. The preview shows your last valid area."}
                </span>
              </label>
              <fieldset className={s.fieldset}>
                <legend>Your finish level</legend>
                <div className={s.tiers}>
                  {(
                    Object.entries(TIERS) as [Tier, (typeof TIERS)[Tier]][]
                  ).map(([key, tier]) => (
                    <button
                      type="button"
                      key={key}
                      className={s.tier}
                      aria-pressed={input.tier === key}
                      onClick={() =>
                        setInput((prev) => ({ ...prev, tier: key }))
                      }
                    >
                      <span>
                        <strong>
                          {tier.label}
                          {key === "signature" ? " / our balanced edit" : ""}
                        </strong>
                        <small>{tier.description}</small>
                      </span>
                      <span className={s.tierRate}>
                        {formatINR(tier.rate)}
                        <small>per sq ft</small>
                      </span>
                    </button>
                  ))}
                </div>
              </fieldset>
              <fieldset className={s.fieldset}>
                <legend>
                  Mumbai-specific considerations{" "}
                  <span className={s.note}>(optional)</span>
                </legend>
                {(
                  Object.entries(ADDONS) as [Addon, (typeof ADDONS)[Addon]][]
                ).map(([key, addon]) => (
                  <label className={s.addon} key={key}>
                    <input
                      type="checkbox"
                      checked={input.addons.includes(key)}
                      onChange={() => toggleAddon(key)}
                    />
                    <span>
                      {addon.label}
                      <small>{addon.description}</small>
                    </span>
                    <span>
                      +{formatINR(addon.rate)} / {addon.unit}
                    </span>
                  </label>
                ))}
              </fieldset>
              <p className={`note ${s.note}`}>
                Tier rates are planning assumptions for design and fixed
                interiors, not published quotations. Add-ons are extra
                allowances across the entered area. Appliances, loose furniture,
                taxes and statutory fees are excluded.
              </p>
            </div>
          </section>
          <aside
            className={`tool-panel ${s.summary}`}
            aria-label="Estimate summary"
          >
            <span className={s.overline}>Your project, at a glance</span>
            <h2>Room to imagine.</h2>
            <div
              className={`estimate-total ${s.total}`}
              aria-live="polite"
              aria-atomic="true"
            >
              {formatLakhs(result.total)}
            </div>
            <p className={s.range}>
              Planning range: {formatLakhs(result.low)} –{" "}
              {formatLakhs(result.high)}
              <br />A ±15% allowance, not a fixed quote.
            </p>
            <div className={s.breakdown}>
              <div className={s.row}>
                <span>
                  {input.area.toLocaleString("en-IN")} sq ft ·{" "}
                  {TIERS[input.tier].label}
                </span>
                <span>{formatINR(result.base)}</span>
              </div>
              {result.addonLines.map((line) => (
                <div className={s.row} key={line.key}>
                  <span>{line.label}</span>
                  <span>{formatINR(line.amount)}</span>
                </div>
              ))}
              <div className={s.row}>
                <strong>Planning midpoint</strong>
                <strong>{formatINR(result.total)}</strong>
              </div>
            </div>
            <div className={s.timeline}>
              <strong>90–140</strong>
              <span>
                indicative execution days
                <br />
                after sign-off & site readiness
              </span>
            </div>
            <p className={s.summaryNote}>
              Every home has its own details. Site access, approvals, materials
              and the final scope can change both budget and schedule. A site
              survey comes before a quotation.
            </p>
            <div className={s.actions}>
              {validArea ? (
                <Link className={`button ${s.primary}`} href={contactUrl}>
                  Discuss this estimate <span aria-hidden="true">↗</span>
                </Link>
              ) : (
                <button className={`button ${s.primary}`} disabled>
                  Enter a valid area to continue
                </button>
              )}
              {whatsapp && validArea && (
                <a
                  className={`button-outline ${s.secondary}`}
                  href={whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Continue on WhatsApp ↗
                </a>
              )}
            </div>
            {!validArea ? (
              <p className={s.summaryNote}>
                Correct your area above before saving your estimate.
              </p>
            ) : (
              <ProposalDownload estimate={input} />
            )}
            <p className={s.summaryNote}>
              Your choices stay in this browser tab for this session. Nothing is
              sent until you submit an enquiry or request an email copy.
            </p>
          </aside>
        </div>
        <section className={s.milestones} aria-labelledby="milestone-title">
          <span className={`eyebrow ${s.overline}`}>
            A transparent path forward
          </span>
          <h2 id="milestone-title">Progress, one milestone at a time.</h2>
          <div className={s.milestoneGrid}>
            {result.milestones.map((m, i) => (
              <div key={m.label}>
                <span className={s.overline}>
                  0{i + 1} / {m.label}
                </span>
                <strong>{m.percent}%</strong>
                <span>{formatINR(m.amount)}</span>
              </div>
            ))}
          </div>
          <p className={`note ${s.note}`}>
            An illustrative payment structure applied to the planning midpoint.
            Actual milestones and amounts are confirmed in your project
            agreement.
          </p>
        </section>
      </div>
    </div>
  );
}
