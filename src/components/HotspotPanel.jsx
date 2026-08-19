import { useState } from "react";
import { hotspots } from "../data/product.js";
import { SeverityPill, ShineFrame } from "./ui.jsx";

export default function HotspotPanel() {
  const [activeId, setActiveId] = useState(hotspots[0].id);
  const active = hotspots.find((item) => item.id === activeId) ?? hotspots[0];

  return (
    <ShineFrame>
      <div className="relative z-[2] product-split min-h-0 lg:min-h-[420px]">
        <ul className="product-rail min-w-0">
          {hotspots.map((item) => {
            const selected = item.id === activeId;
            return (
              <li key={item.id}>
                <button
                  type="button"
                  onClick={() => setActiveId(item.id)}
                  aria-pressed={selected}
                  className={`flex min-h-10 w-full items-center justify-between gap-2 px-2.5 py-3 text-left transition-colors duration-150 sm:min-h-11 sm:gap-3 sm:px-5 sm:py-4 ${
                    selected ? "bg-surface-tint-hover" : "hover:bg-surface-tint"
                  }`}
                >
                  <span className="min-w-0">
                    <span className="block truncate font-mono text-[12px] text-text-primary sm:text-[13px]">{item.name}</span>
                    <span className="mt-1 hidden text-mini text-text-tertiary sm:block">
                      {item.signals[0].label} {item.signals[0].value}
                    </span>
                  </span>
                  <SeverityPill value={item.risk} />
                </button>
              </li>
            );
          })}
        </ul>

        <article className="min-w-0 p-3 sm:p-6">
          <div className="mb-3 flex min-w-0 flex-wrap items-center gap-2">
            <h3 className="min-w-0 break-all font-mono text-title2 font-semibold text-text-primary">{active.name}</h3>
            <SeverityPill value={active.risk} />
          </div>
          <p className="max-w-prose text-small text-text-secondary">{active.detail}</p>
          <div className="panel-metrics mt-5">
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
