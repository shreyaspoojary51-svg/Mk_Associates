export type EditorialBlock = {
  _type: string;
  _key: string;
  children?: unknown;
  [key: string]: unknown;
};
export type SiteConfig = {
  title: string;
  description: string;
  email?: string;
  phone?: string;
  address?: string;
  founderNames: string[];
  image?: string;
  alt?: string;
};
export type Project = {
  slug: string;
  title: string;
  category: string;
  locality: string;
  area: string;
  year: string;
  description: string;
  image: string;
  accent: string;
  investment: string;
  story?: string;
  alt: string;
  concept: boolean;
  body?: EditorialBlock[];
};
export type Service = {
  slug: string;
  title: string;
  description: string;
  desc: string;
  price: string;
  icon: string;
  investment: string;
  number: string;
  introduction: string;
  includes: string[];
  considerations: string;
  image: string;
  alt?: string;
  body?: EditorialBlock[];
};
export type Locality = {
  slug: string;
  name: string;
  title: string;
  description: string;
  introduction: string;
  priorities: { title: string; text: string }[];
  image: string;
  alt?: string;
  body?: EditorialBlock[];
};
export type Article = {
  slug: string;
  title: string;
  description: string;
  category: string;
  readTime: string;
  author?: string;
  date: string;
  image: string;
  sections: { heading: string; paragraphs: string[] }[];
  relatedProjects: string[];
  locality: string;
  service: string;
  alt?: string;
  body?: EditorialBlock[];
};

export const projects: Project[] = [
  {
    slug: "the-quiet-apartment",
    title: "The Quiet Apartment",
    category: "Residential",
    locality: "Andheri West",
    area: "1,240 sq ft",
    year: "2026",
    description:
      "A family apartment imagined in warm oak, soft limewash and the light of an ordinary Mumbai morning.",
    image: "/images/project-1.webp",
    accent: "#A88753",
    investment: "Illustrative scope · ₹35–48 lakh",
    alt: "Concept interior with a warm neutral living space and natural timber details",
    concept: true,
    story:
      "The brief imagines a three-bedroom home that makes room for work, visiting family and everyday clutter. A generous passage becomes a library wall; a sliding study screen offers privacy without borrowing daylight. The palette stays quiet so the rhythms of family life can take the foreground.",
  },
  {
    slug: "juhu-house",
    title: "Juhu House",
    category: "Residential",
    locality: "Juhu",
    area: "2,100 sq ft",
    year: "2026",
    description:
      "An unhurried coastal home, balancing generous gathering spaces with rooms that feel personal.",
    image: "/images/project-2.webp",
    accent: "#B7AB94",
    investment: "Illustrative scope · ₹65–90 lakh",
    alt: "Concept of a light-filled coastal residence in a restrained natural palette",
    concept: true,
    story:
      "This concept starts with a long afternoon: family arriving, doors open between dining and living, and a quiet reading corner beyond. Honed stone and washable linen bring texture rather than shine. Coastal exposure informs the specification: hardware, window seals and concealed joinery all deserve as much attention as the view.",
  },
  {
    slug: "bandra-courtyard",
    title: "Bandra Morning",
    category: "Residential",
    locality: "Bandra West",
    area: "1,680 sq ft",
    year: "2026",
    description:
      "An imagined city refuge: textured walls, planted thresholds and a considered dialogue between old and new.",
    image: "/images/project-3.webp",
    accent: "#7D876B",
    investment: "Illustrative scope · ₹48–68 lakh",
    alt: "Concept residence with earthy finishes and greenery at the edge of a room",
    concept: true,
    story:
      "The design study pairs the character of an older apartment with a less fragmented plan. Existing features would be surveyed before any intervention. A dining bench uses an awkward corner well, while freestanding pieces preserve flexibility. Greenery is an interior design intention, not a claim that a courtyard exists on a real site.",
  },
  {
    slug: "powai-residence",
    title: "Powai Residence",
    category: "Residential",
    locality: "Powai",
    area: "1,450 sq ft",
    year: "2026",
    description:
      "A contemporary high-rise concept with purposeful storage and a softer approach to working from home.",
    image: "/images/project-4.webp",
    accent: "#738481",
    investment: "Illustrative scope · ₹40–58 lakh",
    alt: "Concept high-rise apartment with clean lines and a softly layered material palette",
    concept: true,
    story:
      "Two people working from home need more than a desk in a bedroom. The concept separates video-call backgrounds, adds acoustic softness and keeps evening living distinct from the working day. Full-height storage is broken into smaller visual planes, avoiding the feeling of a room lined with cupboards.",
  },
  {
    slug: "the-material-office",
    title: "The Material Office",
    category: "Commercial",
    locality: "Andheri West",
    area: "1,800 sq ft",
    year: "2026",
    description:
      "A boutique workspace study built around good acoustics, natural light and the pleasure of making things.",
    image: "/images/project-5.webp",
    accent: "#A55D48",
    investment: "Illustrative scope · ₹42–60 lakh",
    alt: "Concept boutique workspace using timber, tactile surfaces and warm lighting",
    concept: true,
    story:
      "A shared table anchors this workplace concept. Enclosed meeting space sits away from the brightest perimeter so daily work benefits from the windows. The design brief prioritises cable management, lighting comfort and sound absorption. Occupancy, fire safety and building approvals would shape an actual fit-out.",
  },
  {
    slug: "a-table-in-bandra",
    title: "A Table in Bandra",
    category: "Hospitality",
    locality: "Bandra West",
    area: "920 sq ft",
    year: "2026",
    description:
      "A neighbourhood café imagined as a warm pause in the city, from the first coffee to the last conversation.",
    image: "/images/project-6.webp",
    accent: "#987053",
    investment: "Illustrative scope · ₹30–45 lakh",
    alt: "Concept café interior with a warm, intimate material palette",
    concept: true,
    story:
      "This café study considers two different rhythms: the quick takeaway and the longer catch-up. A clear service route keeps them from colliding. Durable surfaces, accessible circulation and a cleanable counter take priority over decorative gestures. Kitchen equipment and statutory approvals are outside the illustrative design budget.",
  },
  {
    slug: "the-juhu-retreat",
    title: "The Juhu Retreat",
    category: "Residential",
    locality: "Juhu",
    area: "2,650 sq ft",
    year: "2026",
    description:
      "An expansive home study where stone, timber and intimate lighting create quieter spaces inside a larger plan.",
    image: "/images/project-7.webp",
    accent: "#A59B89",
    investment: "Illustrative scope · ₹90 lakh–1.3 crore",
    alt: "Concept of a spacious residence with natural stone and rich timber accents",
    concept: true,
    story:
      "A large home does not need every room to feel large. This study layers gathering spaces with small places to sit alone. The central material idea is continuity: a limited palette, used differently from room to room. Lighting is planned around tasks and evening scenes rather than a ceiling full of downlights.",
  },
  {
    slug: "the-soft-reset",
    title: "The Soft Reset",
    category: "Renovation",
    locality: "Powai",
    area: "1,050 sq ft",
    year: "2026",
    description:
      "A renovation concept that keeps what works, makes storage earn its place and gives a familiar home new ease.",
    image: "/images/project-8.webp",
    accent: "#978C79",
    investment: "Illustrative scope · ₹24–36 lakh",
    alt: "Concept renovated apartment with understated finishes and integrated storage",
    concept: true,
    story:
      "Instead of replacing everything, the study asks what can remain. Serviceable furniture is imagined reupholstered; new joinery concentrates on high-use zones. A real renovation would begin with electrical, plumbing and waterproofing checks. The outcome shown is a design direction, not a documented before-and-after.",
  },
];

type ServiceSeed = [
  string,
  string,
  string,
  string,
  string,
  string,
  string[],
  string,
];
const serviceInput: ServiceSeed[] = [
  [
    "residential-interiors",
    "Residential Interior Design",
    "Homes shaped around the way you actually live.",
    "Illustrative · from ₹25 lakh",
    "01",
    "A good home has room for the untidy, lovely realities of life. We begin with who lives here, what the day looks like, and what needs to feel different.",
    [
      "Spatial planning and furniture layouts",
      "Material, colour and lighting direction",
      "Kitchen, wardrobe and bespoke joinery design",
      "Detailed drawings and specification schedules",
    ],
    "Carpet area, existing services, material choices and execution scope determine the investment. A design fee and build cost should be considered separately.",
  ],
  [
    "commercial-interiors",
    "Commercial & Office Interiors",
    "Workspaces with clarity, comfort and room to grow.",
    "Illustrative · from ₹20 lakh",
    "02",
    "An office should support the work, not distract from it. We consider focus, collaboration, acoustics and the impression your visitors take away.",
    [
      "Workplace planning and circulation",
      "Meeting rooms and acoustic strategy",
      "Lighting, power and data coordination",
      "Furniture selection and fit-out detailing",
    ],
    "Building permissions, occupancy requirements and fire-safety coordination need to be established before a programme is agreed.",
  ],
  [
    "hospitality-interiors",
    "Hospitality & Retail",
    "Places with a point of view, and a plan that works.",
    "Illustrative · from ₹25 lakh",
    "03",
    "A memorable café or boutique begins with a clear experience. Behind that experience sits a practical layout for staff, deliveries, cleaning and everyday use.",
    [
      "Customer journey and brand-led interiors",
      "Service counters and display design",
      "Durable finish and furniture selection",
      "Lighting and operational layout coordination",
    ],
    "Food-service equipment, licences and specialist services require separate coordination and costing.",
  ],
  [
    "turnkey-execution",
    "Turnkey Execution",
    "One coordinated route from approved drawings to handover.",
    "Illustrative · from ₹25 lakh",
    "04",
    "Design only becomes real through careful execution. The agreed scope brings drawings, procurement and site coordination into one legible plan.",
    [
      "Itemised scope and material specification",
      "Vendor and procurement coordination",
      "Site progress and quality checkpoints",
      "Snagging and handover documentation",
    ],
    "A turnkey contract must define exclusions, payment milestones, change approvals and warranty terms. These are agreed in writing, not assumed.",
  ],
  [
    "furniture-and-styling",
    "Furniture & Styling",
    "The finishing layers that make a room feel like yours.",
    "Illustrative · from ₹3 lakh",
    "05",
    "Not every room needs a renovation. A considered furniture plan, better lighting and a few tactile layers can change the way a space feels and functions.",
    [
      "Furniture layouts and sourcing shortlist",
      "Bespoke piece design where appropriate",
      "Soft furnishings and lighting selection",
      "Art placement and final styling direction",
    ],
    "Product lead times and custom manufacturing schedules vary. Purchases are approved against the agreed budget before ordering.",
  ],
  [
    "renovation",
    "Renovation & Remodelling",
    "A thoughtful second chapter for an existing space.",
    "Illustrative · from ₹15 lakh",
    "06",
    "We start by asking what should stay. An existing home carries both character and hidden conditions; a careful survey is the beginning of responsible change.",
    [
      "Existing-condition review and revised planning",
      "Phased demolition and services coordination",
      "Kitchen, bathroom and storage upgrades",
      "Finish selection and site sequencing",
    ],
    "Hidden damage may only become visible during work. A contingency and a written variation process belong in every renovation plan.",
  ],
  [
    "nri-remote-design",
    "NRI & Remote Design",
    "Clear decisions for a Mumbai home, wherever you are.",
    "Illustrative · from ₹25 lakh",
    "07",
    "Distance should not make a project opaque. A shared decision log, scheduled walkthroughs and explicit approvals help a remote brief stay grounded in the site.",
    [
      "Remote brief and drawing reviews",
      "Material shortlists with documented approvals",
      "Scheduled site updates and decision tracking",
      "Handover coordination with your representative",
    ],
    "A local authorised contact, reliable access and agreed approval windows help prevent avoidable delays. Reporting arrangements form part of the proposal.",
  ],
];
export const services: Service[] = serviceInput.map((s, i) => ({
  slug: s[0],
  title: s[1],
  description: s[2],
  desc: s[2],
  price: s[3],
  investment: s[3],
  icon: ["◯", "□", "◇", "＋", "⌑", "↗", "◎"][i],
  number: s[4],
  introduction: s[5],
  includes: s[6],
  considerations: s[7],
  image: `/images/project-${[1, 5, 6, 7, 2, 8, 3][i]}.webp`,
}));

export const localities: Locality[] = [
  {
    slug: "andheri-west",
    name: "Andheri West",
    title: "A home in the heart of the everyday.",
    description:
      "Thoughtful interior planning for Andheri West, from Lokhandwala apartments to the coastal edges of Versova.",
    introduction:
      "Andheri West is not one kind of home. The compact plans of older buildings, busy family apartments in Lokhandwala and the coastal exposure of Versova each ask different questions. We start with your building and your daily routine, not a neighbourhood stereotype.",
    image: "/images/project-1.webp",
    priorities: [
      {
        title: "Make circulation work harder",
        text: "In a compact apartment, a passage can hold linen storage or a shallow library without narrowing the usable route. Every change begins with measurements.",
      },
      {
        title: "Plan around the society",
        text: "Lift access, permitted noisy work, delivery windows and debris removal should be confirmed before the site programme is finalised.",
      },
      {
        title: "Check the wet edges",
        text: "Near the coast, window junctions and exposed walls deserve an early inspection. A decorative finish is never a substitute for resolving water ingress.",
      },
    ],
  },
  {
    slug: "lokhandwala",
    name: "Lokhandwala",
    title: "High-density living, deeply personal spaces.",
    description:
      "Interior planning for Lokhandwala Complex apartments—balancing vibrant neighborhood energy with acoustic quiet, smart storage and lift logistics.",
    introduction:
      "Lokhandwala Complex in Andheri West represents dynamic Mumbai living at its densest and most energetic. Between the bustling markets, lively backstreets and multi-tower gated societies, a Lokhandwala home needs to be an acoustic sanctuary. We plan interiors around society lift rules, compact service shafts and intelligent storage runs that leave rooms breathing.",
    image: "/images/project-1.webp",
    priorities: [
      {
        title: "Acoustic separation & street calm",
        text: "Double-glazed fenestration, acoustic fabric panelling and dampening door seals shield your living spaces from the vibrant market hum and street traffic.",
      },
      {
        title: "Society lift & renovation coordination",
        text: "Lokhandwala societies enforce strict delivery windows, service lift dimensions and limited noisy work hours. We map logistics before work begins.",
      },
      {
        title: "Integrated storage that lets rooms breathe",
        text: "Full-height joinery recessed into architectural niches doubles storage capacity without intruding on natural light or circulation pathways.",
      },
    ],
  },
  {
    slug: "bandra-west",
    name: "Bandra West",
    title: "Character, without the compromise.",
    description:
      "Interior concepts for Bandra West that balance older-building character, contemporary comfort and practical renovation.",
    introduction:
      "Bandra can bring generous old windows, irregular plans and surfaces worth keeping. It can also bring service routes that were never designed for modern kitchens. The work is to separate character from inconvenience—and preserve one while resolving the other.",
    image: "/images/project-3.webp",
    priorities: [
      {
        title: "Survey before stripping back",
        text: "Existing flooring, timber and architectural details need a condition review. Keeping a good element can be more meaningful than reproducing an old style.",
      },
      {
        title: "Fit modern services gently",
        text: "Electrical capacity, drainage gradients and air-conditioning routes can set the limits of a plan. We prefer to address them before a material palette is approved.",
      },
      {
        title: "Design for a lived-in street",
        text: "Privacy, street noise and arrival storage matter as much as a photographed living room. Curtains, acoustic layers and threshold details can help.",
      },
    ],
  },
  {
    slug: "juhu",
    name: "Juhu",
    title: "Coastal light. Lasting materials.",
    description:
      "Interior planning for Juhu homes with considered coastal specifications, multigenerational layouts and layered natural light.",
    introduction:
      "A Juhu home might need to host three generations at dinner and feel quiet again the next morning. Coastal light is a gift; humidity and salt exposure are practical responsibilities. Both belong in the design brief.",
    image: "/images/project-2.webp",
    priorities: [
      {
        title: "Specify for coastal exposure",
        text: "Hardware grade, protective coatings, ventilation and window seals deserve explicit specification. No material should be described as maintenance-free.",
      },
      {
        title: "Give gathering its own place",
        text: "A flexible living-dining relationship helps larger families host without making every room a thoroughfare. Private rooms should remain genuinely private.",
      },
      {
        title: "Temper the daylight",
        text: "Sheers, deeper seating positions and layered lighting balance bright afternoons with useful evening light. Glare should be assessed room by room.",
      },
    ],
  },
  {
    slug: "powai",
    name: "Powai",
    title: "Room for the way life changes.",
    description:
      "Interior concepts for Powai apartments with integrated storage, work-from-home planning and practical high-rise delivery.",
    introduction:
      "A Powai apartment often has to move between workday, family evening and visiting guests. High-rise logistics can be as important as the floor plan. We treat storage, desk privacy and installation access as connected parts of the same brief.",
    image: "/images/project-4.webp",
    priorities: [
      {
        title: "Separate work from home",
        text: "A proper desk position, controllable background and acoustic softness can improve a work corner. A sliding screen is useful only if it preserves airflow and light.",
      },
      {
        title: "Respect the tower logistics",
        text: "Service-lift dimensions, delivery slots and assembly space affect furniture sizes. Joinery modules should be designed to reach the apartment, not just fit inside it.",
      },
      {
        title: "Let storage stay quiet",
        text: "Full-height cupboards can make a room feel crowded. Recesses, interrupted runs and a clear inventory help achieve useful capacity without visual weight.",
      },
    ],
  },
];

export const articles: Article[] = [
  {
    slug: "planning-your-mumbai-renovation",
    title: "Before the moodboard: planning a Mumbai renovation",
    description:
      "A practical guide to the decisions that should come before finishes: scope, society permissions, site surveys and contingencies.",
    category: "Planning",
    readTime: "6 min read",
    date: "2026-09-01",
    image: "/images/project-8.webp",
    relatedProjects: ["the-soft-reset", "the-quiet-apartment"],
    locality: "andheri-west",
    service: "renovation",
    sections: [
      {
        heading: "Begin with the ordinary day",
        paragraphs: [
          "Before collecting references, describe a weekday at home. Who leaves first? Where does laundry dry? Does someone take calls while someone else cooks? These small observations produce a much more useful brief than a list of visual styles.",
          "Write down what works, what frustrates you and what you want to keep. Separate needs from preferences. If better storage is the problem, replacing every floor may not be the answer. A clear brief helps everyone recognise when a proposal solves the right problem.",
        ],
      },
      {
        heading: "Measure what you cannot see",
        paragraphs: [
          "An existing-condition survey should consider more than wall lengths. Electrical load, plumbing routes, waterproofing history, air-conditioning drainage and window junctions can all influence the design. Ask what has been checked and which conditions remain uncertain.",
          "In an occupied home, some checks may require a later opening-up stage. That is not a reason to skip the discussion. Record the uncertainty, decide how it will be investigated and leave room in the programme for the result. Persistent leakage should be addressed at its source before a new finish is applied.",
        ],
      },
      {
        heading: "Ask the society before promising a date",
        paragraphs: [
          "Building-specific rules can determine working hours, service-lift access and delivery windows. Obtain the current renovation rules rather than relying on a neighbour’s old experience. Ask about debris routes, deposits, contractor identification and whether any proposed alteration requires approval.",
          "A programme should include these constraints. In a high-rise, a beautifully designed full-size cabinet is not useful if it cannot reach the floor. Measure the lift and access route early, and design installation joints where needed.",
        ],
      },
      {
        heading: "Budget by scope, not by a single headline rate",
        paragraphs: [
          "A per-square-foot figure can be a starting reference, but it often hides more than it explains. One quotation may include appliances and another may not. Compare itemised scopes: civil work, services, joinery, finishes, furniture, lighting, professional fees and taxes.",
          "Create a separate allowance for uncertain existing conditions. The right contingency depends on the age of the property and the extent of opening-up; it is not a universal percentage. Ask how variations will be priced and approved before work begins. A verbal “we will manage” is not a change-control process.",
        ],
      },
      {
        heading: "Make decisions in the order the site needs them",
        paragraphs: [
          "The order of choices matters. A kitchen appliance decision can affect cabinet dimensions and electrical points. A stone selection may affect the support beneath it. Long-lead products should be identified before their absence holds up several other trades.",
          "Keep one decision register with the item, who approves it and when it is needed. A weekly review of a short list is easier than a last-minute stream of messages. Where possible, approve physical samples under the light in which they will be used.",
        ],
      },
      {
        heading: "Know what handover means",
        paragraphs: [
          "Define the finish line before starting. A useful handover includes a snag list, a record of approved variations, relevant warranty documents and instructions for finishes or equipment that need particular care.",
          "The best first step is not choosing a marble. It is assembling a floor plan, a list of daily needs and the building’s renovation rules. Those documents give your designer a responsible place to begin. This article is general planning guidance, not a quotation or a substitute for a site inspection.",
        ],
      },
    ],
  },
  {
    slug: "materials-for-mumbai-monsoons",
    title: "Materials that make sense in a Mumbai monsoon",
    description:
      "How to think about moisture, ventilation, hardware and material maintenance without the promise of a “monsoon-proof” home.",
    category: "Materials",
    readTime: "5 min read",
    date: "2026-09-15",
    image: "/images/project-2.webp",
    relatedProjects: ["juhu-house", "the-juhu-retreat"],
    locality: "juhu",
    service: "residential-interiors",
    sections: [
      {
        heading: "Moisture is a building question first",
        paragraphs: [
          "A fresh interior cannot solve water entering through a damaged exterior junction. Before discussing waterproof surfaces, understand where moisture comes from: an exposed wall, a window seal, condensation, a plumbing leak or inadequate ventilation. These are different problems with different remedies.",
          "Discolouration behind a cabinet deserves investigation before the cabinet is replaced. Where the source belongs to a building-wide system, coordinate with the society and an appropriate specialist. Concealing the symptom makes future maintenance harder.",
        ],
      },
      {
        heading: "Specify the whole joinery system",
        paragraphs: [
          "“Water-resistant” is a description that needs detail. Ask which board grade is being used, how edges are sealed and how the unit is kept clear of damp floors or walls. A good panel with an unprotected cut edge may not perform as expected.",
          "Kitchen and vanity units need particular attention around sinks, plumbing penetrations and accessible shut-off valves. The small details are rarely visible in a moodboard, but they influence everyday durability. Confirm the manufacturer’s limitations and installation requirements.",
        ],
      },
      {
        heading: "Hardware is not a minor finishing decision",
        paragraphs: [
          "Coastal exposure can be demanding on metal fittings. Selection should consider the environment, material grade, protective finish and maintenance instructions. A colour name such as “brass” does not identify the underlying metal or its corrosion performance.",
          "For exposed or frequently handled pieces, request product specifications rather than relying on appearance. Hinges, runners and fasteners are part of the material palette too. They may not be photographed, but they carry the daily use of a room.",
        ],
      },
      {
        heading: "Let rooms breathe",
        paragraphs: [
          "Ventilation helps manage moisture, but the right solution depends on the room. Bathrooms need suitable extraction and a way for replacement air to enter. Deep cupboards against exterior walls may need a different detail from freestanding furniture.",
          "Keep maintenance access intentional. Filters need cleaning; pipe joints may need inspection. An interior that looks seamless but cannot be serviced trades a short-term photograph for a long-term inconvenience.",
        ],
      },
      {
        heading: "Choose finishes you can care for",
        paragraphs: [
          "Natural stone, timber and fabric all come with care requirements. Understand sealing schedules, suitable cleaners and what normal ageing looks like before committing. A honed surface is not automatically stain-proof, and a natural fibre is not automatically suitable for every damp room.",
          "Use material samples to compare touch, cleaning and repair, not just colour. In heavily used areas, a replaceable or repairable component may be more valuable than a flawless-looking finish that is difficult to restore.",
        ],
      },
      {
        heading: "A useful pre-monsoon check",
        paragraphs: [
          "Review window seals, visible cracks, drainage points and any recurring damp patches before the heavy rains. Keep a record of where problems occur and under which weather conditions. Share that record with the people assessing the source.",
          "Good material choices reduce avoidable problems; they do not make a home immune to weather. These notes are general design guidance. Persistent water ingress and structural concerns require an on-site assessment by qualified professionals.",
        ],
      },
    ],
  },
];
