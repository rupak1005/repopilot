import { useState } from "react";
import { reviewFindings } from "../data/product.js";
import { SeverityPill, ShineFrame } from "./ui.jsx";

const feedbackOptions = ["Useful", "False positive", "Not relevant"];

export default function ReviewPanel() {
  const [activeId, setActiveId] = useState(reviewFindings[0].id);
  const [feedback, setFeedback] = useState({});
  const finding = reviewFindings.find((item) => item.id === activeId) ?? reviewFindings[0];

  return (
    <ShineFrame>
      <div className="relative z-[2]">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border-subtle px-4 py-3 sm:px-5">
          <div className="min-w-0">
            <p className="break-words font-mono text-mini text-text-tertiary">PR #184 · maya · main ← auth/jwks-fallback</p>
            <p className="mt-1 text-small font-medium text-text-primary">Rotate JWKS fallback and keep Claims.Plan</p>
          </div>
          <div className="flex items-center gap-2">
            <SeverityPill value="WARN" />
            <span className="font-mono text-micro text-text-quaternary">2 findings · 1.4s</span>
          </div>
        </div>

        <div className="product-split min-h-0 lg:min-h-[420px]">
          <ul className="product-rail min-w-0">
            {reviewFindings.map((item) => {
              const selected = item.id === activeId;
              return (
                <li key={item.id} className="border-b border-border-subtle last:border-b-0">
                  <button
                    type="button"
                    onClick={() => setActiveId(item.id)}
                    aria-pressed={selected}
                    className={`flex min-h-10 w-full items-start gap-2 px-2.5 py-2.5 text-left transition-colors duration-150 sm:min-h-11 sm:gap-3 sm:px-5 sm:py-3 ${
                      selected ? "bg-surface-tint-hover" : "hover:bg-surface-tint"
                    }`}
                  >
                    <span className="mt-0.5">
                      <SeverityPill value={item.severity} />
                    </span>
                    <span className="min-w-0">
                      <span className="block truncate text-[12px] font-medium text-text-primary sm:text-small">{item.title}</span>
                      <span className="mt-0.5 hidden text-mini text-text-tertiary sm:block">
                        {item.category} · {item.confidence} confidence
                      </span>
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>

          <article className="min-w-0 p-3 sm:p-6">
            <div className="mb-3 flex flex-wrap items-center gap-2">
              <SeverityPill value={finding.severity} />
              <span className="text-mini text-text-tertiary">{finding.category}</span>
              <span className="font-mono text-micro text-text-quaternary">{finding.confidence}</span>
            </div>
            <h3 className="text-title2 font-semibold text-text-primary">
              {finding.title}
            </h3>
            <p className="mt-3 max-w-prose text-small text-text-secondary">{finding.description}</p>

            <p className="mt-5 text-mini text-text-quaternary">Evidence</p>
            <ul className="mt-2 space-y-1.5">
              {finding.evidence.map((item) => (
                <li key={item} className="font-mono text-mini text-text-tertiary">
                  {item}
                </li>
              ))}
            </ul>

            <p className="mt-5 text-mini text-text-quaternary">Suggested action</p>
            <p className="mt-1 text-small text-text-secondary">{finding.action}</p>

            <div className="mt-6">
              <p className="mb-2 text-mini text-text-quaternary">Finding feedback</p>
              <div className="flex flex-wrap gap-2">
                {feedbackOptions.map((option) => {
                  const selected = feedback[finding.id] === option;
                  return (
                    <button
                      key={option}
                      type="button"
                      onClick={() => setFeedback((prev) => ({ ...prev, [finding.id]: option }))}
                      className={`h-9 rounded-full border px-3 text-[12px] transition-colors duration-150 ${
                        selected
                          ? "border-brand bg-brand/20 text-text-primary"
                          : "border-border-subtle text-text-tertiary hover:text-text-secondary"
                      }`}
                    >
                      {option}
                    </button>
                  );
                })}
              </div>
            </div>
          </article>
        </div>
      </div>
    </ShineFrame>
  );
}
