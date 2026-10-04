import { pageMetadata } from "@/lib/content/metadata";
export const metadata = pageMetadata("Privacy",
  "How The Long View handles site analytics, external links and reader data.", "/privacy/");
export default function Privacy() {
  return <div className="shell trust-page"><p className="eyebrow">READER PRIVACY</p><h1>Privacy</h1>
    <p className="trust-lead">This site does not offer accounts, comments or a newsletter signup. It does not ask you to submit personal financial information.</p>
    <h2>Reading preferences</h2><p>Your light or dark mode choice is saved in your browser’s local storage so it can be remembered on later visits. This preference stays on your device and is not sent to the site’s server. Until you make a choice, the site follows your system colour preference.</p>
    <h2>Analytics</h2><p>If Google Analytics is enabled by the site owner, it may collect usage information such as pages visited, approximate location, device type and referral source using cookies or similar identifiers. The site owner should review the applicable consent and disclosure requirements before enabling it. If no analytics ID is configured, this site does not load Google Analytics.</p>
    <h2>External links</h2><p>Articles may link to filings, reports and other third-party websites. Their own privacy practices apply when you visit them.</p>
    <h2>Contact</h2><p>Privacy questions can be sent through <a href="https://www.linkedin.com/in/khushaldangar/" target="_blank" rel="noopener noreferrer">Khushal Dangar’s LinkedIn profile</a>.</p>
  </div>;
}
