export const productNav = [
  {
    href: "#understand",
    label: "Understand",
    detail: "Ask the repo. Get citations, not guesses.",
  },
  {
    href: "#impact",
    label: "Impact",
    detail: "Callers, tests, and blast radius before you merge.",
  },
  {
    href: "#review",
    label: "Review",
    detail: "PR findings grounded in architecture and history.",
  },
  {
    href: "#history",
    label: "History",
    detail: "Hotspots, co-change, and why the code is this way.",
  },
  {
    href: "#workflow",
    label: "Workflow",
    detail: "GitHub Checks that stay out of the way when the PR is clean.",
  },
];

export const askPrompts = [
  {
    id: "auth",
    prompt: "How does authentication work?",
    answer: {
      title: "Auth is a token boundary, not a user service.",
      body: "Requests enter through gateway middleware, which calls VerifyBearerToken. Valid claims are placed on the request context and consumed by billing entitlements and session restore. The shape of Claims is the contract.",
      graph: ["PaymentController", "gateway/middleware", "VerifyBearerToken", "billing/entitlements"],
      evidence: [
        { kind: "symbol", label: "VerifyBearerToken", loc: "services/auth/token_verifier.go:41" },
        { kind: "edge", label: "imports", loc: "api/gateway/middleware.ts → auth RPC" },
        { kind: "symbol", label: "Claims.Plan", loc: "services/billing/entitlements.go:88" },
      ],
      confidence: "High",
      note: "Known from AST + import graph.",
    },
  },
  {
    id: "impact",
    prompt: "What happens if I change this function?",
    answer: {
      title: "VerifyBearerToken is used by 11 symbols across 7 packages.",
      body: "The largest impact path is CheckoutService → PaymentService → OrderService. Three related tests exist. This module changed 18 times in the last 90 days. Two previous PRs modifying this function contained review findings. Most recent similar change: PR #142.",
      graph: ["CheckoutService", "PaymentService", "OrderService"],
      evidence: [
        { kind: "graph", label: "11 callers", loc: "direct + transitive" },
        { kind: "test", label: "3 tests", loc: "tests/e2e/auth.spec.ts, token_verifier_test.go" },
        { kind: "pr", label: "PR #142", loc: "auth: rotate JWKS fallback" },
      ],
      confidence: "High",
      note: "Derived from graph walk + Git history. Risk: medium.",
    },
  },
  {
    id: "hotspot",
    prompt: "Why is this considered a hotspot?",
    answer: {
      title: "PaymentService concentrates change, fan-out, and repeat findings.",
      body: "High change frequency, high dependency fan-out, and recurring review notes on API compatibility. The signal is explainable, not a score. AuthService is high fan-in; OrderService is high change coupling.",
      graph: ["PaymentService", "AuthService", "OrderService"],
      evidence: [
        { kind: "history", label: "Change frequency", loc: "18 commits / 90 days" },
        { kind: "graph", label: "Fan-out", loc: "7 downstream packages" },
        { kind: "finding", label: "Recurring", loc: "API compatibility in PRs #118, #142" },
      ],
      confidence: "Medium",
      note: "Derived signal from history + graph. Not a performance score.",
    },
  },
  {
    id: "seen",
    prompt: "Have we seen this issue before?",
    answer: {
      title: "Yes. Claims shape changes keep showing up in review.",
      body: "PR #118 and PR #142 both changed Claims and drew API-compatibility findings. Billing entitlements still reads Claims.Plan. The repository does not document the original rationale for the claim shape.",
      graph: ["PR #118", "PR #142", "Claims.Plan"],
      evidence: [
        { kind: "pr", label: "PR #118", loc: "auth: add plan claim" },
        { kind: "pr", label: "PR #142", loc: "auth: rotate JWKS fallback" },
        { kind: "finding", label: "Recurring finding", loc: "API compatibility" },
      ],
      confidence: "High",
      note: "Historical retrieval. Original design rationale is not in the repo.",
    },
  },
];

export const reviewFindings = [
  {
    id: "api",
    severity: "Medium",
    category: "API compatibility",
    confidence: "High",
    title: "Claims shape is a cross-service contract",
    description:
      "VerifyBearerToken now returns Claims.Plan. billing/entitlements.go reads that field. A rename or optional wrap will fail closed in plan gating.",
    evidence: [
      "services/auth/token_verifier.go:44",
      "services/billing/entitlements.go:88",
      "PR #142 review finding (recurring)",
    ],
    action: "Keep Claims.Plan stable, or version the claim and update entitlements in the same PR.",
  },
  {
    id: "test",
    severity: "Low",
    category: "Test coverage",
    confidence: "Medium",
    title: "JWKS fallback has no failing-path test",
    description:
      "The new fallback branch is reached when the primary key set errors. No test in token_verifier_test.go covers that path.",
    evidence: ["services/auth/token_verifier.go:52", "token_verifier_test.go: no JWKS error case"],
    action: "Add a unit test that forces keyFunc to fail and asserts ErrInvalidToken.",
  },
];

export const hotspots = [
  {
    id: "payment",
    name: "PaymentService",
    risk: "High",
    signals: [
      { label: "Change frequency", value: "18 / 90d" },
      { label: "Fan-out", value: "7 packages" },
      { label: "Recurring findings", value: "API compatibility" },
    ],
    detail:
      "Touches checkout, billing, and order. Historical PRs that edit this module often include claim or amount-shape changes.",
  },
  {
    id: "auth",
    name: "AuthService",
    risk: "Medium",
    signals: [
      { label: "Change frequency", value: "11 / 90d" },
      { label: "Fan-in", value: "14 callers" },
      { label: "Recurring findings", value: "Token boundary" },
    ],
    detail:
      "High fan-in. A token or error-shape change fans out to every authenticated route, including workers and the CLI.",
  },
  {
    id: "order",
    name: "OrderService",
    risk: "Medium",
    signals: [
      { label: "Change frequency", value: "9 / 90d" },
      { label: "Coupling", value: "Co-changes with Payment" },
      { label: "Recurring findings", value: "None recent" },
    ],
    detail:
      "Frequently lands in the same commits as PaymentService. Impact analysis should treat them as a pair.",
  },
];

export const workflowSteps = [
  {
    id: "open",
    n: "01",
    label: "PR opened",
    detail: "GitHub webhook · pull_request.opened",
    accent: true,
  },
  { id: "diff", n: "02", label: "Diff analysis", detail: "Changed files, symbols, APIs" },
  { id: "graph", n: "03", label: "Graph impact", detail: "Callers, tests, architecture" },
  {
    id: "review",
    n: "04",
    label: "AI review",
    detail: "Grounded findings, then validation",
    accent: true,
  },
  { id: "check", n: "05", label: "GitHub Check", detail: "PASS · WARN · FAIL · INCOMPLETE" },
];

export const capabilities = [
  {
    title: "Repository intelligence",
    body: "Ingest the working tree into files, symbols, imports, and a directed dependency graph. Structure first, then language.",
  },
  {
    title: "Grounded answers",
    body: "Ask how a system works and get citations: files, symbols, PRs, and graph edges. If the repo does not establish it, RepoPilot says so.",
  },
  {
    title: "Change impact",
    body: "Select a function and see direct callers, transitive dependents, related tests, API consumers, and historical co-changes.",
  },
  {
    title: "PR intelligence",
    body: "Every revision is analyzed for symbol, API, dependency, test, and architectural impact, then reviewed for high-signal findings.",
  },
  {
    title: "History & hotspots",
    body: "Commits, co-change, and recurring findings explain why a module is risky. Hotspots are evidence, not a leaderboard.",
  },
  {
    title: "GitHub workflow",
    body: "A Check on the PR. Idempotent jobs, revision-scoped reviews, and no replacement of a healthy index with a failed run.",
  },
];

export const specs = [
  {
    label: "Parser",
    value: "Tree-sitter AST",
    detail: "Go, TypeScript, and SQL grammars. Structural, not embedding-based.",
  },
  {
    label: "Index",
    value: "Local on-disk graph",
    detail: "Built from the working tree and Git history. Stays on the machine that parsed it.",
  },
  {
    label: "Query",
    value: "Sub-100ms",
    detail: "Neighborhood traversal on a warm index. No round-trip to a hosted model.",
  },
  {
    label: "Retention",
    value: "Zero remote code",
    detail: "GitHub is used for auth and repo metadata. Source is not stored off-box.",
  },
];

export const principles = [
  {
    fig: "01",
    title: "Evidence over speculation",
    body: "Every important conclusion cites a file, symbol, PR, or graph edge.",
  },
  {
    fig: "02",
    title: "Structure before AI",
    body: "AST, dependency graph, and Git history are queried before an LLM reasons.",
  },
  {
    fig: "03",
    title: "High signal",
    body: "A few useful findings beat a noisy report. A clean PR can return nothing.",
  },
  {
    fig: "04",
    title: "Explicit uncertainty",
    body: "Known fact, derived signal, inference, and unknown are labeled as such.",
  },
];
