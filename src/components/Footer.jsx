import { Magnetic, Reveal } from "./effects.jsx";
import { LogoLockup } from "./ui.jsx";
import { WaitlistButton } from "./Waitlist.jsx";

const product = [
  { href: "#analyzer", label: "Analyzer" },
  { href: "#specs", label: "Architecture" },
  { href: "#review", label: "Review" },
];

const platform = [
  { href: "#understand", label: "Ask RepoPilot" },
  { href: "#impact", label: "Impact" },
  { href: "#workflow", label: "GitHub Checks" },
];

const resources = [
  { href: "#capabilities", label: "Platform" },
  { href: "#history", label: "Hotspots" },
  { href: "#graph", label: "Graph" },
];

export default function Footer() {
  const year = new Date().getFullYear();

  const share = async () => {
    const url = window.location.href;
    try {
      if (navigator.share) {
        await navigator.share({ title: "RepoPilot", url });
        return;
      }
    } catch {
      /* user cancelled share */
    }
    try {
      await navigator.clipboard.writeText(url);
    } catch {
      /* clipboard unavailable */
    }
  };

  return (
    <section className="site-footer relative z-[2] border-t border-border-subtle">
      <div className="page-shell">
        <Reveal className="flex flex-col items-start justify-between gap-8 md:flex-row md:items-end">
          <div className="max-w-xl">
            <h2 className="cta-headline">Join the waitlist</h2>
            <p className="mt-6 text-xl leading-relaxed text-text-secondary">
              We’ll write when a small number of teams can run the local graph. No drip campaign.
            </p>
          </div>
          <Magnetic>
            <WaitlistButton className="btn-primary btn-hero whitespace-nowrap" />
          </Magnetic>
        </Reveal>

        <Reveal delay={0.12}>
        <footer className="mt-24 grid grid-cols-1 gap-12 border-t border-border-subtle pt-16 md:grid-cols-12 md:gap-8">
          <div className="flex flex-col gap-6 md:col-span-4">
            <a href="#top" className="inline-flex w-fit items-center">
              <LogoLockup />
            </a>
            <p className="max-w-xs text-base leading-relaxed text-text-tertiary">
              The intelligence layer for modern engineering teams. Understand, analyze, and ship with
              confidence.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-12 sm:grid-cols-3 md:col-span-8 md:gap-8">
            <FooterCol title="Product" items={product} />
            <FooterCol title="Platform" items={platform} />
            <FooterCol title="Resources" items={resources} />
          </div>

          <div className="mt-8 flex flex-col items-start justify-between gap-6 border-t border-border-subtle pt-8 md:col-span-12 md:mt-20 md:flex-row md:items-center">
            <span className="font-mono text-xs text-text-quaternary">Local graph. Demo fixture.</span>
            <div className="flex items-center gap-6">
              <button
                type="button"
                className="text-text-tertiary transition-colors hover:text-text-primary"
                aria-label="Share this page"
                onClick={share}
              >
                <ShareIcon />
              </button>
              <span className="font-mono text-xs text-text-tertiary">
                © {year} RepoPilot Intelligence
              </span>
            </div>
          </div>
        </footer>
        </Reveal>
      </div>
    </section>
  );
}

function FooterCol({ title, items }) {
  return (
    <div className="flex flex-col gap-6">
      <h3 className="font-mono text-xs font-medium uppercase tracking-[0.2em] text-text-tertiary">
        {title}
      </h3>
      <nav className="flex flex-col gap-4" aria-label={title}>
        {items.map((item) => (
          <a
            key={`${item.href}-${item.label}`}
            href={item.href}
            className="text-base text-text-primary transition-colors hover:text-text-secondary"
          >
            {item.label}
          </a>
        ))}
      </nav>
    </div>
  );
}

function ShareIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M4 12v7a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-7"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M12 4v12M8 8l4-4 4 4"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
