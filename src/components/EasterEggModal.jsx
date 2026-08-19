import { useEffect, useRef, useState } from "react";
import { OVERDRIVE_EVENT, takePendingOverdrive } from "../overdrive.js";

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

const FRAGMENTS = [
  { t: "token_verifier.go", a: 18, r: 38 },
  { t: "gateway/middleware.ts", a: 62, r: 46 },
  { t: "entitlements.go", a: 104, r: 34 },
  { t: "PaymentController", a: 148, r: 44 },
  { t: "VerifyBearerToken", a: 192, r: 36 },
  { t: "Claims.Plan", a: 236, r: 42 },
  { t: "PR #142", a: 278, r: 31 },
  { t: "local AST index", a: 318, r: 48 },
];

export default function EasterEggModal() {
  const [open, setOpen] = useState(false);
  const indexRef = useRef(0);
  const closeRef = useRef(null);

  useEffect(() => {
    if (takePendingOverdrive()) setOpen(true);

    const onKey = (event) => {
      if (event.metaKey || event.ctrlKey || event.altKey) return;
      if (event.target.closest?.("input, textarea, select")) return;
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
    window.addEventListener(OVERDRIVE_EVENT, onOverdrive);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener(OVERDRIVE_EVENT, onOverdrive);
    };
  }, []);

  useEffect(() => {
    if (!open) return undefined;
    document.documentElement.classList.add("is-horizon");
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    const onEscape = (event) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onEscape);
    return () => {
      document.documentElement.classList.remove("is-horizon");
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onEscape);
    };
  }, [open]);

  if (!open) return null;

  return (
    <div
      className="horizon-layer"
      role="dialog"
      aria-modal="true"
      aria-labelledby="overdrive-title"
    >
      <button
        type="button"
        className="horizon-veil"
        aria-label="Close event horizon"
        onClick={() => setOpen(false)}
      />

      <div className="horizon-well" aria-hidden="true">
        <div className="horizon-core" />
        {FRAGMENTS.map((frag) => (
          <span
            key={frag.t}
            className="horizon-chip"
            style={{
              "--a": `${frag.a}deg`,
              "--r": `${frag.r}vmin`,
              "--d": `${frag.a / 90}s`,
            }}
          >
            {frag.t}
          </span>
        ))}
      </div>

      <div className="horizon-hud">
        <div className="mb-3 flex items-center justify-between gap-3">
          <p id="overdrive-title" className="font-mono text-mini font-medium text-status-green">
            Event horizon
          </p>
          <button
            ref={closeRef}
            type="button"
            onClick={() => setOpen(false)}
            aria-label="Close event horizon"
            className="rounded-4 border border-border-subtle bg-surface-tint px-2 py-1 font-mono text-micro text-text-tertiary hover:text-text-primary"
          >
            Esc
          </button>
        </div>
        <p className="whitespace-pre-wrap font-mono text-[12px] leading-5 text-text-secondary">
          <span className="text-status-green">$</span> repopilot graph --local{"\n"}
          <span className="text-text-quaternary">walk</span> services/auth/token_verifier.go{"\n"}
          <span className="text-text-quaternary">callers</span> 11{"  "}
          <span className="text-text-quaternary">packages</span> 7{"\n"}
          The graph never left the machine. Demo fixture. 0 remotes.
        </p>
      </div>
    </div>
  );
}
