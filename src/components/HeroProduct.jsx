import { useEffect, useState } from "react";
import { useReducedMotion } from "motion/react";
import { Avatar, SeverityPill, ShineFrame } from "./ui.jsx";

const NAV = [
  { id: "overview", label: "Overview" },
  { id: "ask", label: "Ask RepoPilot" },
  { id: "impact", label: "Impact" },
  { id: "reviews", label: "Reviews" },
  { id: "hotspots", label: "Hotspots" },
];

const ACTIVITY = [
  {
    id: 1,
    delay: 0,
    who: "maya",
    color: "#5e6ad2",
    time: "4 min ago",
    text: "Right now we show a spinner forever, which makes it look like auth disappeared…",
  },
  {
    id: 2,
    delay: 700,
    who: "RepoPilot",
    color: "#27a644",
    time: "2 min ago",
    text: "Connected to acme/api · graph v3. Examining VerifyBearerToken.",
  },
  {
    id: 3,
    delay: 1600,
    who: "think",
    time: "just now",
    text: "Walking callers and historical PRs",
  },
  {
    id: 4,
    delay: 2800,
    who: "RepoPilot",
    color: "#27a644",
    time: "just now",
    text: "11 callers · 7 packages · 3 tests. Largest path: CheckoutService → PaymentService → OrderService.",
  },
  {
    id: 5,
    delay: 4000,
    who: "finding",
    time: "just now",
    title: "API compatibility",
    severity: "Medium",
    text: "Claims.Plan is read by billing entitlements. Recurring in PR #142.",
  },
];

function Sidebar({ active, onSelect }) {
  const index = Math.max(0, NAV.findIndex((item) => item.id === active));

  return (
    <aside className="hero-sidebar">
      <div className="hero-sidebar-workspace">
        <span className="hero-sidebar-mark" aria-hidden="true">
          A
        </span>
        <div className="min-w-0">
          <p className="truncate text-[12px] font-medium text-text-primary sm:text-[13px]">acme/api</p>
          <p className="hidden truncate font-mono text-[11px] text-text-quaternary min-[420px]:block">
            graph v3 · local
          </p>
        </div>
      </div>
      <nav className="hero-sidebar-nav" aria-label="Product preview">
        <span className="hero-sidebar-pill" style={{ transform: `translateY(${index * 32}px)` }} />
        {NAV.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => onSelect(item.id)}
            className={`hero-sidebar-link${active === item.id ? " is-active" : ""}`}
          >
            {item.label}
          </button>
        ))}
      </nav>
    </aside>
  );
}

function OverviewView({ step }) {
  const visible = ACTIVITY.filter((item) => item.delay <= step);

  return (
    <div className="grid h-full min-h-0 min-w-0 lg:grid-cols-[minmax(0,1fr)_260px]">
      <div className="min-w-0 overflow-y-auto hide-scroll px-5 py-5 sm:px-8 sm:py-6">
        <div className="mb-5 flex flex-wrap items-center gap-2">
          <span className="font-mono text-mini text-text-tertiary">RP-184</span>
          <SeverityPill value="High" />
          <span className="rounded-4 border border-border-subtle px-2 py-0.5 font-mono text-micro text-text-tertiary">
            In review
          </span>
        </div>
        <h3 className="max-w-[34ch] text-[1.15rem] font-semibold leading-snug tracking-[-0.02em] text-text-primary sm:text-[1.35rem]">
          I’m about to modify this function. What should I know?
        </h3>
        <p className="mt-3 max-w-[52ch] text-small text-text-secondary">
          <code className="rounded-4 border border-border-subtle bg-surface-tint px-1.5 py-0.5 font-mono text-[12px] text-text-secondary">
            VerifyBearerToken
          </code>{" "}
          is the auth boundary. A claim or error-shape change fans out to every authenticated route.
        </p>

        <div className="mt-6">
          <p className="mb-3 text-mini text-text-quaternary">Activity</p>
          <ol className="relative space-y-3 border-l border-border-subtle pl-4">
            {visible.map((item, index) => (
              <li
                key={item.id}
                className="stagger-in"
                style={{ animationDelay: `${index * 40}ms` }}
              >
                {item.who === "think" ? (
                  <p className="thinking-text text-[13px]">
                    {item.text}
                    <span className="dots" />
                  </p>
                ) : item.who === "finding" ? (
                  <div className="rounded-6 border border-border-subtle bg-surface-elevated p-3">
                    <div className="mb-1 flex items-center gap-2">
                      <span className="text-mini font-medium text-text-primary">{item.title}</span>
                      <SeverityPill value={item.severity} />
                    </div>
                    <p className="text-mini text-text-tertiary">{item.text}</p>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <Avatar initials={item.who === "RepoPilot" ? "R" : "M"} color={item.color} />
                    <div className="min-w-0">
                      <p className="text-[12px] text-text-tertiary">
                        <span className="font-medium text-text-primary">{item.who}</span>
                        <span> · {item.time}</span>
                      </p>
                      <p className="mt-0.5 text-[13px] leading-5 text-text-secondary">{item.text}</p>
                    </div>
                  </div>
                )}
              </li>
            ))}
          </ol>
        </div>
      </div>

      <aside className="hidden border-l border-border-subtle bg-surface-rail px-5 py-5 text-[13px] lg:block">
        <p className="text-mini text-text-quaternary">Properties</p>
        <dl className="mt-4 space-y-4">
          <div>
            <dt className="text-text-quaternary">Status</dt>
            <dd className="mt-1 text-text-secondary">In review</dd>
          </div>
          <div>
            <dt className="text-text-quaternary">Risk</dt>
            <dd className="mt-1">
              <SeverityPill value="Medium" />
            </dd>
          </div>
          <div>
            <dt className="text-text-quaternary">Labels</dt>
            <dd className="mt-1 flex flex-wrap gap-1">
              {["Auth", "API", "iOS"].map((label) => (
                <span
                  key={label}
                  className="rounded-4 border border-border-subtle bg-surface-elevated px-2 py-0.5 text-micro text-text-secondary"
                >
                  {label}
                </span>
              ))}
            </dd>
          </div>
          <div>
            <dt className="text-text-quaternary">Check</dt>
            <dd className="mt-1 text-status-orange">WARN · 2 findings</dd>
          </div>
          <div>
            <dt className="text-text-quaternary">Graph</dt>
            <dd className="mt-1 font-mono text-mini text-text-tertiary">v3 · 41ms</dd>
          </div>
        </dl>
      </aside>
    </div>
  );
}

function CompactAsk() {
  return (
    <div className="flex h-full flex-col px-5 py-5 sm:px-8">
      <p className="text-mini text-text-quaternary">Ask RepoPilot</p>
      <p className="mt-4 text-regular font-medium text-text-primary">How does authentication work?</p>
      <div className="mt-4 rounded-6 border border-border-subtle bg-surface-tint p-4">
        <p className="text-small text-text-secondary">
          Requests enter gateway middleware, which calls VerifyBearerToken. Claims are placed on context and read by billing entitlements.
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          {["token_verifier.go:41", "middleware.ts", "entitlements.go:88"].map((loc) => (
            <span key={loc} className="rounded-4 border border-border-subtle px-2 py-1 font-mono text-micro text-text-tertiary">
              {loc}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

function CompactImpact() {
  const nodes = ["CheckoutService", "PaymentService", "OrderService"];
  return (
    <div className="px-5 py-5 sm:px-8">
      <p className="text-mini text-text-quaternary">Impact path</p>
      <div className="mt-6 flex flex-col gap-2">
        {nodes.map((node, i) => (
          <span key={node} className="flex flex-col items-stretch gap-2">
            <span className="rounded-6 border border-border-subtle bg-surface-tint px-3 py-2 font-mono text-[12px] text-text-secondary">
              {node}
            </span>
            {i < nodes.length - 1 && (
              <span className="self-center text-text-quaternary" aria-hidden="true">
                ↓
              </span>
            )}
          </span>
        ))}
      </div>
      <ul className="mt-6 space-y-2 text-small text-text-tertiary">
        <li>11 direct callers · 7 packages</li>
        <li>3 related tests</li>
        <li>18 changes in 90 days · PR #142</li>
      </ul>
    </div>
  );
}

function CompactReviews() {
  return (
    <div className="flex h-full min-h-0 flex-col px-5 py-5 sm:px-8">
      <div className="mb-4 flex items-center justify-between gap-3">
        <p className="text-mini text-text-quaternary">PR #184 · review</p>
        <SeverityPill value="WARN" />
      </div>
      <div className="grid flex-1 content-start gap-2">
        <article className="rounded-6 border border-border-subtle bg-surface-tint p-3">
          <p className="text-small font-medium text-text-primary">Claims shape is a cross-service contract</p>
          <p className="mt-1 text-mini text-text-tertiary">API compatibility · high confidence</p>
        </article>
        <article className="rounded-6 border border-border-subtle p-3">
          <p className="text-small font-medium text-text-primary">JWKS fallback has no failing-path test</p>
          <p className="mt-1 text-mini text-text-tertiary">Test coverage · medium confidence</p>
        </article>
      </div>
    </div>
  );
}

function CompactHotspots() {
  return (
    <div className="px-5 py-5 sm:px-8">
      <p className="text-mini text-text-quaternary">Architecture · Hotspots</p>
      <ul className="mt-4 divide-y divide-border-subtle">
        {[
          ["PaymentService", "High", "Change + fan-out"],
          ["AuthService", "Medium", "High fan-in"],
          ["OrderService", "Medium", "Coupled with Payment"],
        ].map(([name, risk, note]) => (
          <li key={name} className="flex items-center justify-between gap-3 py-3">
            <div>
              <p className="font-mono text-[13px] text-text-primary">{name}</p>
              <p className="text-mini text-text-tertiary">{note}</p>
            </div>
            <SeverityPill value={risk} />
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function HeroProduct() {
  const reduce = useReducedMotion();
  const [view, setView] = useState("overview");
  const [step, setStep] = useState(0);

  const selectView = (id) => {
    setView(id);
    if (id === "overview") setStep(0);
  };

  useEffect(() => {
    if (view !== "overview" || reduce) return undefined;
    const timers = ACTIVITY.filter((item) => item.delay > 0).map((item) =>
      setTimeout(() => setStep(item.delay), item.delay),
    );
    return () => timers.forEach(clearTimeout);
  }, [view, reduce]);

  const panel =
    view === "ask" ? (
      <CompactAsk />
    ) : view === "impact" ? (
      <CompactImpact />
    ) : view === "reviews" ? (
      <CompactReviews />
    ) : view === "hotspots" ? (
      <CompactHotspots />
    ) : (
      <OverviewView step={reduce ? 5000 : step} />
    );

  return (
    <ShineFrame className="hero-product-frame">
      <div className="hero-product relative z-[2]">
        <Sidebar active={view} onSelect={selectView} />
        <div className="hero-product-main min-w-0">
          <div className="product-view flex-1">{panel}</div>
        </div>
      </div>
    </ShineFrame>
  );
}
