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
      <div className="relative z-[2] grid min-h-[440px] grid-cols-1 lg:grid-cols-[220px_1fr]">
        <aside className="glass-rail flex flex-col justify-between border-b border-border-subtle p-4 lg:border-b-0 lg:border-r lg:border-border-subtle">
          <ul className="flex gap-1.5 overflow-x-auto lg:flex-col lg:overflow-visible">
            {askPrompts.map((item) => {
              const selected = item.id === activeId;
              return (
                <li key={item.id} className="shrink-0 lg:w-full">
                  <button
                    type="button"
                    onClick={() => setActiveId(item.id)}
                    aria-pressed={selected}
                    className={`flex min-h-11 w-full items-center rounded-6 border px-3 py-2 text-left font-mono text-mini transition-colors duration-150 ${
                      selected
                        ? "border-border-strong bg-surface-tint-strong text-text-primary"
                        : "border-transparent text-text-tertiary hover:border-border-subtle hover:text-text-secondary"
                    }`}
                  >
                    <span className="truncate">{item.prompt}</span>
                  </button>
                </li>
              );
            })}
          </ul>
          <p className="hidden border-t border-border-subtle px-1 pt-4 font-mono text-micro text-text-quaternary lg:block">
            Local AST graph
          </p>
        </aside>

        <div className="p-1.5 sm:p-2">
          <div className="product-view flex h-auto min-h-full flex-col justify-between p-5 sm:p-6">
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
                  <span key={node} className="inline-flex items-center gap-1.5">
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
