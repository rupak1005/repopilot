import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { askPrompts } from "../data/product.js";
import { ShineFrame } from "./ui.jsx";

export default function AskPanel() {
  const [activeId, setActiveId] = useState(askPrompts[0].id);
  const reduce = useReducedMotion();
  const prompt = askPrompts.find((item) => item.id === activeId) ?? askPrompts[0];
  const { answer } = prompt;

  return (
    <ShineFrame>
      <div className="relative z-[2] product-split min-h-0 lg:min-h-[440px]">
        <aside className="product-rail flex min-w-0 flex-col justify-between p-2 sm:p-3">
          <ul className="flex min-w-0 flex-col gap-1">
            {askPrompts.map((item) => {
              const selected = item.id === activeId;
              return (
                <li key={item.id} className="min-w-0">
                  <button
                    type="button"
                    onClick={() => setActiveId(item.id)}
                    aria-pressed={selected}
                    title={item.prompt}
                    className={`flex min-h-10 w-full items-center rounded-6 border px-2.5 py-2 text-left font-mono text-[11px] leading-4 transition-colors duration-150 sm:min-h-11 sm:px-3 sm:text-mini ${
                      selected
                        ? "border-border-strong bg-surface-tint-strong text-text-primary"
                        : "border-transparent text-text-tertiary hover:border-border-subtle hover:text-text-secondary"
                    }`}
                  >
                    <span className="min-w-0 truncate">{item.prompt}</span>
                  </button>
                </li>
              );
            })}
          </ul>
          <p className="mt-3 border-t border-border-subtle px-1 pt-3 font-mono text-micro text-text-quaternary">
            Local AST graph
          </p>
        </aside>

        <div className="p-1.5 sm:p-2">
          <div className="product-view flex h-auto min-h-full min-w-0 flex-col justify-between p-4 sm:p-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={prompt.id}
              initial={reduce ? false : { opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduce ? undefined : { opacity: 0, y: -6 }}
              transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="mb-4 flex flex-wrap items-center gap-2 font-mono text-mini">
                <span className="rounded-4 border border-border-subtle bg-surface-tint px-2 py-0.5 text-text-secondary">
                  {answer.confidence} confidence
                </span>
                <span className="text-text-quaternary">{answer.note}</span>
              </div>
              <h3 className="text-title2 font-semibold text-text-primary">{answer.title}</h3>
              <p className="mt-3 max-w-[65ch] text-small text-text-secondary">{answer.body}</p>
              <div className="mt-6 flex flex-wrap items-center gap-1.5 font-mono text-mini">
                {answer.graph.map((node, index) => (
                  <span key={node} className="inline-flex min-w-0 items-center gap-1.5">
                    <span className="rounded-4 border border-border-subtle bg-surface-tint px-2.5 py-1 text-text-secondary">
                      {node}
                    </span>
                    {index < answer.graph.length - 1 ? (
                      <span className="text-text-quaternary" aria-hidden="true">
                        →
                      </span>
                    ) : null}
                  </span>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>

          <ul className="mt-6 space-y-2 border-t border-border-subtle pt-5 font-mono text-mini">
            {answer.evidence.map((item) => (
              <li
                key={item.loc}
                className="flex flex-wrap items-center justify-between gap-2 rounded-6 border border-border-subtle bg-surface-tint px-3 py-2 text-text-secondary"
              >
                <span>
                  <span className="mr-2 rounded-4 border border-border-subtle px-1.5 py-0.5 text-micro uppercase text-text-quaternary">
                    {item.kind}
                  </span>
                  <span className="text-text-primary">{item.label}</span>
                </span>
                <span className="text-text-quaternary">{item.loc}</span>
              </li>
            ))}
          </ul>
          </div>
        </div>
      </div>
    </ShineFrame>
  );
}
