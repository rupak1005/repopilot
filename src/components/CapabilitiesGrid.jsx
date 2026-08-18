import { capabilities } from "../data/product.js";
import { CardSpotlight, Reveal } from "./effects.jsx";

export default function CapabilitiesGrid() {
  return (
    <section id="capabilities" className="section-block scroll-mt-24" aria-labelledby="capabilities-heading">
      <div className="page-shell">
        <Reveal className="mb-10 max-w-[46ch]">
          <h2 id="capabilities-heading" className="section-title">
            The intelligence layer over the repo you already have.
          </h2>
          <p className="mt-4 text-regular text-text-secondary">
            Source, graph, history, and review in one model you can query, inspect, and disagree with.
          </p>
        </Reveal>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-6">
          {capabilities.map((item, index) => {
            const wide = index === 0 || index === 3;
            return (
              <CardSpotlight
                key={item.title}
                className={wide ? "sm:col-span-2 lg:col-span-3 min-h-[180px]" : "lg:col-span-2"}
              >
                <h3 className="text-title1 font-semibold text-text-primary">{item.title}</h3>
                <p className="mt-3 max-w-[44ch] text-small text-text-secondary">{item.body}</p>
              </CardSpotlight>
            );
          })}
        </div>
      </div>
    </section>
  );
}
