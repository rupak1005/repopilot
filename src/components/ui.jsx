import { useRef } from "react";

export function LogoMark({ className = "h-6 w-6" }) {
  return (
    <svg
      className={`shrink-0 text-text-primary ${className}`}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <rect x="3" y="3" width="5.2" height="5.2" rx="1" />
      <rect x="9.4" y="3" width="5.2" height="5.2" rx="1" />
      <rect x="15.8" y="3" width="5.2" height="5.2" rx="1" />
      <rect x="3" y="9.4" width="5.2" height="5.2" rx="1" />
      <rect x="9.4" y="9.4" width="5.2" height="5.2" rx="1" />
      <rect x="15.8" y="9.4" width="5.2" height="5.2" rx="1" />
      <rect x="3" y="15.8" width="5.2" height="5.2" rx="1" />
      <rect x="9.4" y="15.8" width="5.2" height="5.2" rx="1" />
      <rect x="15.8" y="15.8" width="5.2" height="5.2" rx="1" />
    </svg>
  );
}

export function LogoLockup({ className = "" }) {
  return (
    <span className={`inline-flex items-center gap-3 ${className}`}>
      <LogoMark className="h-6 w-6" />
      <span className="brand-wordmark">RepoPilot</span>
    </span>
  );
}

export function Grain() {
  return <div className="linear-grain" aria-hidden="true" />;
}

export function Avatar({ initials, color = "#5e6ad2", size = "w-[18px] h-[18px]" }) {
  return (
    <span className={`avatar ${size}`} style={{ background: color }} aria-hidden="true">
      {initials}
    </span>
  );
}

export function SectionHeader({ title, description, id }) {
  return (
    <div className="mb-10 max-w-[54ch] lg:mb-12">
      <h2 id={id} className="section-title">
        {title}
      </h2>
      {description ? (
        <p className="mt-4 text-regular text-text-secondary">{description}</p>
      ) : null}
    </div>
  );
}

export function ShineFrame({ children, className = "" }) {
  const ref = useRef(null);

  const onMove = (event) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    el.style.setProperty("--mask-x", `${event.clientX - rect.left}px`);
    el.style.setProperty("--mask-y", `${event.clientY - rect.top}px`);
  };

  return (
    <div ref={ref} onMouseMove={onMove} className={`product-frame liquid-glass edge-highlight ${className}`}>
      <Grain />
      {children}
      <div className="product-shine" aria-hidden="true" />
    </div>
  );
}

export function SeverityPill({ value }) {
  const map = {
    High: "text-status-red border-status-red/35",
    Medium: "text-status-orange border-status-orange/35",
    Low: "text-status-green border-status-green/35",
    WARN: "text-status-orange border-status-orange/35",
    PASS: "text-status-green border-status-green/35",
    FAIL: "text-status-red border-status-red/35",
    INCOMPLETE: "text-text-tertiary border-border-subtle",
    RUNNING: "text-brand-link border-brand/35",
  };
  return (
    <span className={`rounded-4 border px-2 py-0.5 font-mono text-micro ${map[value] ?? "text-text-tertiary border-border-subtle"}`}>
      {value}
    </span>
  );
}
