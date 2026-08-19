import { useEffect, useRef, useState } from "react";
import { ShineFrame } from "./ui.jsx";

export const WAITLIST_EVENT = "repopilot:waitlist";
const STORAGE_KEY = "repopilot-waitlist-email";

export function openWaitlist() {
  window.dispatchEvent(new Event(WAITLIST_EVENT));
}

export function WaitlistButton({ className = "", children = "Get started", onClick }) {
  return (
    <button
      type="button"
      className={className}
      onClick={() => {
        onClick?.();
        openWaitlist();
      }}
    >
      {children}
    </button>
  );
}

export default function WaitlistModal() {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState("");
  const inputRef = useRef(null);
  const closeRef = useRef(null);

  useEffect(() => {
    const onOpen = () => {
      setOpen(true);
      setStatus(localStorage.getItem(STORAGE_KEY) ? "done" : "idle");
      setError("");
    };
    window.addEventListener(WAITLIST_EVENT, onOpen);
    return () => window.removeEventListener(WAITLIST_EVENT, onOpen);
  }, []);

  useEffect(() => {
    if (!open) return undefined;
    const focus = status === "done" ? closeRef.current : inputRef.current;
    focus?.focus();
    const onKey = (event) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, status]);

  const submit = async (event) => {
    event.preventDefault();
    const value = email.trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      setError("Enter a valid email.");
      return;
    }

    setStatus("saving");
    setError("");

    const formId = import.meta.env.VITE_FORMSPREE_ID;
    if (formId) {
      try {
        const response = await fetch(`https://formspree.io/f/${formId}`, {
          method: "POST",
          headers: { Accept: "application/json", "Content-Type": "application/json" },
          body: JSON.stringify({ email: value, source: "repopilot-home" }),
        });
        if (!response.ok) throw new Error("request failed");
      } catch {
        setStatus("idle");
        setError("Could not reach the waitlist. Try again in a moment.");
        return;
      }
    }

    localStorage.setItem(STORAGE_KEY, value);
    setStatus("done");
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[200] flex items-end justify-center p-3 sm:items-center sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="waitlist-title"
    >
      <div
        className="fixed inset-0 bg-[var(--color-overlay-primary)]"
        aria-hidden="true"
        onClick={() => setOpen(false)}
      />
      <ShineFrame className="relative z-10 mb-[env(safe-area-inset-bottom,0px)] w-full max-w-md max-h-[min(36rem,calc(100dvh-1.5rem))] overflow-y-auto">
        <div className="relative z-[2] p-5 sm:p-6">
          <div className="mb-5 flex items-start justify-between gap-3">
            <div>
              <p className="font-mono text-mini uppercase tracking-[0.16em] text-text-quaternary">Waitlist</p>
              <h2 id="waitlist-title" className="mt-2 text-title2 font-semibold tracking-[-0.02em] text-text-primary">
                Get started
              </h2>
            </div>
            <button
              ref={closeRef}
              type="button"
              className="rounded-6 px-2 py-1 font-mono text-mini text-text-tertiary hover:text-text-primary"
              onClick={() => setOpen(false)}
            >
              Close
            </button>
          </div>

          {status === "done" ? (
            <p className="text-small leading-6 text-text-secondary">
              You’re on the list. We’ll write when a small number of teams can run the local graph. No
              drip campaign, no fake launch numbers.
            </p>
          ) : (
            <form onSubmit={submit} className="space-y-4">
              <p className="text-small leading-6 text-text-secondary">
                RepoPilot is a preview. Leave an email and we’ll tell you when local graph access
                opens. No newsletter.
              </p>
              <label className="block">
                <span className="mb-2 block font-mono text-mini text-text-quaternary">Email</span>
                <input
                  ref={inputRef}
                  type="email"
                  name="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="you@company.com"
                  className="h-11 w-full rounded-8 border border-border-subtle bg-surface-elevated px-3 text-small text-text-primary outline-none placeholder:text-text-quaternary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
                />
              </label>
              {error ? <p className="text-mini text-status-red">{error}</p> : null}
              <button type="submit" className="btn-primary w-full" disabled={status === "saving"}>
                {status === "saving" ? "Joining…" : "Join the waitlist"}
              </button>
            </form>
          )}
        </div>
      </ShineFrame>
    </div>
  );
}
