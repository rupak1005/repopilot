import { TracingBeam } from "./effects.jsx";
import { SectionHeader } from "./ui.jsx";
import AskPanel from "./AskPanel.jsx";
import InteractiveTerminal from "./InteractiveTerminal.jsx";
import ReviewPanel from "./ReviewPanel.jsx";
import HotspotPanel from "./HotspotPanel.jsx";
import WorkflowPanel from "./WorkflowPanel.jsx";
import { productNav } from "../data/product.js";

const STOPS = productNav.map((item) => ({
  id: item.href.replace("#", ""),
  label: item.label,
}));

export default function ProductSections() {
  return (
    <TracingBeam stops={STOPS}>
      <section id="understand" className="section-block scroll-mt-24">
        <div className="page-shell">
          <SectionHeader
            title="Make every repository explainable."
            description="Ask how a system works and get architecture, symbols, and citations. Not a generic summary of whatever files an LLM happened to retrieve."
          />
          <AskPanel />
        </div>
      </section>

      <section id="impact" className="section-block scroll-mt-24">
        <div className="page-shell">
          <SectionHeader
            title="See what a change will touch."
            description="Select a function and inspect callers, dependents, tests, and historical co-changes before the diff lands on main."
          />
          <InteractiveTerminal framed />
        </div>
      </section>

      <section id="review" className="section-block scroll-mt-24">
        <div className="page-shell">
          <SectionHeader
            title="AI review grounded in your architecture."
            description="Findings prioritize correctness, security, compatibility, and risk. A clean PR can come back with nothing to report."
          />
          <ReviewPanel />
        </div>
      </section>

      <section id="history" className="section-block scroll-mt-24">
        <div className="page-shell">
          <SectionHeader
            title="Know why the code is this way."
            description="Search commits, PRs, and recurring findings. Hotspots surface modules that change often, fan out widely, or keep attracting the same review notes."
          />
          <HotspotPanel />
        </div>
      </section>

      <section id="workflow" className="section-block scroll-mt-24">
        <div className="page-shell">
          <SectionHeader
            title="Intelligence that meets the PR."
            description="Webhook in, Check out. Analysis is idempotent, revision-scoped, and never replaces a healthy index with a failed run."
          />
          <WorkflowPanel />
        </div>
      </section>
    </TracingBeam>
  );
}
