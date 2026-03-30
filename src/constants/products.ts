import { Product } from "@/types";

const baseProducts: Omit<Product, "component" | "shades">[] = [
  // Catalog 1: Restorative Materials (6)
  {
    id: "c1-rm-1",
    slug: "c1-restorative-composite-kit",
    name: "Composite Restoration Kit A1",
    catalog: "Catalog 1",
    category: "Restorative Materials",
    shortDescription: "Universal composite kit for anterior and posterior restorations.",
    description: "High-polish, low-shrinkage composite set designed for everyday restorative workflows.",
    features: ["Low shrinkage", "High polish", "Easy shade matching"],
    image: "/product.png",
  },
  {
    id: "c1-rm-2",
    slug: "c1-restorative-bonding-prime",
    name: "Bonding Prime Plus",
    catalog: "Catalog 1",
    category: "Restorative Materials",
    shortDescription: "One-bottle adhesive system with consistent bond strength.",
    description: "Reliable adhesive for enamel and dentin with quick application protocol.",
    features: ["One bottle", "Fast cure", "Strong bond"],
    image: "/product.png",
  },
  {
    id: "c1-rm-3",
    slug: "c1-restorative-liner-flow",
    name: "Flow Liner Nano",
    catalog: "Catalog 1",
    category: "Restorative Materials",
    shortDescription: "Flowable liner with optimized viscosity and adaptation.",
    description: "Nanofilled flowable liner for base/liner applications in class I and II restorations.",
    features: ["Great adaptation", "Low viscosity", "Radiopaque"],
    image: "/product.png",
  },
  {
    id: "c1-rm-4",
    slug: "c1-restorative-seal-shield",
    name: "Seal Shield Fissure",
    catalog: "Catalog 1",
    category: "Restorative Materials",
    shortDescription: "Light-cure sealant for fissure protection.",
    description: "Durable fissure sealant with stable retention and easy handling.",
    features: ["Quick light cure", "High retention", "Smooth handling"],
    image: "/product.png",
  },
  {
    id: "c1-rm-5",
    slug: "c1-restorative-cement-smart",
    name: "Smart Luting Cement",
    catalog: "Catalog 1",
    category: "Restorative Materials",
    shortDescription: "Dual-cure resin cement for crowns and bridges.",
    description: "Versatile luting cement with predictable curing and strong retention.",
    features: ["Dual cure", "Strong retention", "Simple cleanup"],
    image: "/product.png",
  },

  // Catalog 1: Endodontics (2)
  {
    id: "c1-en-1",
    slug: "c1-endo-rotary-file-set",
    name: "Rotary File Set Pro",
    catalog: "Catalog 1",
    category: "Endodontics",
    shortDescription: "NiTi rotary files for efficient shaping.",
    description: "Heat-treated NiTi files with improved flexibility and fatigue resistance.",
    features: ["Heat treated", "Flexible", "Efficient shaping"],
    image: "/product.png",
  },
  {
    id: "c1-en-2",
    slug: "c1-endo-irrigation-needle",
    name: "Irrigation Needle SafeTip",
    catalog: "Catalog 1",
    category: "Endodontics",
    shortDescription: "Side-vented irrigation needle for safer canal cleaning.",
    description: "Designed to reduce apical pressure while improving irrigation reach.",
    features: ["Side vent", "Safe flow", "Smooth insertion"],
    image: "/product.png",
  },

  // Catalog 1: Orthodontics (3)
  {
    id: "c1-or-1",
    slug: "c1-ortho-bracket-bond",
    name: "Bracket Bond Gel",
    catalog: "Catalog 1",
    category: "Orthodontics",
    shortDescription: "Light-cure adhesive gel for bracket placement.",
    description: "Precise bracket positioning with stable bond and easy cleanup.",
    features: ["No slump", "Strong bond", "Easy cleanup"],
    image: "/product.png",
  },
  {
    id: "c1-or-2",
    slug: "c1-ortho-archwire-flex",
    name: "Archwire Flex Series",
    catalog: "Catalog 1",
    category: "Orthodontics",
    shortDescription: "Progressive wire set for alignment stages.",
    description: "Sequence of orthodontic wires optimized for controlled tooth movement.",
    features: ["Multi-stage set", "Consistent force", "High resilience"],
    image: "/product.png",
  },
  {
    id: "c1-or-3",
    slug: "c1-ortho-elastic-pack",
    name: "Elastic Pack Comfort",
    catalog: "Catalog 1",
    category: "Orthodontics",
    shortDescription: "Orthodontic elastics with stable force profile.",
    description: "Patient-friendly elastics for daily wear and consistent traction.",
    features: ["Comfort fit", "Stable force", "Color options"],
    image: "/product.png",
  },

  // Catalog 2 (4 products, no categories)
  {
    id: "c2-1",
    slug: "c2-restorative-matrix-system",
    name: "Matrix System Compact",
    catalog: "Catalog 2",
    category: "",
    shortDescription: "Sectional matrix system for predictable contacts.",
    description: "Compact matrix set for posterior restorations and tight contact points.",
    features: ["Easy placement", "Tight contacts", "Reusable rings"],
    image: "/product.png",
  },
  {
    id: "c2-2",
    slug: "c2-endo-obturation-kit",
    name: "Obturation Kit Thermo",
    catalog: "Catalog 2",
    category: "",
    shortDescription: "Complete warm obturation setup for canal filling.",
    description: "Streamlined obturation workflow with controlled heat and precision tips.",
    features: ["Controlled heat", "Complete kit", "Fast workflow"],
    image: "/product.png",
  },
  {
    id: "c2-3",
    slug: "c2-ortho-retainer-kit",
    name: "Retainer Finishing Kit",
    catalog: "Catalog 2",
    category: "",
    shortDescription: "Finishing kit for retainer fabrication and fit.",
    description: "Tools and consumables for efficient final retainer delivery.",
    features: ["Finishing tools", "Reliable fit", "Clinic ready"],
    image: "/product.png",
  },
  {
    id: "c2-4",
    slug: "c2-restorative-polishing-kit",
    name: "Polishing Disc Kit Pro",
    catalog: "Catalog 2",
    category: "",
    shortDescription: "Multi-grit polishing discs for smooth, glossy restorative finishes.",
    description: "Color-coded polishing sequence for efficient contouring and final shine.",
    features: ["Multi-grit", "Color coded", "High gloss finish"],
    image: "/product.png",
  },

  // Catalog 3 (4 products, no categories)
  {
    id: "c3-1",
    slug: "c3-restorative-shade-guide",
    name: "Shade Guide Digital Match",
    catalog: "Catalog 3",
    category: "",
    shortDescription: "Shade guide system for restorative planning.",
    description: "Improves shade communication and consistency in restorative cases.",
    features: ["Accurate matching", "Durable tabs", "Simple workflow"],
    image: "/product.png",
  },
  {
    id: "c3-2",
    slug: "c3-endo-apex-locator",
    name: "Apex Locator Smart",
    catalog: "Catalog 3",
    category: "",
    shortDescription: "Real-time working length locator for root canal procedures.",
    description: "Compact apex locator with stable measurement and clear display.",
    features: ["Real-time reading", "Compact device", "Clear screen"],
    image: "/product.png",
  },
  {
    id: "c3-3",
    slug: "c3-ortho-adhesive-prime",
    name: "Ortho Prime Adhesive",
    catalog: "Catalog 3",
    category: "",
    shortDescription: "Orthodontic adhesive primer with strong initial tack.",
    description: "Designed for consistent bracket bonding with simplified steps.",
    features: ["Strong tack", "Fast protocol", "Reliable bond"],
    image: "/product.png",
  },
  {
    id: "c3-4",
    slug: "c3-endo-sealer-bioceramic",
    name: "Bioceramic Sealer One",
    catalog: "Catalog 3",
    category: "",
    shortDescription: "Premixed bioceramic sealer for durable and biocompatible obturation.",
    description: "Flow-optimized root canal sealer with stable set and excellent sealing performance.",
    features: ["Premixed", "Biocompatible", "Strong seal"],
    image: "/product.png",
  },
];

const categoryDefaults: Record<string, { component: string; shades: string[] }> = {
  "Restorative Materials": {
    component: "1g x 2pcs",
    shades: ["A1", "A2", "A3", "A3.5", "B2"],
  },
  Endodontics: {
    component: "Assorted pack x 1 set",
    shades: [],
  },
  Orthodontics: {
    component: "Starter kit x 1 set",
    shades: [],
  },
  "": {
    component: "1 set",
    shades: [],
  },
};

type CategoryPalette = {
  bgColor: string;
  borderColor: string;
  borderHoverColor: string;
  titleColor: string;
};

const categoryPalettes: Record<string, CategoryPalette> = {
  "Restorative Materials": {
    bgColor: "var(--color-deep-blue)",
    borderColor: "var(--color-sky-tint)",
    borderHoverColor: "var(--color-deep-blue)",
    titleColor: "var(--color-blue)",
  },
  Endodontics: {
    bgColor: "var(--color-moss-green)",
    borderColor: "var(--color-muted-sage)",
    borderHoverColor: "var(--color-moss-green)",
    titleColor: "var(--color-sage)",
  },
  Orthodontics: {
    bgColor: "var(--color-deep-indigo)",
    borderColor: "var(--color-muted-lavender)",
    borderHoverColor: "var(--color-deep-indigo)",
    titleColor: "var(--color-lavender)",
  },
};

const defaultPalette: CategoryPalette = {
  bgColor: "var(--color-gray)",
  borderColor: "var(--color-muted-lavender)",
  borderHoverColor: "var(--color-gray)",
  titleColor: "var(--color-blue)",
};


export const products: Product[] = baseProducts.map((product) => {
  const defaults = categoryDefaults[product.category] ?? categoryDefaults[""];
  return {
    ...product,
    component: defaults.component,
    shades: defaults.shades,
  };
});

export const productCatalogs = ["Catalog 1", "Catalog 2", "Catalog 3"] as const;

