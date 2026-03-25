export const siteConfig = {
  name: "InnoDent AI",
  description: "AI-Powered Dental Solutions",
  url: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
  ogImage: "/og-image.jpg",
  links: {
    twitter: "https://twitter.com/innodent",
    github: "https://github.com/innodent",
  },
  creator: "InnoDent AI Team",
} as const;

export type SiteConfig = typeof siteConfig;

