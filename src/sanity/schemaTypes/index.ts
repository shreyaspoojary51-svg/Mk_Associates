import { defineField, defineType } from "sanity";

const slug = defineField({
  name: "slug",
  title: "URL slug",
  type: "slug",
  options: { source: "title", maxLength: 96 },
  validation: (rule) => rule.required(),
});
const title = defineField({
  name: "title",
  type: "string",
  validation: (rule) => rule.required(),
});
const description = defineField({
  name: "description",
  type: "text",
  rows: 3,
  validation: (rule) => rule.required().max(400),
});
const image = defineField({
  name: "image",
  title: "Editorial image",
  type: "image",
  options: { hotspot: true },
  fields: [
    defineField({
      name: "alt",
      title: "Alternative text",
      type: "string",
      description:
        "Describe the visible room or material. Do not repeat the caption.",
      validation: (rule) => rule.required().min(8),
    }),
  ],
});
const body = defineField({
  name: "body",
  title: "Body",
  type: "array",
  of: [
    { type: "block" },
    {
      type: "image",
      options: { hotspot: true },
      fields: [
        {
          name: "alt",
          title: "Alternative text",
          type: "string",
          validation: (rule) => rule.required().min(8),
        },
      ],
    },
  ],
});
const order = defineField({ name: "order", type: "number", initialValue: 0 });

export const schemaTypes = [
  defineType({
    name: "siteConfig",
    title: "Site configuration",
    type: "document",
    fields: [
      defineField({
        name: "title",
        type: "string",
        initialValue: "MK Associates",
        validation: (rule) => rule.required(),
      }),
      defineField({ name: "description", type: "text" }),
      defineField({
        name: "email",
        type: "string",
        validation: (rule) => rule.email(),
      }),
      defineField({
        name: "phone",
        type: "string",
        description: "Publish only a verified business number.",
      }),
      defineField({
        name: "address",
        type: "text",
        description:
          "Verify the address before publishing local business structured data.",
      }),
      defineField({
        name: "founderNames",
        type: "array",
        of: [{ type: "string" }],
        initialValue: ["Mahindra", "Kunal"],
      }),
      image,
    ],
  }),
  defineType({
    name: "project",
    title: "Project / concept study",
    type: "document",
    fields: [
      title,
      slug,
      defineField({
        name: "category",
        type: "string",
        options: {
          list: ["Residential", "Commercial", "Hospitality", "Renovation"],
        },
        validation: (rule) => rule.required(),
      }),
      defineField({
        name: "locality",
        type: "string",
        options: { list: ["Andheri West", "Bandra West", "Juhu", "Powai"] },
        validation: (rule) => rule.required(),
      }),
      defineField({
        name: "area",
        type: "string",
        description: "For example: 1,240 sq ft",
      }),
      defineField({ name: "year", type: "string" }),
      description,
      image,
      defineField({
        name: "accent",
        type: "string",
        validation: (rule) => rule.regex(/^#[0-9a-fA-F]{6}$/),
      }),
      defineField({
        name: "investment",
        type: "string",
        description:
          "Clearly label an illustrative investment, not a completed-project claim.",
      }),
      defineField({
        name: "concept",
        title: "Concept, not completed client work",
        type: "boolean",
        initialValue: true,
        validation: (rule) => rule.required(),
      }),
      defineField({ name: "story", type: "text" }),
      body,
      order,
    ],
  }),
  defineType({
    name: "service",
    title: "Service",
    type: "document",
    fields: [
      title,
      slug,
      description,
      defineField({
        name: "desc",
        title: "Short description (legacy alias)",
        type: "text",
        description: "Prefer Description above for new entries.",
      }),
      defineField({
        name: "price",
        title: "Investment guidance",
        type: "string",
      }),
      defineField({ name: "icon", type: "string" }),
      defineField({ name: "introduction", type: "text" }),
      defineField({
        name: "includes",
        type: "array",
        of: [{ type: "string" }],
      }),
      defineField({ name: "considerations", type: "text" }),
      image,
      body,
      order,
    ],
  }),
  defineType({
    name: "article",
    title: "Journal article",
    type: "document",
    fields: [
      title,
      slug,
      description,
      defineField({ name: "category", type: "string" }),
      defineField({
        name: "publishedAt",
        type: "datetime",
        validation: (rule) => rule.required(),
      }),
      defineField({
        name: "author",
        type: "string",
        initialValue: "MK Associates editorial",
      }),
      defineField({ name: "readTime", type: "string" }),
      defineField({
        name: "relatedProjects",
        title: "Related project slugs",
        type: "array",
        of: [{ type: "string" }],
      }),
      defineField({
        name: "locality",
        title: "Related locality slug",
        type: "string",
      }),
      defineField({
        name: "service",
        title: "Related service slug",
        type: "string",
      }),
      image,
      body,
    ],
  }),
  defineType({
    name: "locality",
    title: "Locality",
    type: "document",
    fields: [
      title,
      slug,
      description,
      defineField({
        name: "name",
        type: "string",
        validation: (rule) => rule.required(),
      }),
      defineField({ name: "introduction", type: "text" }),
      defineField({
        name: "priorities",
        type: "array",
        of: [
          {
            type: "object",
            fields: [
              { name: "title", type: "string" },
              { name: "text", type: "text" },
            ],
          },
        ],
      }),
      image,
      body,
    ],
  }),
  defineType({
    name: "testimonial",
    title: "Verified testimonial",
    type: "document",
    fields: [
      defineField({
        name: "name",
        title: "Consenting client name",
        type: "string",
        validation: (rule) => rule.required(),
      }),
      defineField({
        name: "quote",
        type: "text",
        validation: (rule) => rule.required(),
      }),
      defineField({ name: "locality", type: "string" }),
      defineField({
        name: "source",
        title: "Verification source",
        type: "url",
      }),
      defineField({
        name: "permissionConfirmed",
        title: "Permission to publish confirmed",
        type: "boolean",
        initialValue: false,
        validation: (rule) =>
          rule.custom(
            (value) =>
              value === true ||
              "Confirm permission before publishing a testimonial.",
          ),
      }),
      image,
      order,
    ],
  }),
];
