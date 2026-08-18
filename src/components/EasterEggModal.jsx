import { useEffect, useRef, useState } from "react";
import { ShineFrame } from "./ui.jsx";

const KONAMI = [
  "ArrowUp",
  "ArrowUp",
  "ArrowDown",
  "ArrowDown",
  "ArrowLeft",
  "ArrowRight",
  "ArrowLeft",
  "ArrowRight",
  "b",
  "a",
];

export default function EasterEggModal() {
  const [open, setOpen] = useState(false);
  const indexRef = useRef(0);
  const closeRef = useRef(null);

  useEffect(() => {
    const onKey = (event) => {
      if (event.metaKey || event.ctrlKey || event.altKey) return;
      const key = event.key.length === 1 ? event.key.toLowerCase() : event.key;
      const expected = KONAMI[indexRef.current];
      if (key === expected) {
        indexRef.current += 1;
        if (indexRef.current === KONAMI.length) {
          indexRef.current = 0;
          setOpen(true);
        }
      } else {
        indexRef.current = key === KONAMI[0] ? 1 : 0;
      }
    };

    const onOverdrive = () => setOpen(true);

    window.addEventListener("keydown", onKey);
    window.addEventListener("repopilot:overdrive", onOverdrive);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("repopilot:overdrive", onOverdrive);
    };
  }, []);

  useEffect(() => {
    if (!open) return undefined;
    closeRef.current?.focus();
    const onEscape = (event) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onEscape);
    return () => window.removeEventListener("keydown", onEscape);
  }, [open]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="overdrive-title"
    >
      <div
        className="fixed inset-0 bg-[var(--color-overlay-primary)]"
        aria-hidden="true"
        onClick={() => setOpen(false)}
      />

      <ShineFrame className="relative z-10 w-full max-w-xl">
        <div className="relative z-[2] p-5 sm:p-6">
        <div className="mb-4 flex items-center justify-between gap-3 border-b border-border-subtle pb-3">
          <p id="overdrive-title" className="font-mono text-mini font-medium text-status-green">
            Terminal overdrive engaged
          </p>
          <button
            ref={closeRef}
            type="button"
            onClick={() => setOpen(false)}
            aria-label="Close terminal overdrive"
            className="rounded-4 border border-border-subtle bg-surface-tint px-2 py-1 font-mono text-micro text-text-tertiary hover:text-text-primary"
          >
            Esc
          </button>
        </div>

        <pre className="overflow-x-auto rounded-8 border border-border-subtle bg-surface-base p-4 font-mono text-[13px] leading-6 text-text-secondary">
          <span className="text-status-green">$</span> repopilot --mode stealth{"\n"}
          <span className="text-text-quaternary">index:</span> local graph{"  "}
          <span className="text-text-quaternary">parser:</span> tree-sitter{"\n"}
          <span className="text-text-quaternary">retention:</span> none{"  "}
          <span className="text-text-quaternary">latency:</span> 41ms{"\n\n"}
          <span className="text-text-quaternary">{">"}</span> walk services/auth/token_verifier.go{"\n"}
          {"  "}callers: 11{"\n"}
          {"  "}packages: 7{"\n"}
          {"  "}prs: #184 (Claims){"\n\n"}
          <span className="text-status-green">overdrive complete.</span>
        </pre>
        </div>
      </ShineFrame>
    </div>
  );
}
