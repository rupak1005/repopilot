import { principles } from "../data/product.js";
import { Reveal } from "./effects.jsx";
import { ShineFrame } from "./ui.jsx";

const benefits = [
  {
    title: "Purpose-built",
    body: "Shaped for how teams actually change software: structure, history, and review in one model, not another autocomplete box.",
  },
  {
    title: "Evidence-backed",
    body: "Every important conclusion cites files, symbols, PRs, or graph relationships. If the repository does not establish it, RepoPilot says so.",
  },
  {
    title: "In the workflow",
    body: "Open a PR. RepoPilot analyzes it, publishes a GitHub Check, and stays quiet when the change is clean.",
  },
];

export default function Benefits() {
  return (
    <section className="section-block" aria-labelledby="benefits-heading">
      <div className="page-shell">
        <Reveal className="mb-10 max-w-[46ch]">
          <h2 id="benefits-heading" className="section-title">
            Built for changing software, not generating it.
          </h2>
        </Reveal>

        <ShineFrame>
          <div className="relative z-[2]">
          {benefits.map((item, index) => (
            <article
              key={item.title}
              className={`grid gap-3 px-5 py-6 sm:grid-cols-[minmax(0,0.42fr)_minmax(0,1fr)] sm:gap-10 sm:px-7 ${
                index ? "border-t border-border-subtle" : ""
              }`}
            >
              <h3 className="text-title1 font-semibold text-text-primary">{item.title}</h3>
              <p className="max-w-[52ch] text-small text-text-secondary">{item.body}</p>
            </article>
          ))}
          </div>
        </ShineFrame>

        <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {principles.map((item) => (
            <article key={item.fig}>
              <h3 className="text-small font-semibold text-text-primary">{item.title}</h3>
              <p className="mt-2 text-mini text-text-tertiary">{item.body}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
