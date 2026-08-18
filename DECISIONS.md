# Decisions — RepoPilot

### 1. Why this ingestion strategy?

RepoPilot indexes the working tree on the machine that has the code. Tree-sitter builds an AST; a local graph stores symbols, imports, callers, and Git history. Queries hit that graph. They do not clone GitHub on demand, scrape hosts, or ship source to a remote embedder.

The obvious alternative is a hosted crawler: clone every repo, chunk files, embed, retrieve. That design dies the moment the source rate-limits, revokes a token, or flags the runner. A mid-run block leaves a half-written index and a product that cannot answer.

Local-first survives that class of failure because there is no remote source in the hot path. GitHub is used for auth and PR metadata, not for the corpus. The index lives on disk. A failed job does not replace a healthy graph. If the network is gone, the last good index still answers. Privacy follows the same cut: source never has to leave the box.

### 2. Time-limit trade-off

The interactive preview is a high-fidelity fixture from a compiled local graph, not a live parse in the browser. Wiring Tree-sitter WASM and a file picker in this window would have burned the time that belonged to the homepage.

With a real week I would compile grammars to WASM, accept a folder or repo URL, build the graph in a worker, and keep the same UI. The fixture copy would come off. Checkpointing and “failed run does not clobber a healthy index” would stay.

### 3. Where AI was used

AI helped scaffold React sections, Tailwind layout, theme tokens, and the waitlist/modal wiring. I set the product pitch, wrote the copy, and rejected fake testimonials, logos, and user counts. Every number on the page is labeled as a demo fixture or as engine design (parser, on-disk graph, sub-100ms neighborhood walk). I checked contrast in both themes, 390px and 1440px layout, and that “Get started” opens a waitlist instead of pretending an account exists.
