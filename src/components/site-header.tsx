"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const navigation = [
  { href: "/", label: "Home" },
  { href: "/library", label: "DSA Visual Library" },
  { href: "/patterns", label: "Problem-Solving Patterns" },
  { href: "/practice", label: "Problem Practice" },
  { href: "/progress", label: "My Progress" },
  { href: "/about", label: "About / Contribute" }
];

export function SiteHeader() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="siteHeader">
      <div className="headerInner">
        <Link className="brand" href="/" aria-label="Visual DSA home" onClick={() => setMenuOpen(false)}>
          <span className="brandMark" aria-hidden="true">
            v
          </span>
          <span>
            Visual DSA
            <span className="brandSub"> · learn by seeing</span>
          </span>
        </Link>
        <button
          className="navToggle"
          type="button"
          aria-expanded={menuOpen}
          aria-controls="primary-navigation"
          onClick={() => setMenuOpen((open) => !open)}
        >
          {menuOpen ? "Close menu" : "Explore"}
        </button>
        <nav
          id="primary-navigation"
          className={"siteNav" + (menuOpen ? " siteNavOpen" : "")}
          aria-label="Main navigation"
        >
          {navigation.map((item) => {
            const active =
              item.href === "/"
                ? pathname === "/"
                : pathname === item.href || pathname.startsWith(item.href + "/");
            return (
              <Link
                key={item.href}
                className={"navLink" + (active ? " navLinkActive" : "")}
                href={item.href}
                aria-current={active ? "page" : undefined}
                onClick={() => setMenuOpen(false)}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
