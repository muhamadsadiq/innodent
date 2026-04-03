export const siteConfig = {
  name: "InnoDent",
  description:
    "Professional dental products and equipment catalogs from InnoDent, including restorative materials, endodontics, and orthodontics solutions.",
  url: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
  ogImage: "/hero-popup.png",
  links: {
    twitter: "https://twitter.com/innodent",
    github: "https://github.com/innodent",
  },
  creator: "InnoDent Team",
  keywords: [
    "dental products",
    "dental equipment",
    "restorative materials",
    "endodontics",
    "orthodontics",
    "InnoDent",
  ],
} as const;
