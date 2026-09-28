import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { navigation, site } from "@/lib/site";
export function Footer() {
  return (
    <footer className="site-footer shell">
      <div className="footer-top">
        <div>
          <Link href="/" className="footer-name">
            The Long View<span>.</span>
          </Link>
          <p>Research & essays by Khushal Dangar.</p>
        </div>
        <nav aria-label="Footer navigation">
          {navigation.map((item) => (
            <Link key={item.href} href={item.href}>
              {item.label}
            </Link>
          ))}
          {site.social.map((item) => (
            <a
              key={item.label}
              href={item.href}
              target="_blank"
              rel="noreferrer"
            >
              {item.label}
              <ArrowUpRight size={13} />
            </a>
          ))}
        </nav>
      </div>
      <div className="footer-bottom">
        <p>
          For educational and informational purposes only. Nothing published
          here constitutes investment advice.
        </p>
        <span>© {new Date().getFullYear()} Khushal Dangar</span>
      </div>
    </footer>
  );
}
