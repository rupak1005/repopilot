import { useEffect, useRef, useState } from "react";
import { useTheme } from "next-themes";
import heroBlackhole from "../assets/hero-blackhole.webp";
import heroBlackholeSm from "../assets/hero-blackhole-1280.webp";
import heroLight from "../assets/hero-light.webp";
import HeroProduct from "./HeroProduct.jsx";
import { WaitlistButton } from "./Waitlist.jsx";
import { FlipWords, Magnetic, Reveal, SplitText } from "./effects.jsx";
import { triggerOverdrive } from "../overdrive.js";

const HEADLINE_LEAD = "Understand your codebase before you";
const HEADLINE = "Understand your codebase before you change it.";
const HEADLINE_CHARS = HEADLINE_LEAD.replace(/\s/g, "").length;
const WORD_DELAY = HEADLINE_CHARS * 0.03;

function useDarkHero() {
  const { resolvedTheme } = useTheme();
  const [dark, setDark] = useState(() =>
    typeof document === "undefined" ? true : document.documentElement.classList.contains("dark"),
  );

  useEffect(() => {
    if (resolvedTheme) setDark(resolvedTheme !== "light");
  }, [resolvedTheme]);

  return dark;
}

export default function Hero() {
  const spotRef = useRef(null);
  const dark = useDarkHero();

  const onMove = (event) => {
    const el = spotRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    el.style.setProperty("--spot-x", `${((event.clientX - rect.left) / rect.width) * 100}%`);
    el.style.setProperty("--spot-y", `${((event.clientY - rect.top) / rect.height) * 100}%`);
  };

  return (
    <section
      id="top"
      ref={spotRef}
      onMouseMove={onMove}
      className="hero-section relative overflow-x-clip pt-[calc(var(--header-height)+env(safe-area-inset-top,0px)+48px)] sm:pt-[calc(var(--header-height)+env(safe-area-inset-top,0px)+88px)] lg:pt-[calc(var(--header-height)+env(safe-area-inset-top,0px)+140px)]"
    >
      <div className="hero-space" aria-hidden="true">
        <div className="hero-photo-wrap">
          {dark ? (
            <img
              className="hero-photo"
              src={heroBlackhole}
              srcSet={`${heroBlackholeSm} 1280w, ${heroBlackhole} 1920w`}
              sizes="100vw"
              alt=""
              width={1920}
              height={810}
              decoding="async"
              fetchPriority="high"
            />
          ) : (
            <img
              className="hero-photo"
              src={heroLight}
              alt=""
              width={1024}
              height={571}
              decoding="async"
              fetchPriority="high"
            />
          )}
        </div>
        <div className="hero-vignette" />
      </div>
      <HorizonHotspot />
      <div className="hero-spot" aria-hidden="true" />
      <div className="page-shell relative z-[1]">
        <Reveal>
          <p className="hero-kicker">The engineering intelligence system</p>
        </Reveal>

        <h1 className="hero-headline mt-5 sm:mt-6">
          <span className="sr-only">{HEADLINE}</span>
          <span aria-hidden="true">
            <SplitText text={HEADLINE_LEAD} />{" "}
            <span className="hero-headline-end">
              <FlipWords delay={WORD_DELAY} words={["change", "merge", "review", "ship"]} />{" "}
              <SplitText text="it." delay={WORD_DELAY + 0.12} />
            </span>
          </span>
        </h1>

        <Reveal delay={0.2}>
          <p className="hero-lede mt-8">
            A living model of architecture, dependencies, Git history, and pull requests. Answers
            with evidence, not speculation.
          </p>
        </Reveal>

        <Reveal delay={0.4}>
          <div className="mt-8 flex flex-col gap-3 pt-2 sm:mt-10 sm:flex-row sm:items-center sm:gap-6">
            <Magnetic className="w-full sm:w-auto">
              <WaitlistButton className="btn-primary btn-hero w-full sm:w-auto" />
            </Magnetic>
            <a href="#understand" className="btn-secondary btn-hero w-full sm:w-auto">
              See how it works
            </a>
          </div>
        </Reveal>

        <Reveal delay={0.6} className="mt-10 min-w-0 sm:mt-16 lg:mt-20">
          <div className="floating-ui min-w-0">
            <HeroProduct />
          </div>
        </Reveal>
        <p className="mt-3 max-w-[42ch] font-mono text-[10px] uppercase tracking-[0.16em] text-text-quaternary">
          Interactive product preview. Demo fixture from a local graph, not a live parse.
        </p>
      </div>
    </section>
  );
}

function HorizonHotspot() {
  const [warming, setWarming] = useState(false);
  const dwellRef = useRef(0);
  const warmRef = useRef(0);

  const disarm = () => {
    window.clearTimeout(dwellRef.current);
    window.clearTimeout(warmRef.current);
    setWarming(false);
  };

  const arm = () => {
    disarm();
    warmRef.current = window.setTimeout(() => setWarming(true), 260);
    dwellRef.current = window.setTimeout(() => {
      setWarming(false);
      triggerOverdrive();
    }, 1100);
  };

  useEffect(() => () => disarm(), []);

  return (
    <div
      className={`horizon-hotspot${warming ? " is-warming" : ""}`}
      aria-hidden="true"
      onPointerEnter={arm}
      onPointerLeave={disarm}
      onPointerDown={(event) => {
        if (event.pointerType === "touch") arm();
      }}
      onPointerUp={(event) => {
        if (event.pointerType === "touch") disarm();
      }}
      onPointerCancel={disarm}
    />
  );
}
