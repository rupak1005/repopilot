import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "motion/react";
import { workflowSteps } from "../data/product.js";
import { ShineFrame, SeverityPill } from "./ui.jsx";

function WorkflowStep({ n, label, detail, state, outcome }) {
  return (
    <li className={`workflow-step workflow-step--${state}`}>
      <span className="workflow-step-n">{n}</span>
      <span className="workflow-step-title">{label}</span>
      <span className="workflow-step-detail">
        {outcome ? (
          <>
            PASS · <span className="workflow-outcome">WARN</span> · FAIL · INCOMPLETE
          </>
        ) : (
          detail
        )}
      </span>
    </li>
  );
}

function stepState(index, active, reduce) {
  if (reduce) return workflowSteps[index].accent ? "accent" : "idle";
  if (active < 0) return "idle";
  if (index === active) return "active";
  if (index < active) return "done";
  return "idle";
}

export default function WorkflowPanel() {
  const rootRef = useRef(null);
  const reduce = useReducedMotion();
  const [active, setActive] = useState(-1);
  const shown = reduce ? workflowSteps.length - 1 : active;

  useEffect(() => {
    const el = rootRef.current;
    if (!el || reduce) return undefined;

    let playing = false;
    let timer;

    const start = () => {
      if (playing) return;
      playing = true;
      let index = 0;
      setActive(0);
      timer = window.setInterval(() => {
        index += 1;
        if (index >= workflowSteps.length - 1) {
          setActive(workflowSteps.length - 1);
          window.clearInterval(timer);
          return;
        }
        setActive(index);
      }, 1400);
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) start();
      },
      { threshold: 0.4 },
    );

    observer.observe(el);
    return () => {
      observer.disconnect();
      window.clearInterval(timer);
    };
  }, [reduce]);

  return (
    <ShineFrame>
      <div ref={rootRef} className="relative z-[2] p-6 sm:p-8">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3 sm:mb-8">
          <p className="font-mono text-mini text-text-tertiary">
            pull_request.synchronize · head 9f3c1a2
          </p>
          <SeverityPill
            value={shown >= workflowSteps.length - 1 ? "WARN" : shown >= 0 ? "RUNNING" : "INCOMPLETE"}
          />
        </div>

        <ol className="grid grid-cols-1 gap-3 lg:grid-cols-5">
          {workflowSteps.map((step, index) => (
            <WorkflowStep
              key={step.id}
              n={step.n}
              label={step.label}
              detail={step.detail}
              state={stepState(index, shown, reduce)}
              outcome={step.id === "check" && shown >= workflowSteps.length - 1}
            />
          ))}
        </ol>

        <p className="mt-6 max-w-prose text-mini text-text-tertiary">
          Reviews are immutable to the analyzed revision. A failed job never replaces a healthy
          active graph.
        </p>
      </div>
    </ShineFrame>
  );
}
