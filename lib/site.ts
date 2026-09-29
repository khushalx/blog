export const site = {
  name: "The Long View",
  author: "Khushal Dangar",
  authorPath: "/author/khushal-dangar/",
  description:
    "Independent research on businesses, markets, valuation and financial technology. Research and essays by Khushal Dangar.",
  // Set NEXT_PUBLIC_SITE_URL to the public canonical origin before launch.
  url: (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000").replace(/\/$/, ""),
  social: [
    {
      label: "LinkedIn",
      href:
        process.env.NEXT_PUBLIC_LINKEDIN_URL ||
        "https://www.linkedin.com/in/khushaldangar/",
    },
    { label: "GitHub", href: process.env.NEXT_PUBLIC_GITHUB_URL },
  ].filter((link): link is { label: string; href: string } =>
    Boolean(link.href),
  ),
};
export function absoluteUrl(pathname: string) {
  return new URL(pathname, `${site.url}/`).href;
}
export const navigation = [
  { label: "Research", href: "/research" },
  { label: "Articles", href: "/articles" },
  { label: "About", href: "/about" },
];
export const sectors = [
  "Consumer",
  "Financials",
  "Technology",
  "Industrial",
  "Other",
] as const;
export const articleCategories = [
  "Markets",
  "Investing",
  "Valuation",
  "Business",
  "Economics",
  "FinTech",
  "Data",
] as const;
