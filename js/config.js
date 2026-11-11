/**
 * OPLIORA PRIVATE LIMITED — Centralized Configuration
 * Single source of truth for company positioning, brand colors,
 * navigation structure, and public portfolio disclosure.
 */

export const CONFIG = {
  company: {
    name: "Opliora Private Limited",
    shortName: "Opliora",
    suffix: "Private Limited",
    brandStatement: "A Group of Businesses. One Vision.",
    positioning:
      "Opliora Private Limited is a diversified parent company with business interests across multiple industries.",
    supportingStatement:
      "Opliora Private Limited is focused on building businesses, creating opportunities and delivering meaningful value across industries.",
    established: "2026",
    legalEntity: "Private Limited Company",
    email: "oplioraprivatelimited@gmail.com",
    address: "Corporate Office, Opliora Private Limited",
  },

  theme: {
    opliora: {
      midnightNavy: "#0A1628",
      deepNavy: "#10213A",
      cyan: "#20C4E4",
      mint: "#67E6AE",
      white: "#FFFFFF",
      warmGrey: "#F4F5F7",
      darkGrey: "#1A2638",
    },
    feedo: {
      black: "#080808",
      darkCharcoal: "#121212",
      deepRed: "#8B1E1E",
      accentRed: "#C0392B",
      gold: "#D4A017",
      goldLight: "#F3C048",
      white: "#FFFFFF",
    },
  },

  navigation: [
    { label: "About", href: "#about" },
    { label: "Our Business", href: "#business" },
    { label: "Principles", href: "#principles" },
    { label: "Careers", href: "#careers" },
    { label: "Contact", href: "#contact" },
  ],

  hero: {
    tagline: "A Group of Businesses. One Vision.",
    headlinePart1: "Building Businesses.",
    headlinePart2: "Shaping Tomorrow.",
    description:
      "Opliora Private Limited is a diversified business group focused on building meaningful ventures and creating long-term value.",
    primaryCta: {
      label: "Explore Opliora",
      href: "#about",
    },
    secondaryCta: {
      label: "Discover Our Brand",
      href: "#business",
    },
  },

  about: {
    label: "About Opliora",
    headline: "Driven by Vision. Built for Tomorrow.",
    scenes: [
      {
        number: "01",
        stageName: "STAGE 1 — THE FOUNDATION",
        title: "The Parent Organization",
        lead: "Opliora Private Limited is a diversified parent company with a broad business outlook, an entrepreneurial mindset and an unwavering commitment to sustainable growth.",
        body: "We operate with the conviction that enduring enterprises are founded on strategic foresight, operational discipline, and the agility to navigate multiple market landscapes.",
      },
      {
        number: "02",
        stageName: "STAGE 2 — THE VISION",
        title: "Diversified Philosophy",
        lead: "An independent vision, multiple possibilities.",
        body: "Our multi-industry perspective allows us to identify synergies, nurture high-potential ventures, and deploy resources thoughtfully across diverse business activities without constraining potential.",
      },
      {
        number: "03",
        stageName: "STAGE 3 — THE FUTURE",
        title: "Long-Term Value Creation",
        lead: "Delivering meaningful value that endures across generations.",
        body: "Opliora Private Limited is focused on building businesses, creating opportunities and delivering meaningful value across industries.",
      },
    ],
    metadata: [
      { label: "Corporate Entity", value: "Private Limited" },
      { label: "Portfolio Model", value: "Diversified Group" },
      { label: "Strategic Focus", value: "Multi-Industry" },
    ],
  },

  marquee: [
    "BUILDING BUSINESSES",
    "CREATING OPPORTUNITIES",
    "DELIVERING VALUE",
    "SHAPING TOMORROW",
    "ONE VISION",
  ],

  featuredBrand: {
    name: "Feedo Delivery",
    brandPill: "Featured Brand",
    headline: "Discover Feedo Delivery.",
    subheading: "One of the brands within the Opliora ecosystem.",
    description:
      "Feedo Delivery is built to offer dependable, quality-driven delivery experiences. Combining operational efficiency with consumer-centric thinking, Feedo represents the Group's dedication to creating ventures that serve everyday essentials with speed and reliability.",
    confirmedServices: [
      "Operational efficiency & precision delivery infrastructure",
      "Customer-first service philosophy with rigorous quality standards",
      "Scalable delivery ecosystem engineered for long-term growth",
      "Technology-enabled dispatch coordination & order fulfillment",
    ],
    cta: {
      label: "Explore Feedo",
      href: "#feedo-details",
    },
    enquiryCta: {
      label: "Business Enquiries",
      href: "#contact",
    },
    ecosystemNote:
      "Opliora Private Limited's business interests extend across multiple industries. Additional ventures and brands operate confidentially within the Group's portfolio.",
  },

  principles: [
    {
      number: "01",
      title: "Innovation",
      icon: "lightbulb",
      summary: "Pioneering new standards across every venture.",
      description:
        "We pursue forward-thinking solutions and embrace new ideas that challenge convention and drive meaningful progress across every industry we enter.",
    },
    {
      number: "02",
      title: "Reliability",
      icon: "shield-check",
      summary: "Consistency as the bedrock of trust.",
      description:
        "Our businesses are built on discipline, integrity and a commitment to delivering on every promise — to customers, partners and community stakeholders.",
    },
    {
      number: "03",
      title: "Customer Focus",
      icon: "users",
      summary: "Every outcome measured by human value.",
      description:
        "Every strategic decision is guided by the needs and aspirations of the people we serve. Their everyday experience is the true benchmark of our success.",
    },
    {
      number: "04",
      title: "Sustainable Growth",
      icon: "trending-up",
      summary: "Building for decades, not fiscal quarters.",
      description:
        "We prioritize long-term resilience over temporary gains — nurturing ventures designed to grow responsibly and generate enduring value for the future.",
    },
  ],

  careers: {
    label: "Careers",
    headline: "Your Next Chapter Starts Here.",
    intro:
      "At Opliora Private Limited, exceptional people are the foundation of exceptional businesses. As a diversified group with interests across multiple industries, we offer career opportunities that extend beyond any single discipline.",
    contactEmail: "oplioraprivatelimited@gmail.com",
    workplaceHighlights: [
      {
        title: "Multi-Industry Exposure",
        icon: "layers",
        description:
          "Collaborate across diverse business verticals — from operations and strategy to marketing, finance and leadership — within a single parent organization.",
      },
      {
        title: "Growth-Oriented Culture",
        icon: "compass",
        description:
          "Thrive in an environment actively building, scaling, and nurturing ventures, where individual initiative directly shapes meaningful outcomes.",
      },
      {
        title: "Entrepreneurial Spirit",
        icon: "sparkles",
        description:
          "Experience the nimbleness of an entrepreneurial team paired with the solid foundation and long-term vision of a private limited group.",
      },
    ],
    timeline: [
      { step: "01", name: "Discover", desc: "Explore our multi-industry ecosystem and open disciplines." },
      { step: "02", name: "Apply", desc: "Send your credentials to oplioraprivatelimited@gmail.com." },
      { step: "03", name: "Interview", desc: "Engage in strategic discussions with group leadership." },
      { step: "04", name: "Join", desc: "Build businesses and shape tomorrow with Opliora Private Limited." },
    ],
  },

  contact: {
    label: "Get In Touch",
    headline: "Let's Build Something Meaningful.",
    subtitle:
      "Whether you are proposing a strategic partnership, presenting a business opportunity, or seeking a career within our diversified group, we welcome your communication.",
    corporateEmail: "oplioraprivatelimited@gmail.com",
    categories: [
      { id: "corporate", label: "Corporate Enquiries" },
      { id: "partnership", label: "Business Partnerships" },
      { id: "proposal", label: "Business Proposals" },
      { id: "career", label: "Career Enquiries" },
    ],
    closingMessage: "Building the future, together.",
  },
};
