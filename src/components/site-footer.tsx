import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="siteFooter">
      <div className="footerInner">
        <div>
          <strong>Visual DSA</strong>
          <span> · Open learning, built together.</span>
        </div>
        <nav className="footerLinks" aria-label="Footer navigation">
          <Link href="/patterns">Patterns</Link>
          <Link href="/about">Contribute</Link>
        </nav>
      </div>
    </footer>
  );
}
