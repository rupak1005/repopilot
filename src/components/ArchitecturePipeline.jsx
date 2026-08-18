import { useState } from "react";
import { ShineFrame } from "./ui.jsx";

const NODE_H = 58;
const CANVAS_W = 1120;
const CANVAS_H = 300;

const NODES = [
  { id: "ctrl", x: 28, y: 86, w: 228, label: "PaymentController", path: "src/controllers/payment.ts" },
  { id: "gw", x: 28, y: 170, w: 228, label: "gateway/middleware", path: "src/middleware/auth.ts" },
  { id: "parse", x: 352, y: 48, w: 176, label: "Parse", path: "Tree-sitter" },
  { id: "ast", x: 352, y: 208, w: 176, label: "Local AST index", path: "on disk" },
  { id: "graph", x: 624, y: 121, w: 188, label: "Graph engine", path: "callers + history" },
  { id: "auth", x: 908, y: 70, w: 188, label: "VerifyBearerToken", path: "auth.v1" },
  { id: "bill", x: 908, y: 172, w: 188, label: "billing/entitlements", path: "billing.v2" },
];

const EDGES = [
  { from: "ctrl", to: "parse", fromT: 0.48, toT: 0.52 },
  { from: "gw", to: "ast", fromT: 0.5, toT: 0.48 },
  { from: "parse", to: "graph", fromT: 0.5, toT: 0.22 },
  { from: "ast", to: "graph", fromT: 0.5, toT: 0.78 },
  { from: "graph", to: "auth", fromT: 0.22, toT: 0.5 },
  { from: "graph", to: "bill", fromT: 0.78, toT: 0.5 },
];

const STAGES = ["Code", "Architecture", "History", "PRs", "Review"];

function byId(id) {
  return NODES.find((node) => node.id === id);
}

function port(node, side, t) {
  const inset = 1;
  return {
    x: side === "out" ? node.x + node.w + inset : node.x - inset,
    y: node.y + 16 + t * (NODE_H - 32),
  };
}

function edgePath(edge) {
  const from = byId(edge.from);
  const to = byId(edge.to);
  const a = port(from, "out", edge.fromT);
  const b = port(to, "in", edge.toT);
  const gap = Math.max(1, b.x - a.x);
  const dx = Math.min(gap * 0.4, gap / 2 - 6);
  return { a, b, d: `M${a.x} ${a.y}C${a.x + dx} ${a.y} ${b.x - dx} ${b.y} ${b.x} ${b.y}` };
}

function isLit(focus, edge) {
  return edge.from === focus || edge.to === focus;
}

export default function ArchitecturePipeline() {
  const [focus, setFocus] = useState("graph");
  const active = byId(focus) ?? NODES[4];

  return (
    <section id="graph" className="section-block" aria-labelledby="graph-heading">
      <div className="page-shell">
        <div className="mb-10 max-w-[46ch]">
          <h2 id="graph-heading" className="section-title">
            Index locally. Query the graph.
          </h2>
          <p className="mt-4 text-regular text-text-secondary">
            Structure, history, and review fold into one model. Hover a node to see what a change
            actually touches.
          </p>
        </div>

        <ShineFrame>
          <div className="relative z-[2]">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border-subtle px-4 py-3 sm:px-5">
            <div className="flex flex-wrap items-center gap-1.5 font-mono text-micro text-text-secondary">
              {STAGES.map((stage, index) => (
                <span key={stage} className="inline-flex items-center gap-1.5">
                  <span className="rounded-4 border border-border-subtle bg-surface-tint px-2 py-1 text-text-secondary">
                    {stage}
                  </span>
                  {index < STAGES.length - 1 ? <span className="text-text-quaternary">+</span> : null}
                </span>
              ))}
              <span className="text-text-quaternary">to</span>
              <span className="rounded-4 bg-[var(--color-button-invert-bg)] px-2 py-1 font-semibold text-[var(--color-bg-primary)]">RepoPilot</span>
            </div>
            <p className="font-mono text-micro text-text-tertiary">Client-side AST parse</p>
          </div>

          <div className="p-1.5 sm:p-2">
            <div className="product-view h-auto overflow-x-auto p-3 sm:p-5">
            <div
              className="graph-canvas relative mx-auto"
              style={{ width: CANVAS_W, minWidth: CANVAS_W, height: CANVAS_H }}
              role="img"
              aria-label="Local graph from PaymentController and gateway middleware into VerifyBearerToken and billing"
              onMouseLeave={() => setFocus("graph")}
            >
              <svg
                className="pointer-events-none absolute inset-0"
                width={CANVAS_W}
                height={CANVAS_H}
                viewBox={`0 0 ${CANVAS_W} ${CANVAS_H}`}
                fill="none"
                aria-hidden="true"
              >
                {EDGES.map((edge) => {
                  const { a, b, d } = edgePath(edge);
                  const on = isLit(focus, edge);
                  return (
                    <g key={`${edge.from}-${edge.to}`}>
                      <path
                        d={d}
                        className={on ? "graph-edge graph-edge--on" : "graph-edge"}
                        strokeLinecap="round"
                        fill="none"
                      />
                      <circle cx={a.x} cy={a.y} r="2.4" className={on ? "graph-port graph-port--on" : "graph-port"} />
                      <circle cx={b.x} cy={b.y} r="2.4" className={on ? "graph-port graph-port--on" : "graph-port"} />
                    </g>
                  );
                })}
              </svg>

              {NODES.map((node) => {
                const on = node.id === focus || EDGES.some((edge) => isLit(focus, edge) && (edge.from === node.id || edge.to === node.id));
                return (
                  <button
                    key={node.id}
                    type="button"
                    onMouseEnter={() => setFocus(node.id)}
                    onFocus={() => setFocus(node.id)}
                    onClick={() => setFocus(node.id)}
                    className={`graph-node ${on ? "graph-node--on" : ""} ${node.id === focus ? "graph-node--focus" : ""}`}
                    style={{ left: node.x, top: node.y, width: node.w, height: NODE_H }}
                  >
                    <span className="block truncate font-mono text-[12px] leading-4">{node.label}</span>
                    <span className="mt-1 block truncate font-mono text-[10px] leading-3 text-text-tertiary">
                      {node.path}
                    </span>
                  </button>
                );
              })}
            </div>
            </div>
          </div>

          <p className="border-t border-border-subtle px-4 py-3 font-mono text-mini text-text-secondary sm:px-5">
            Focused: {active.label} · {active.path} · demo fixture, not a live parse
          </p>
          </div>
        </ShineFrame>
      </div>
    </section>
  );
}
