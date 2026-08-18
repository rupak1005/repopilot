import { useState } from "react";
import { ShineFrame } from "./ui.jsx";

const FILES = [
  {
    id: "go",
    path: "services/auth/token_verifier.go",
    lang: "Go",
    node: "func VerifyBearerToken",
    kind: "function_declaration",
    risk: "High",
    latency: "42ms",
    summary:
      "Auth boundary. A claim or error-shape change fans out to every authenticated route.",
    snippet: [
      { n: 41, c: "func VerifyBearerToken(ctx context.Context, raw string) (*Claims, error) {", h: true },
      { n: 42, c: "    token, err := jwt.Parse(raw, keyFunc)", h: false },
      { n: 43, c: "    if err != nil { return nil, ErrInvalidToken }", h: false },
      { n: 44, c: "    return claimsFrom(token) // shape consumed by gateway + billing", h: true },
      { n: 45, c: "}", h: false },
    ],
    cards: [
      {
        label: "Callers",
        value: "11 symbols",
        detail: "gateway middleware, billing entitlements, CLI login, worker jobs",
      },
      {
        label: "Blast radius",
        value: "7 packages",
        detail: "api/gateway, services/billing, cmd/api, internal/session",
      },
      {
        label: "Git + PRs",
        value: "4 local commits",
        detail: "Last touch: auth: rotate JWKS fallback. Open PR #184 edits Claims.",
      },
    ],
    edges: [
      "api/gateway/middleware.ts → imports VerifyBearerToken via auth RPC",
      "services/billing/entitlements.go → reads Claims.Plan",
      "cmd/api/main.go → wires verifier into request context",
    ],
  },
  {
    id: "ts",
    path: "api/gateway/router.ts",
    lang: "TypeScript",
    node: "export function createRouter",
    kind: "export_declaration",
    risk: "Medium",
    latency: "37ms",
    summary:
      "Route table. Path or middleware order changes affect clients and the generated OpenAPI surface.",
    snippet: [
      { n: 88, c: "export function createRouter(deps: GatewayDeps) {", h: true },
      { n: 89, c: "  const app = new Hono();", h: false },
      { n: 90, c: "  app.use(\"/v1/*\", deps.auth.verify);", h: true },
      { n: 91, c: "  app.route(\"/v1/users\", userRoutes);", h: false },
      { n: 92, c: "  return app;", h: false },
    ],
    cards: [
      {
        label: "Callers",
        value: "6 symbols",
        detail: "server bootstrap, contract tests, OpenAPI emitter",
      },
      {
        label: "Blast radius",
        value: "3 packages",
        detail: "api/gateway, packages/sdk, tests/e2e",
      },
      {
        label: "Git + PRs",
        value: "2 local commits",
        detail: "Last touch: gateway: mount /v1/users. No open PR on this file.",
      },
    ],
    edges: [
      "packages/sdk/client.ts → generated from router path table",
      "tests/e2e/auth.spec.ts → asserts middleware order on /v1/*",
      "cmd/api/main.go → mounts createRouter at process start",
    ],
  },
  {
    id: "sql",
    path: "db/migrations/004_user_idx.sql",
    lang: "SQL",
    node: "CREATE INDEX CONCURRENTLY",
    kind: "create_index_statement",
    risk: "Low",
    latency: "29ms",
    summary:
      "Index-only change. Read plans improve; writes on users pick up extra maintenance cost. No API contract shift.",
    snippet: [
      { n: 1, c: "-- 004_user_idx.sql", h: false },
      { n: 2, c: "CREATE INDEX CONCURRENTLY IF NOT EXISTS user_email_lower_idx", h: true },
      { n: 3, c: "  ON users (lower(email));", h: true },
      { n: 4, c: "-- lookup sites: services/auth, api/gateway/users", h: false },
    ],
    cards: [
      {
        label: "Callers",
        value: "3 queries",
        detail: "FindUserByEmail, session restore, admin search",
      },
      {
        label: "Blast radius",
        value: "1 table",
        detail: "users: concurrent index, no rewrite of row shape",
      },
      {
        label: "Git + PRs",
        value: "1 local commit",
        detail: "Last touch: db: email lookup index. Migration not yet in a PR.",
      },
    ],
    edges: [
      "services/auth/store.go → FindUserByEmail uses lower(email)",
      "api/gateway/users.ts → admin search ORDER BY email",
      "No downstream type or proto change detected",
    ],
  },
];

const riskClass = {
  High: "text-status-red border-status-red/35",
  Medium: "text-status-orange border-status-orange/35",
  Low: "text-status-green border-status-green/35",
};

export default function InteractiveTerminal({ framed = false }) {
  const [activeId, setActiveId] = useState(FILES[0].id);
  const file = FILES.find((f) => f.id === activeId) ?? FILES[0];

  const body = (
    <>
      <div className={framed ? "relative z-[2] overflow-hidden" : "liquid-glass overflow-hidden"}>
        <div className="border-b border-border-subtle px-4 py-3 sm:px-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="min-w-0 break-words font-mono text-mini text-text-tertiary">
              AST Change Impact Inspector · local index
            </p>
            <p className="font-mono text-mini text-text-tertiary">
              {file.latency} · Tree-sitter {file.lang}
            </p>
          </div>
        </div>

        <div className="grid min-w-0 lg:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)]">
          <aside className="min-w-0 border-b border-border-subtle lg:border-b-0 lg:border-r lg:border-border-subtle">
            <p className="px-4 pb-2 pt-4 text-mini text-text-tertiary sm:px-5">File targets</p>
            <ul className="flex gap-2 overflow-x-auto px-4 pb-4 sm:px-5 lg:flex-col lg:overflow-visible">
              {FILES.map((item) => {
                const selected = item.id === file.id;
                return (
                  <li key={item.id} className="min-w-0 shrink-0 lg:w-full lg:shrink">
                    <button
                      type="button"
                      onClick={() => setActiveId(item.id)}
                      aria-pressed={selected}
                      className={`min-h-11 w-full rounded-6 border px-3 py-2.5 text-left transition-colors duration-200 ${
                        selected
                          ? "border-brand bg-surface-level2 text-text-primary"
                          : "border-surface bg-transparent hover:border-brand"
                      }`}
                    >
                      <span className="block break-all font-mono text-mini text-text-secondary">
                        {item.path}
                      </span>
                      <span className="mt-1 block font-mono text-micro text-text-tertiary">
                        {item.node}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </aside>

          <div className="min-w-0 p-4 sm:p-5">
            <div className="mb-4 flex flex-wrap items-center gap-2">
              <span className="break-all font-mono text-mini text-text-secondary">{file.path}</span>
              <span
                className={`rounded-4 border px-2 py-0.5 font-mono text-micro ${riskClass[file.risk]}`}
              >
                {file.risk} impact
              </span>
              <span className="rounded-4 border border-border-subtle px-2 py-0.5 font-mono text-micro text-text-tertiary">
                {file.kind}
              </span>
            </div>

            <p className="mb-4 max-w-prose text-small text-text-tertiary">{file.summary}</p>

            <pre className="mb-4 overflow-x-auto rounded-6 border border-border-subtle bg-surface-tint-strong p-3 font-mono text-[13px] leading-6 text-text-secondary">
              {file.snippet.map((line) => (
                <div
                  key={line.n}
                  className={`flex gap-4 ${line.h ? "bg-surface-level2 text-text-primary" : ""}`}
                >
                  <span className="w-6 shrink-0 select-none text-right text-text-tertiary">{line.n}</span>
                  <span className="min-w-0 whitespace-pre">{line.c}</span>
                </div>
              ))}
            </pre>

            <div className="grid gap-2 sm:grid-cols-3">
              {file.cards.map((card) => (
                <article
                  key={card.label}
                  className="rounded-6 border border-border-subtle bg-surface-level2 p-3"
                >
                  <p className="text-micro text-text-tertiary">{card.label}</p>
                  <p className="mt-1 text-small font-semibold text-text-primary">{card.value}</p>
                  <p className="mt-1 text-mini text-text-tertiary">{card.detail}</p>
                </article>
              ))}
            </div>

            <ul className="mt-4 space-y-1.5">
              {file.edges.map((edge) => (
                <li key={edge} className="flex gap-2 font-mono text-mini text-text-tertiary">
                  <span aria-hidden="true">-</span>
                  <span className="min-w-0 break-words">{edge}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </>
  );

  return (
    <div id="analyzer" className={`relative w-full min-w-0 scroll-mt-28 ${framed ? "" : "mt-16 pb-8 sm:mt-20"}`}>
      {framed ? <ShineFrame>{body}</ShineFrame> : body}
      <p className="mt-3 text-mini text-text-tertiary">
        Demo fixture from a pre-compiled local graph, not a live WASM parse.
      </p>
    </div>
  );
}
