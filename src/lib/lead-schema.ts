import { z } from "zod";
export const leadSchema = z.object({
  name: z.string().trim().min(2, "Please enter your name.").max(100),
  email: z
    .string()
    .trim()
    .email("Please enter a valid email address.")
    .max(254),
  phone: z
    .string()
    .trim()
    .min(8, "Please enter a contact number.")
    .max(24)
    .regex(/^\+?[\d\s()\-]{8,24}$/, "Use digits and an optional country code.")
    .refine(
      (v) =>
        v.replace(/\D/g, "").length >= 8 && v.replace(/\D/g, "").length <= 15,
      "Enter 8–15 digits.",
    ),
  propertyType: z.enum([
    "2 BHK",
    "3 BHK",
    "4 BHK / Penthouse",
    "Boutique commercial",
    "Apartment",
    "Independent home",
    "Office",
  ]),
  location: z
    .string()
    .trim()
    .min(2, "Please enter the project locality.")
    .max(120),
  area: z
    .number()
    .min(150, "Minimum area is 150 sq ft.")
    .max(25000, "Maximum area is 25,000 sq ft."),
  budget: z.enum([
    "Under ₹25 lakh",
    "₹25–50 lakh",
    "₹50 lakh–₹1 crore",
    "₹1 crore+",
    "Still exploring",
  ]),
  timeline: z.enum([
    "As soon as practical",
    "Within 3 months",
    "3–6 months",
    "Just exploring",
  ]),
  message: z
    .string()
    .trim()
    .max(3000, "Please keep your note under 3,000 characters."),
  summary: z.string().trim().max(2000),
  consent: z
    .boolean()
    .refine((value) => value, "Please consent to contact about this project."),
  website: z.string().max(200),
  verificationToken: z.string().max(2048).optional(),
});
export type LeadValues = z.infer<typeof leadSchema>;
export const estimateInputSchema = z.object({
  area: z.number().min(150).max(25000),
  tier: z.enum(["essential", "signature", "bespoke"]),
  propertyType: z.enum([
    "2 BHK",
    "3 BHK",
    "4 BHK / Penthouse",
    "Boutique commercial",
    "Apartment",
    "Independent home",
    "Office",
  ]),
  addons: z
    .array(
      z.enum([
        "civil",
        "electrical",
        "waterproofing",
        "climate",
        "permissions",
        "lighting",
        "styling",
      ]),
    )
    .max(7),
});
export const briefSchema = z.object({
  room: z.enum(["Living room", "Bedroom", "Kitchen", "Workspace", "Café"]),
  palette: z.enum([
    "Warm neutrals",
    "Earth & olive",
    "Monochrome",
    "Coastal calm",
  ]),
  material: z.enum(["Natural oak", "Walnut", "Stone", "Textured plaster"]),
});
export type DesignBrief = z.infer<typeof briefSchema>;
export const proposalSchema = z
  .object({
    estimate: estimateInputSchema.optional(),
    brief: briefSchema.optional(),
    email: z.union([z.literal(""), z.string().email().max(254)]).optional(),
    consent: z.boolean().optional(),
    verificationToken: z.string().max(2048).optional(),
  })
  .refine(
    (v) => v.estimate || v.brief,
    "Choose an estimate or a design direction first.",
  )
  .refine(
    (v) => !v.email || v.consent === true,
    "Consent is required to email your brief.",
  );
