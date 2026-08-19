import { useState } from "react";
import { ShineFrame } from "./ui.jsx";

const NODE_H = 58;
const CANVAS_W = 1120;
const CANVAS_H = 300;

const COMPACT_W = 320;
const COMPACT_H = 300;
const COMPACT_NODE_H = 52;

const NODES = [
  { id: "ctrl", x: 28, y: 86, w: 228, label: "PaymentController", path: "src/controllers/payment.ts" },
  { id: "gw", x: 28, y: 170, w: 228, label: "gateway/middleware", path: "src/middleware/auth.ts" },
  { id: "parse", x: 352, y: 48, w: 176, label: "Parse", path: "Tree-sitter" },
  { id: "ast", x: 352, y: 208, w: 176, label: "Local AST index", path: "on disk" },
  { id: "graph", x: 624, y: 121, w: 188, label: "Graph engine", path: "callers + history" },
  { id: "auth", x: 908, y: 70, w: 188, label: "VerifyBearerToken", path: "auth.v1" },
  { id: "bill", x: 908, y: 172, w: 188, label: "billing/entitlements", path: "billing.v2" },
];

const COMPACT_BOX = {
  ctrl: { x: 8, y: 10, w: 148 },
  parse: { x: 164, y: 10, w: 148 },
  gw: { x: 8, y: 78, w: 148 },
  ast: { x: 164, y: 78, w: 148 },
  graph: { x: 70, y: 154, w: 180 },
  auth: { x: 8, y: 230, w: 148 },
  bill: { x: 164, y: 230, w: 148 },
};

const EDGES = [
  { from: "ctrl", to: "parse", fromT: 0.48, toT: 0.52 },
  { from: "gw", to: "ast", fromT: 0.5, toT: 0.48 },
  { from: "parse", to: "graph", fromT: 0.5, toT: 0.22 },
  { from: "ast", to: "graph", fromT: 0.5, toT: 0.78 },
  { from: "graph", to: "auth", fromT: 0.22, toT: 0.5 },
  { from: "graph", to: "bill", fromT: 0.78, toT: 0.5 },
];

const COMPACT_EDGES = [
  { from: "ctrl", to: "parse", fromSide: "right", toSide: "left", fromT: 0.5, toT: 0.5 },
  { from: "gw", to: "ast", fromSide: "right", toSide: "left", fromT: 0.5, toT: 0.5 },
  { from: "parse", to: "graph", fromSide: "bottom", toSide: "top", fromT: 0.55, toT: 0.28 },
  { from: "ast", to: "graph", fromSide: "bottom", toSide: "top", fromT: 0.45, toT: 0.72 },
  { from: "graph", to: "auth", fromSide: "bottom", toSide: "top", fromT: 0.28, toT: 0.5 },
  { from: "graph", to: "bill", fromSide: "bottom", toSide: "top", fromT: 0.72, toT: 0.5 },
];

const STAGES = ["Code", "Architecture", "History", "PRs", "Review"];

function byId(id) {
  return NODES.find((node) => node.id === id);
}

function compactNode(id) {
  return { ...byId(id), ...COMPACT_BOX[id] };
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

function compactPort(node, side, t) {
  const h = COMPACT_NODE_H;
  if (side === "right") return { x: node.x + node.w, y: node.y + 14 + t * (h - 28) };
  if (side === "left") return { x: node.x, y: node.y + 14 + t * (h - 28) };
  if (side === "bottom") return { x: node.x + node.w * t, y: node.y + h };
  return { x: node.x + node.w * t, y: node.y };
}

function compactEdgePath(edge) {
  const from = compactNode(edge.from);
  const to = compactNode(edge.to);
  const a = compactPort(from, edge.fromSide, edge.fromT);
  const b = compactPort(to, edge.toSide, edge.toT);
  if (edge.fromSide === "right") {
    const dx = Math.max(10, (b.x - a.x) * 0.42);
    return { a, b, d: `M${a.x} ${a.y}C${a.x + dx} ${a.y} ${b.x - dx} ${b.y} ${b.x} ${b.y}` };
  }
  const dy = Math.max(12, (b.y - a.y) * 0.42);
  return { a, b, d: `M${a.x} ${a.y}C${a.x} ${a.y + dy} ${b.x} ${b.y - dy} ${b.x} ${b.y}` };
}

function isLit(focus, edge) {
  return edge.from === focus || edge.to === focus;
}

function nodeOn(focus, nodeId) {
  return (
    nodeId === focus ||
    EDGES.some((edge) => isLit(focus, edge) && (edge.from === nodeId || edge.to === nodeId))
  );
}

function GraphNode({ node, focus, setFocus, compact }) {
  const on = nodeOn(focus, node.id);
  const box = compact ? compactNode(node.id) : node;
  const style = compact
    ? {
        left: `${(box.x / COMPACT_W) * 100}%`,
        top: `${(box.y / COMPACT_H) * 100}%`,
        width: `${(box.w / COMPACT_W) * 100}%`,
        height: `${(COMPACT_NODE_H / COMPACT_H) * 100}%`,
      }
    : { left: node.x, top: node.y, width: node.w, height: NODE_H };

  return (
    <button
      type="button"
      onMouseEnter={() => setFocus(node.id)}
      onFocus={() => setFocus(node.id)}
      onClick={() => setFocus(node.id)}
      className={`graph-node ${compact ? "graph-node--compact" : ""} ${on ? "graph-node--on" : ""} ${
        node.id === focus ? "graph-node--focus" : ""
      }`}
      style={style}
    >
      <span className="block truncate font-mono text-[12px] leading-4">{node.label}</span>
      <span className="graph-node-path mt-1 block truncate font-mono text-[10px] leading-3 text-text-tertiary">
        {node.path}
      </span>
    </button>
  );
}

function GraphDetail({ active }) {
  const connected = EDGES.filter((edge) => edge.from === active.id || edge.to === active.id).map(
    (edge) => byId(edge.from === active.id ? edge.to : edge.from),
  );

  return (
    <div className="graph-detail">
      <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-text-quaternary">Focused</p>
      <p className="mt-2 break-words font-mono text-[13px] font-medium leading-5 text-text-primary">
        {active.label}
      </p>
      <p className="mt-1 break-words font-mono text-[11px] leading-4 text-text-tertiary">{active.path}</p>
      <p className="mt-4 font-mono text-[10px] uppercase tracking-[0.12em] text-text-quaternary">Touches</p>
      <ul className="mt-2 space-y-1.5">
        {connected.map((node) => (
          <li
            key={node.id}
            className="rounded-6 border border-border-subtle bg-surface-tint px-2.5 py-1.5 font-mono text-[11px] text-text-secondary"
          >
            {node.label}
          </li>
        ))}
      </ul>
    </div>
  );
}

function CompactGraph({ focus, setFocus }) {
  return (
    <div
      className="graph-compact"
      role="img"
      aria-label="Local graph from PaymentController and gateway middleware into VerifyBearerToken and billing"
      onMouseLeave={() => setFocus("graph")}
    >
      <svg
        className="pointer-events-none absolute inset-0 h-full w-full"
        viewBox={`0 0 ${COMPACT_W} ${COMPACT_H}`}
        fill="none"
        aria-hidden="true"
        preserveAspectRatio="xMidYMin meet"
      >
        {COMPACT_EDGES.map((edge) => {
          const { a, b, d } = compactEdgePath(edge);
          const on = isLit(focus, edge);
          return (
            <g key={`${edge.from}-${edge.to}`}>
              <path d={d} className={on ? "graph-edge graph-edge--on" : "graph-edge"} strokeLinecap="round" fill="none" />
              <circle cx={a.x} cy={a.y} r="2.2" className={on ? "graph-port graph-port--on" : "graph-port"} />
              <circle cx={b.x} cy={b.y} r="2.2" className={on ? "graph-port graph-port--on" : "graph-port"} />
            </g>
          );
        })}
      </svg>
      {NODES.map((node) => (
        <GraphNode key={node.id} node={node} focus={focus} setFocus={setFocus} compact />
      ))}
    </div>
  );
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
            <div className="flex flex-col gap-2 border-b border-border-subtle px-3 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-5">
              <div className="flex flex-wrap items-center gap-1 font-mono text-micro text-text-secondary">
                {STAGES.map((stage, index) => (
                  <span key={stage} className="inline-flex items-center gap-1">
                    <span className="rounded-4 border border-border-subtle bg-surface-tint px-2 py-1 text-text-secondary">
                      {stage}
                    </span>
                    {index < STAGES.length - 1 ? <span className="text-text-quaternary">+</span> : null}
                  </span>
                ))}
                <span className="text-text-quaternary">to</span>
                <span className="rounded-4 bg-[var(--color-button-invert-bg)] px-2 py-1 font-semibold text-[var(--color-bg-primary)]">
                  RepoPilot
                </span>
              </div>
              <p className="font-mono text-micro text-text-tertiary">Client-side AST parse</p>
            </div>

            <div className="p-1.5 sm:p-2">
              <div className="product-view h-auto p-2 sm:p-4">
                <div className="graph-mobile">
                  <CompactGraph focus={focus} setFocus={setFocus} />
                  <GraphDetail active={active} />
                </div>
                <div className="graph-fit">
                  <div
                    className="graph-canvas graph-stage"
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

                    {NODES.map((node) => (
                      <GraphNode key={node.id} node={node} focus={focus} setFocus={setFocus} />
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <p className="border-t border-border-subtle px-3 py-3 font-mono text-mini text-text-secondary sm:px-5">
              Focused: {active.label} · {active.path} · demo fixture, not a live parse
            </p>
          </div>
        </ShineFrame>
      </div>
    </section>
  );
}
