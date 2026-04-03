// prisma/seed.ts
import { PrismaClient } from "@prisma/client";
// import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  // // Create demo users
  // const hashedPassword = await bcrypt.hash("password123", 10);
  //
  // await prisma.user.upsert({
  //   where: { email: "superadmin@innodent.com" },
  //   update: {},
  //   create: {
  //     email: "superadmin@innodent.com",
  //     password: hashedPassword,
  //     name: "Super Admin",
  //     role: "SUPER_ADMIN",
  //     isActive: true,
  //   },
  // });
  //
  // await prisma.user.upsert({
  //   where: { email: "admin@innodent.com" },
  //   update: {},
  //   create: {
  //     email: "admin@innodent.com",
  //     password: hashedPassword,
  //     name: "Admin User",
  //     role: "ADMIN",
  //     isActive: true,
  //   },
  // });
  //
  // console.log("✅ Demo users created!");
  //
  // // Create catalogs
  // const catalog1 = await prisma.catalog.upsert({
  //   where: { name: "Catalog 1" },
  //   update: {},
  //   create: { name: "Catalog 1" },
  // });
  //
  // const catalog2 = await prisma.catalog.upsert({
  //   where: { name: "Catalog 2" },
  //   update: {},
  //   create: { name: "Catalog 2" },
  // });
  //
  // const catalog3 = await prisma.catalog.upsert({
  //   where: { name: "Catalog 3" },
  //   update: {},
  //   create: { name: "Catalog 3" },
  // });

  // Create categories with color palettes
  // const restorativeMaterials =
    await prisma.category.upsert({
    where: { name: "Restorative Materials" },
    update: {},
    create: {
      name: "Restorative Materials",
      bgColor: "var(--color-deep-blue)",
      borderColor: "var(--color-sky-tint)",
      borderHoverColor: "var(--color-deep-blue)",
      titleColor: "var(--color-blue)",
      titleBgColor: "var(--color-sky-blue)",
      chipBorderColor: "var(--color-deep-blue)",
      chipTextColor: "var(--color-sky-blue)",
      imageBorderColor: "var(--color-muted-teal)",
    },
  });

  // const endodontics =
    await prisma.category.upsert({
    where: { name: "Endodontics" },
    update: {},
    create: {
      name: "Endodontics",
      bgColor: "var(--color-moss-green)",
      borderColor: "var(--color-muted-sage)",
      borderHoverColor: "var(--color-moss-green)",
      titleColor: "var(--color-sage)",
      titleBgColor: "var(--color-sage)",
      chipBorderColor: "var(--color-deep-sage)",
      chipTextColor: "var(--color-sage)",
      imageBorderColor: "var(--color-muted-sage)",
    },
  });

  // const orthodontics =
    await prisma.category.upsert({
    where: { name: "Orthodontics" },
    update: {},
    create: {
      name: "Orthodontics",
      bgColor: "var(--color-deep-indigo)",
      borderColor: "var(--color-muted-lavender)",
      borderHoverColor: "var(--color-deep-indigo)",
      titleColor: "var(--color-lavender)",
      titleBgColor: "var(--color-lavender)",
      chipBorderColor: "var(--color-deep-lavender)",
      chipTextColor: "var(--color-lavender)",
      imageBorderColor: "var(--color-muted-lavender)",
    },
  });
  //
  // // Create products for Catalog 1: Restorative Materials
  // await prisma.product.create({
  //   data: {
  //     name: "Composite Restoration Kit A1",
  //     catalogId: catalog1.id,
  //     categoryId: restorativeMaterials.id,
  //     shortDescription:
  //       "Universal composite kit for anterior and posterior restorations.",
  //     description:
  //       "High-polish, low-shrinkage composite set designed for everyday restorative workflows.",
  //     features: JSON.stringify(["Low shrinkage", "High polish", "Easy shade matching"]),
  //     component: "1g x 2pcs",
  //     shades: JSON.stringify(["A1", "A2", "A3", "A3.5", "B2"]),
  //     image: "/product.png",
  //     isBestSeller: true,
  //   },
  // });
  //
  // await prisma.product.create({
  //   data: {
  //     name: "Bonding Prime Plus",
  //     catalogId: catalog1.id,
  //     categoryId: restorativeMaterials.id,
  //     shortDescription: "One-bottle adhesive system with consistent bond strength.",
  //     description: "Reliable adhesive for enamel and dentin with quick application protocol.",
  //     features: JSON.stringify(["One bottle", "Fast cure", "Strong bond"]),
  //     component: "1g x 2pcs",
  //     shades: JSON.stringify(["A1", "A2", "A3", "A3.5", "B2"]),
  //     image: "/product.png",
  //   },
  // });
  //
  // await prisma.product.create({
  //   data: {
  //     name: "Flow Liner Nano",
  //     catalogId: catalog1.id,
  //     categoryId: restorativeMaterials.id,
  //     shortDescription:
  //       "Flowable liner with optimized viscosity and adaptation.",
  //     description:
  //       "Nanofilled flowable liner for base/liner applications in class I and II restorations.",
  //     features: JSON.stringify(["Great adaptation", "Low viscosity", "Radiopaque"]),
  //     component: "1g x 2pcs",
  //     shades: JSON.stringify(["A1", "A2", "A3", "A3.5", "B2"]),
  //     image: "/product.png",
  //     isNew: true,
  //   },
  // });
  //
  // // Create products for Catalog 1: Endodontics
  // await prisma.product.create({
  //   data: {
  //     name: "Rotary File Set Pro",
  //     catalogId: catalog1.id,
  //     categoryId: endodontics.id,
  //     shortDescription: "NiTi rotary files for efficient shaping.",
  //     description:
  //       "Heat-treated NiTi files with improved flexibility and fatigue resistance.",
  //     features: JSON.stringify(["Heat treated", "Flexible", "Efficient shaping"]),
  //     component: "Assorted pack x 1 set",
  //     image: "/product.png",
  //   },
  // });
  //
  // await prisma.product.create({
  //   data: {
  //     name: "Irrigation Needle SafeTip",
  //     catalogId: catalog1.id,
  //     categoryId: endodontics.id,
  //     shortDescription: "Side-vented irrigation needle for safer canal cleaning.",
  //     description:
  //       "Designed to reduce apical pressure while improving irrigation reach.",
  //     features: JSON.stringify(["Side vent", "Safe flow", "Smooth insertion"]),
  //     component: "Assorted pack x 1 set",
  //     image: "/product.png",
  //   },
  // });
  //
  // // Create products for Catalog 1: Orthodontics
  // await prisma.product.create({
  //   data: {
  //     name: "Bracket Bond Gel",
  //     catalogId: catalog1.id,
  //     categoryId: orthodontics.id,
  //     shortDescription: "Light-cure adhesive gel for bracket placement.",
  //     description: "Precise bracket positioning with stable bond and easy cleanup.",
  //     features: JSON.stringify(["No slump", "Strong bond", "Easy cleanup"]),
  //     component: "Starter kit x 1 set",
  //     image: "/product.png",
  //   },
  // });
  //
  // await prisma.product.create({
  //   data: {
  //     name: "Archwire Flex Series",
  //     catalogId: catalog1.id,
  //     categoryId: orthodontics.id,
  //     shortDescription: "Progressive wire set for alignment stages.",
  //     description:
  //       "Sequence of orthodontic wires optimized for controlled tooth movement.",
  //     features: JSON.stringify(["Multi-stage set", "Consistent force", "High resilience"]),
  //     component: "Starter kit x 1 set",
  //     image: "/product.png",
  //   },
  // });
  //
  // await prisma.product.create({
  //   data: {
  //     name: "Elastic Pack Comfort",
  //     catalogId: catalog1.id,
  //     categoryId: orthodontics.id,
  //     shortDescription: "Orthodontic elastics with stable force profile.",
  //     description: "Patient-friendly elastics for daily wear and consistent traction.",
  //     features: JSON.stringify(["Comfort fit", "Stable force", "Color options"]),
  //     component: "Starter kit x 1 set",
  //     image: "/product.png",
  //   },
  // });
  //
  // // Create products for Catalog 2 (no categories)
  // await prisma.product.create({
  //   data: {
  //     name: "Matrix System Compact",
  //     catalogId: catalog2.id,
  //     shortDescription: "Sectional matrix system for predictable contacts.",
  //     description:
  //       "Compact matrix set for posterior restorations and tight contact points.",
  //     features: JSON.stringify(["Easy placement", "Tight contacts", "Reusable rings"]),
  //     component: "1 set",
  //     image: "/product.png",
  //   },
  // });
  //
  // await prisma.product.create({
  //   data: {
  //     name: "Obturation Kit Thermo",
  //     catalogId: catalog2.id,
  //     shortDescription: "Complete warm obturation setup for canal filling.",
  //     description:
  //       "Streamlined obturation workflow with controlled heat and precision tips.",
  //     features: JSON.stringify(["Controlled heat", "Complete kit", "Fast workflow"]),
  //     component: "1 set",
  //     image: "/product.png",
  //     isBestSeller: true,
  //   },
  // });
  //
  // await prisma.product.create({
  //   data: {
  //     name: "Retainer Finishing Kit",
  //     catalogId: catalog2.id,
  //     shortDescription: "Finishing kit for retainer fabrication and fit.",
  //     description: "Tools and consumables for efficient final retainer delivery.",
  //     features: JSON.stringify(["Finishing tools", "Reliable fit", "Clinic ready"]),
  //     component: "1 set",
  //     image: "/product.png",
  //   },
  // });
  //
  // await prisma.product.create({
  //   data: {
  //     name: "Polishing Disc Kit Pro",
  //     catalogId: catalog2.id,
  //     shortDescription:
  //       "Multi-grit polishing discs for smooth, glossy restorative finishes.",
  //     description:
  //       "Color-coded polishing sequence for efficient contouring and final shine.",
  //     features: JSON.stringify(["Multi-grit", "Color coded", "High gloss finish"]),
  //     component: "1 set",
  //     image: "/product.png",
  //   },
  // });
  //
  // // Create products for Catalog 3 (no categories)
  // await prisma.product.create({
  //   data: {
  //     name: "Shade Guide Digital Match",
  //     catalogId: catalog3.id,
  //     shortDescription: "Shade guide system for restorative planning.",
  //     description:
  //       "Improves shade communication and consistency in restorative cases.",
  //     features: JSON.stringify(["Accurate matching", "Durable tabs", "Simple workflow"]),
  //     component: "1 set",
  //     image: "/product.png",
  //   },
  // });
  //
  // await prisma.product.create({
  //   data: {
  //     name: "Apex Locator Smart",
  //     catalogId: catalog3.id,
  //     shortDescription: "Real-time working length locator for root canal procedures.",
  //     description: "Compact apex locator with stable measurement and clear display.",
  //     features: JSON.stringify(["Real-time reading", "Compact device", "Clear screen"]),
  //     component: "1 set",
  //     image: "/product.png",
  //   },
  // });
  //
  // await prisma.product.create({
  //   data: {
  //     name: "Ortho Prime Adhesive",
  //     catalogId: catalog3.id,
  //     shortDescription: "Orthodontic adhesive primer with strong initial tack.",
  //     description: "Designed for consistent bracket bonding with simplified steps.",
  //     features: JSON.stringify(["Strong tack", "Fast protocol", "Reliable bond"]),
  //     component: "1 set",
  //     image: "/product.png",
  //     isBestSeller: true,
  //   },
  // });
  //
  // await prisma.product.create({
  //   data: {
  //     name: "Bioceramic Sealer One",
  //     catalogId: catalog3.id,
  //     shortDescription:
  //       "Premixed bioceramic sealer for durable and biocompatible obturation.",
  //     description:
  //       "Flow-optimized root canal sealer with stable set and excellent sealing performance.",
  //     features: JSON.stringify(["Premixed", "Biocompatible", "Strong seal"]),
  //     component: "1 set",
  //     image: "/product.png",
  //   },
  // });
  //
  // console.log("✅ Database seeded successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

