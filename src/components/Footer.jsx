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

const social = [
  { href: "https://github.com/rupak1005", label: "GitHub", icon: "github", external: true },
  { href: "https://www.linkedin.com/in/rupak1005/", label: "LinkedIn", icon: "linkedin", external: true },
  { href: "https://rupak1005.vercel.app/", label: "Work", icon: "work", external: true },
  { href: "mailto:rupak1005saini@gmail.com", label: "rupak1005saini@gmail.com", icon: "mail", ariaLabel: "Email" },
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
        <Reveal className="flex w-full min-w-0 flex-col items-start justify-between gap-6 md:flex-row md:items-end md:gap-8">
          <div className="max-w-xl">
            <h2 className="cta-headline">Join the waitlist</h2>
            <p className="mt-4 text-base leading-relaxed text-text-secondary sm:mt-6 sm:text-xl">
              We’ll write when a small number of teams can run the local graph. No drip campaign.
            </p>
          </div>
          <Magnetic className="w-full md:w-auto">
            <WaitlistButton className="btn-primary btn-hero w-full md:w-auto" />
          </Magnetic>
        </Reveal>

        <Reveal delay={0.12}>
        <footer className="mt-16 grid grid-cols-1 gap-12 border-t border-border-subtle pt-12 md:mt-24 md:grid-cols-12 md:gap-8 md:pt-16">
          <div className="flex flex-col gap-6 md:col-span-4">
            <a href="#top" className="inline-flex w-fit items-center">
              <LogoLockup />
            </a>
            <p className="max-w-xs text-base leading-relaxed text-text-tertiary">
              The intelligence layer for modern engineering teams. Understand, analyze, and ship with
              confidence.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-4 md:col-span-8 md:gap-8">
            <FooterCol title="Product" items={product} />
            <FooterCol title="Platform" items={platform} />
            <FooterCol title="Resources" items={resources} />
            <FooterCol title="Connect" items={social} />
          </div>

          <div className="mt-8 flex w-full min-w-0 flex-col items-start justify-between gap-6 border-t border-border-subtle pt-8 md:col-span-12 md:mt-20 md:flex-row md:items-center">
            <span className="font-mono text-xs text-text-quaternary">Local graph. Demo fixture.</span>
            <div className="flex flex-wrap items-center gap-5">
              {social.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className="text-text-tertiary transition-colors hover:text-text-primary"
                  aria-label={item.ariaLabel ?? item.label}
                  {...(item.external
                    ? { target: "_blank", rel: "noopener noreferrer" }
                    : {})}
                >
                  <SocialIcon name={item.icon} />
                </a>
              ))}
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
            className={`text-base text-text-primary transition-colors hover:text-text-secondary${
              item.href.startsWith("mailto:") ? " break-all" : ""
            }`}
            {...(item.external
              ? { target: "_blank", rel: "noopener noreferrer" }
              : {})}
          >
            {item.label}
          </a>
        ))}
      </nav>
    </div>
  );
}

function SocialIcon({ name }) {
  if (name === "github") return <GitHubIcon />;
  if (name === "linkedin") return <LinkedInIcon />;
  if (name === "work") return <WorkIcon />;
  if (name === "mail") return <MailIcon />;
  return null;
}

function GitHubIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 2C6.48 2 2 6.58 2 12.26c0 4.52 2.87 8.35 6.84 9.71.5.1.68-.22.68-.49 0-.24-.01-.87-.01-1.71-2.78.62-3.37-1.37-3.37-1.37-.45-1.18-1.11-1.5-1.11-1.5-.91-.64.07-.63.07-.63 1 .07 1.53 1.06 1.53 1.06.89 1.57 2.34 1.12 2.91.86.09-.66.35-1.12.63-1.37-2.22-.26-4.56-1.14-4.56-5.07 0-1.12.39-2.03 1.03-2.75-.1-.26-.45-1.3.1-2.7 0 0 .84-.27 2.75 1.05A9.3 9.3 0 0 1 12 6.84c.85 0 1.71.12 2.51.35 1.9-1.32 2.74-1.05 2.74-1.05.55 1.4.2 2.44.1 2.7.64.72 1.03 1.63 1.03 2.75 0 3.94-2.34 4.81-4.57 5.06.36.32.68.95.68 1.92 0 1.38-.01 2.49-.01 2.83 0 .27.18.6.69.49A10.03 10.03 0 0 0 22 12.26C22 6.58 17.52 2 12 2Z" />
    </svg>
  );
}

function LinkedInIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M4.98 3.5C4.98 4.88 3.88 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1s2.48 1.12 2.48 2.5ZM.22 8.48h4.56V24H.22V8.48ZM8.34 8.48h4.37v2.12h.06c.61-1.16 2.1-2.38 4.32-2.38 4.62 0 5.47 3.04 5.47 7v8.78h-4.56v-7.78c0-1.86-.03-4.25-2.59-4.25-2.59 0-2.99 2.02-2.99 4.11V24H8.34V8.48Z" />
    </svg>
  );
}

function WorkIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M10 6H6a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-4"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M14 4h6v6M20 4 10 14"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function MailIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect
        x="3.5"
        y="5.5"
        width="17"
        height="13"
        rx="1.5"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path
        d="M4 7l8 6 8-6"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
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
