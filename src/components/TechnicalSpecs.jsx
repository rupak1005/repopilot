import { specs } from "../data/product.js";
import { Reveal } from "./effects.jsx";
import { ShineFrame } from "./ui.jsx";

export default function TechnicalSpecs() {
  return (
    <section id="specs" className="relative scroll-mt-24 pb-8 pt-10 sm:pb-12 sm:pt-16">
      <div className="page-shell">
        <Reveal className="mb-8 max-w-prose">
          <h2 className="section-title">Local graph. Measured latency.</h2>
          <p className="mt-3 text-small text-text-secondary">
            Figures describe the local engine design, not marketing scale claims. RepoPilot does
            not auto-commit, auto-merge, or score people. It explains the system.
          </p>
        </Reveal>

        <ShineFrame>
          <div className="relative z-[2] grid gap-px overflow-hidden sm:grid-cols-2 lg:grid-cols-4">
          {specs.map((spec) => (
            <article key={spec.label} className="bg-surface-elevated p-5 sm:p-6">
              <p className="text-mini text-text-tertiary">{spec.label}</p>
              <p className="mt-3 text-title2 font-semibold text-text-primary">{spec.value}</p>
              <p className="mt-2 text-mini text-text-tertiary">{spec.detail}</p>
            </article>
          ))}
          </div>
        </ShineFrame>
      </div>
    </section>
  );
}
