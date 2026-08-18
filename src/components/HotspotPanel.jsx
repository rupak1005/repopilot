import { useState } from "react";
import { hotspots } from "../data/product.js";
import { SeverityPill, ShineFrame } from "./ui.jsx";

export default function HotspotPanel() {
  const [activeId, setActiveId] = useState(hotspots[0].id);
  const active = hotspots.find((item) => item.id === activeId) ?? hotspots[0];

  return (
    <ShineFrame>
      <div className="relative z-[2] grid min-h-[420px] lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
        <ul className="border-b border-border-subtle lg:border-b-0 lg:border-r">
          {hotspots.map((item) => {
            const selected = item.id === activeId;
            return (
              <li key={item.id}>
                <button
                  type="button"
                  onClick={() => setActiveId(item.id)}
                  aria-pressed={selected}
                  className={`flex min-h-11 w-full items-center justify-between gap-3 px-4 py-4 text-left transition-colors duration-150 sm:px-5 ${
                    selected ? "bg-surface-tint-hover" : "hover:bg-surface-tint"
                  }`}
                >
                  <span>
                    <span className="block font-mono text-[13px] text-text-primary">{item.name}</span>
                    <span className="mt-1 block text-mini text-text-tertiary">
                      {item.signals[0].label} {item.signals[0].value}
                    </span>
                  </span>
                  <SeverityPill value={item.risk} />
                </button>
              </li>
            );
          })}
        </ul>

        <article className="p-4 sm:p-6">
          <div className="mb-3 flex items-center gap-2">
            <h3 className="font-mono text-title2 font-semibold text-text-primary">{active.name}</h3>
            <SeverityPill value={active.risk} />
          </div>
          <p className="max-w-prose text-small text-text-secondary">{active.detail}</p>
          <div className="mt-5 grid gap-2 sm:grid-cols-3">
            {active.signals.map((signal) => (
              <div key={signal.label} className="rounded-6 border border-border-subtle bg-surface-tint p-3">
                <p className="text-micro text-text-quaternary">{signal.label}</p>
                <p className="mt-1 text-small font-medium text-text-primary">{signal.value}</p>
              </div>
            ))}
          </div>
          <p className="mt-5 text-mini text-text-quaternary">
            Demo fixture. Hotspot signals are labeled from a local graph, not a live scan.
          </p>
        </article>
      </div>
    </ShineFrame>
  );
}
