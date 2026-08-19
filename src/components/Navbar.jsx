import { useEffect, useRef, useState } from "react";
import { productNav } from "../data/product.js";
import { LogoLockup } from "./ui.jsx";
import { ThemeToggleButton } from "./ui/skiper-ui/skiper26";
import { WaitlistButton } from "./Waitlist.jsx";
import { triggerOverdrive } from "../overdrive.js";

const links = [
  { href: "#analyzer", label: "Analyzer" },
  { href: "#specs", label: "Architecture" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [productOpen, setProductOpen] = useState(false);
  const productRef = useRef(null);
  const markClicks = useRef(0);
  const markTimer = useRef(0);

  useEffect(() => {
    const edge = document.getElementById("scroll-edge");
    if (!edge) return undefined;
    const io = new IntersectionObserver(([entry]) => setScrolled(!entry.isIntersecting), {
      threshold: 1,
    });
    io.observe(edge);
    return () => {
      io.disconnect();
      window.clearTimeout(markTimer.current);
    };
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    const onPointer = (event) => {
      if (!productRef.current?.contains(event.target)) setProductOpen(false);
    };
    const onKey = (event) => {
      if (event.key === "Escape") {
        setProductOpen(false);
        setOpen(false);
      }
    };
    window.addEventListener("pointerdown", onPointer);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("pointerdown", onPointer);
      window.removeEventListener("keydown", onKey);
    };
  }, []);

  return (
    <header className={`site-header ${scrolled || open ? "is-scrolled liquid-glass-nav" : ""} ${open ? "is-open" : ""}`}>
      <div className="page-shell flex h-[var(--header-height)] min-w-0 items-center justify-between gap-2 sm:gap-3">
        <a
          href="#top"
          aria-label="RepoPilot"
          className="-ml-2 flex min-h-11 min-w-0 items-center gap-2 rounded-6 px-2 sm:gap-3"
          onClick={(event) => {
            markClicks.current += 1;
            window.clearTimeout(markTimer.current);
            markTimer.current = window.setTimeout(() => {
              markClicks.current = 0;
            }, 1400);
            if (markClicks.current >= 7) {
              event.preventDefault();
              markClicks.current = 0;
              triggerOverdrive();
            }
          }}
        >
          <LogoLockup />
          <span className="version-pill hidden sm:inline-flex">v1.0-beta</span>
        </a>

        <nav className="hidden items-center gap-8 md:flex" aria-label="Primary">
          <div className="relative" ref={productRef}>
            <button
              type="button"
              className="nav-link"
              aria-expanded={productOpen}
              aria-haspopup="true"
              onClick={() => setProductOpen((value) => !value)}
            >
              Product
              <svg width="10" height="10" viewBox="0 0 10 10" fill="currentColor" aria-hidden="true">
                <path d="M2.1 3.4 5 6.3l2.9-2.9" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
              </svg>
            </button>
            {productOpen && (
              <div className="nav-dropdown" role="menu">
                {productNav.map((item) => (
                  <a
                    key={item.href}
                    href={item.href}
                    role="menuitem"
                    onClick={() => setProductOpen(false)}
                  >
                    <span className="text-[13px] font-medium text-text-primary">{item.label}</span>
                    <span className="text-[12px] text-text-tertiary">{item.detail}</span>
                  </a>
                ))}
              </div>
            )}
          </div>
          {links.map((link) => (
            <a key={link.href} href={link.href} className="nav-link">
              {link.label}
            </a>
          ))}
        </nav>

        <div className="flex shrink-0 items-center gap-1 sm:gap-2">
          <ThemeToggleButton variant="circle" start="top-right" className="size-9 shrink-0 ring-1 ring-black/10 dark:ring-white/15" />
          <WaitlistButton className="btn-primary btn-compact hidden sm:inline-flex" />
          <button
            type="button"
            className="flex h-11 w-11 items-center justify-center rounded-6 text-text-secondary md:hidden"
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((value) => !value)}
          >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="currentColor" aria-hidden="true">
              {open ? (
                <>
                  <rect x="3" y="8.25" width="12" height="1.5" rx="0.75" transform="rotate(45 9 9)" />
                  <rect x="3" y="8.25" width="12" height="1.5" rx="0.75" transform="rotate(-45 9 9)" />
                </>
              ) : (
                <>
                  <rect x="3" y="5.5" width="12" height="1.5" rx="0.75" />
                  <rect x="3" y="11" width="12" height="1.5" rx="0.75" />
                </>
              )}
            </svg>
          </button>
        </div>
      </div>

      {open && (
        <div
          id="mobile-nav"
          className="max-h-[calc(100dvh-var(--header-height)-env(safe-area-inset-top,0px))] overflow-y-auto border-t border-border-header bg-surface-base px-4 pb-[max(1.5rem,env(safe-area-inset-bottom,0px))] pt-4 backdrop-blur md:hidden"
        >
          <nav className="flex flex-col gap-1" aria-label="Mobile">
            {productNav.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="flex min-h-11 flex-col justify-center rounded-6 px-3"
                onClick={() => setOpen(false)}
              >
                <span className="text-regular text-text-primary">{item.label}</span>
                <span className="text-mini text-text-tertiary">{item.detail}</span>
              </a>
            ))}
            {links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="flex min-h-11 items-center rounded-6 px-3 text-regular text-text-secondary"
                onClick={() => setOpen(false)}
              >
                {link.label}
              </a>
            ))}
            <WaitlistButton className="btn-primary mt-2 w-full" onClick={() => setOpen(false)} />
          </nav>
        </div>
      )}
    </header>
  );
}
