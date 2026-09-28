export const site = {
  name: "The Long View",
  author: "Khushal Dangar",
  description:
    "Independent research on businesses, markets, valuation and financial technology. Research and essays by Khushal Dangar.",
  url:
    process.env.NEXT_PUBLIC_SITE_URL ||
    "https://the-long-view-khushal.khushaldangar.chatgpt.site",
  social: [
    { label: "LinkedIn", href: process.env.NEXT_PUBLIC_LINKEDIN_URL },
    { label: "GitHub", href: process.env.NEXT_PUBLIC_GITHUB_URL },
  ].filter((link): link is { label: string; href: string } =>
    Boolean(link.href),
  ),
};
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
