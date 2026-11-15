import React, { useState, useEffect, useRef } from "react";
import { Menu, X, Phone, ArrowRight } from "lucide-react";
import { mrkBusiness } from "../../config/business";
const links = [
  { label: "Home", path: "/" },
  { label: "Services", path: "/services" },
  { label: "Pricing", path: "/pricing" },
  { label: "Areas", path: "/service-areas" },
  { label: "About", path: "/about" },
  { label: "FAQs", path: "/faq" },
  { label: "Contact", path: "/contact" },
];
export const Header: React.FC<{
  currentPath: string;
  onNavigate: (path: string) => void;
}> = ({ currentPath, onNavigate }) => {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const toggle = useRef<HTMLButtonElement>(null);
  const drawer = useRef<HTMLDivElement>(null);
  useEffect(() => {
    setOpen(false);
  }, [currentPath]);
  useEffect(() => {
    const scroll = () => setScrolled(window.scrollY > 24);
    scroll();
    window.addEventListener("scroll", scroll, { passive: true });
    return () => window.removeEventListener("scroll", scroll);
  }, []);
  useEffect(() => {
    if (!open) return;
    const escape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        toggle.current?.focus();
      }
    };
    const closeOutside = (event: PointerEvent) => {
      if (
        !drawer.current?.contains(event.target as Node) &&
        !toggle.current?.contains(event.target as Node)
      )
        setOpen(false);
    };
    window.addEventListener("keydown", escape);
    window.addEventListener("pointerdown", closeOutside);
    return () => {
      window.removeEventListener("keydown", escape);
      window.removeEventListener("pointerdown", closeOutside);
    };
  }, [open]);
  const go = (path: string) => (event: React.MouseEvent<HTMLAnchorElement>) => {
    if (
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey ||
      event.button !== 0
    )
      return;
    event.preventDefault();
    setOpen(false);
    onNavigate(path);
  };
  return (
    <header
      className={`cinema-header ${currentPath === "/" ? "over-hero" : "inner-header"} ${scrolled || open ? "header-solid" : ""}`}
    >
      <div className="cinema-wrap header-row">
        <a className="header-brand" href="/" onClick={go("/")}>
          <img
            src={mrkBusiness.brandAssets.logoWordmark}
            alt="MRK Removals Adelaide"
            width="720"
            height="251"
          />
        </a>
        <nav className="desktop-nav" aria-label="Primary Navigation">
          {links.map((item) => (
            <a
              key={item.path}
              href={item.path}
              onClick={go(item.path)}
              aria-current={currentPath === item.path ? "page" : undefined}
            >
              {item.label}
            </a>
          ))}
        </nav>
        <div className="header-actions">
          <a
            className="header-phone"
            href={mrkBusiness.phoneHref}
            aria-label={`Call ${mrkBusiness.phoneDisplay}`}
          >
            <Phone size={17} />
            <span>{mrkBusiness.phoneDisplay}</span>
          </a>
          <a
            className="header-quote btn-ruby"
            href="/quote"
            onClick={go("/quote")}
          >
            <span className="quote-long">Request </span>Quote{" "}
            <ArrowRight size={16} />
          </a>
          <button
            ref={toggle}
            className="menu-toggle"
            type="button"
            onClick={() => setOpen(!open)}
            aria-expanded={open}
            aria-controls="mrk-mobile-drawer"
            aria-label={open ? "Close navigation menu" : "Open navigation menu"}
          >
            {open ? <X /> : <Menu />}
          </button>
        </div>
      </div>
      <div
        id="mrk-mobile-drawer"
        ref={drawer}
        className={`cinema-drawer ${open ? "drawer-open" : ""}`}
        inert={!open}
      >
        <nav aria-label="Mobile Navigation Links">
          {links.map((item) => (
            <a
              key={item.path}
              href={item.path}
              onClick={go(item.path)}
              aria-current={currentPath === item.path ? "page" : undefined}
            >
              {item.label}
              <ArrowRight size={18} />
            </a>
          ))}
          <a href={mrkBusiness.phoneHref}>
            <Phone size={18} />
            Call {mrkBusiness.phoneDisplay}
          </a>
        </nav>
      </div>
    </header>
  );
};
