export const TIERS = {
  essential: {
    label: "Contemporary Refined",
    rate: 2500,
    description: "Considered essentials. Beautifully practical.",
  },
  signature: {
    label: "Quiet Luxury",
    rate: 3800,
    description: "Elevated finishes. A more personal expression.",
  },
  bespoke: {
    label: "Bespoke Architectural",
    rate: 5200,
    description: "Distinctive materials. Tailored to the last detail.",
  },
} as const;
export const PROPERTY_TYPES = [
  "2 BHK",
  "3 BHK",
  "4 BHK / Penthouse",
  "Boutique commercial",
  "Apartment",
  "Independent home",
  "Office",
] as const;
export const ADDONS = {
  civil: {
    label: "Civil alterations",
    rate: 350,
    unit: "sq ft",
    description: "Indicative allowance for layout changes.",
  },
  electrical: {
    label: "Full rewiring",
    rate: 180,
    unit: "sq ft",
    description: "An allowance for updating existing wiring.",
  },
  waterproofing: {
    label: "Monsoon waterproofing",
    rate: 90,
    unit: "sq ft",
    description: "Whole-project area-based allowance; refined after survey.",
  },
  climate: {
    label: "Air-conditioning provision",
    rate: 160,
    unit: "sq ft",
    description:
      "Provision allowance; equipment selection affects the final price.",
  },
  lighting: {
    label: "Smart lighting",
    rate: 225,
    unit: "sq ft",
    description:
      "Illustrative control and dimming allowance; equipment and circuits follow the approved design.",
  },
  styling: {
    label: "Art & soft styling",
    rate: 150000,
    unit: "project",
    description:
      "Curated art and textile allowance; final pieces and availability are reviewed together.",
  },
  permissions: {
    label: "Society coordination",
    rate: 25000,
    unit: "project",
    description:
      "Coordination allowance, excluding statutory and society deposits.",
  },
} as const;
export type Tier = keyof typeof TIERS;
export type Addon = keyof typeof ADDONS;
export interface EstimateInput {
  area: number;
  tier: Tier;
  propertyType: (typeof PROPERTY_TYPES)[number];
  addons: Addon[];
}
export const MILESTONES = [
  { label: "Design & booking", percent: 10 },
  { label: "Design sign-off", percent: 30 },
  { label: "Execution underway", percent: 35 },
  { label: "Finishing stage", percent: 20 },
  { label: "Handover", percent: 5 },
] as const;
/** Planning allowance, not a binding quotation. No network or side effects. */
export function calculateEstimate(input: EstimateInput) {
  if (!Number.isFinite(input.area) || input.area < 150 || input.area > 25000)
    throw new RangeError("Area must be between 150 and 25,000 sq ft.");
  if (!Object.hasOwn(TIERS, input.tier))
    throw new TypeError("Choose a valid finish tier.");
  if (!PROPERTY_TYPES.includes(input.propertyType))
    throw new TypeError("Choose a valid property type.");
  if (
    !Array.isArray(input.addons) ||
    input.addons.some((key) => !Object.hasOwn(ADDONS, key))
  )
    throw new TypeError("Choose valid add-ons.");
  const area = Math.round(input.area * 100) / 100;
  const base = Math.round(area * TIERS[input.tier].rate);
  const addonLines = [...new Set(input.addons)].map((key) => ({
    key,
    label: ADDONS[key].label,
    amount: Math.round(
      ADDONS[key].rate * (ADDONS[key].unit === "project" ? 1 : area),
    ),
  }));
  const total = base + addonLines.reduce((sum, line) => sum + line.amount, 0);
  let allocated = 0;
  const milestones = MILESTONES.map((item, i) => {
    const amount =
      i === MILESTONES.length - 1
        ? total - allocated
        : Math.round((total * item.percent) / 100);
    allocated += amount;
    return { ...item, amount };
  });
  return {
    area,
    base,
    addonLines,
    total,
    low: Math.round(total * 0.85),
    high: Math.round(total * 1.15),
    milestones,
    days: { low: 90, high: 140 },
  };
}
export const formatINR = (value: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);
export const formatLakhs = (value: number) =>
  `₹${(value / 100000).toFixed(2)} lakh`;
export function whatsappLink(summary: string): string | null {
  const configured = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER?.trim();
  if (!configured || !/^\+?[1-9]\d{7,14}$/.test(configured)) return null;
  return `https://wa.me/${configured.replace(/^\+/, "")}?text=${encodeURIComponent(summary)}`;
}
export function whatsappShareUrl(summary: string): string {
  return (
    whatsappLink(summary) ||
    `https://api.whatsapp.com/send?text=${encodeURIComponent(summary)}`
  );
}
