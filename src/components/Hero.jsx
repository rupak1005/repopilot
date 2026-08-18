import { useRef } from "react";
import heroBlackhole from "../assets/hero-blackhole.png";
import HeroProduct from "./HeroProduct.jsx";
import { WaitlistButton } from "./Waitlist.jsx";
import { FlipWords, Magnetic, Reveal, SplitText } from "./effects.jsx";

const HEADLINE_LEAD = "Understand your codebase before you";
const HEADLINE_CHARS = HEADLINE_LEAD.replace(/\s/g, "").length;
const WORD_DELAY = HEADLINE_CHARS * 0.03;

export default function Hero() {
  const spotRef = useRef(null);

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
      className="hero-section relative overflow-hidden pt-[calc(var(--header-height)+88px)] sm:pt-[calc(var(--header-height)+140px)]"
    >
      <div className="hero-space" aria-hidden="true">
        <img
          className="hero-photo"
          src={heroBlackhole}
          alt=""
          width={3840}
          height={1620}
          decoding="async"
        />
        <div className="hero-vignette" />
      </div>
      <div className="hero-spot" aria-hidden="true" />
      <div className="page-shell relative z-[1] max-w-[90rem]">
        <Reveal>
          <p className="hero-kicker">The engineering intelligence system</p>
        </Reveal>

        <h1 className="hero-headline mt-6 max-w-[14ch] sm:max-w-[12ch] lg:max-w-[11ch]">
          <SplitText text={HEADLINE_LEAD} />{" "}
          <span className="hero-headline-end">
            <FlipWords delay={WORD_DELAY} words={["change", "merge", "review", "ship"]} />
            {" "}
            <SplitText text="it." delay={WORD_DELAY + 0.12} />
          </span>
        </h1>

        <Reveal delay={0.2}>
          <p className="hero-lede mt-8">
            A living model of architecture, dependencies, Git history, and pull requests. Answers
            with evidence, not speculation.
          </p>
        </Reveal>

        <Reveal delay={0.4}>
          <div className="mt-10 flex flex-col gap-4 pt-2 sm:flex-row sm:items-center sm:gap-6">
            <Magnetic className="w-full sm:w-auto">
              <WaitlistButton className="btn-primary btn-hero w-full sm:w-auto" />
            </Magnetic>
            <a href="#understand" className="btn-secondary btn-hero w-full sm:w-auto">
              See how it works
            </a>
          </div>
        </Reveal>

        <Reveal delay={0.6} className="mt-14 sm:mt-20">
          <div className="floating-ui">
            <HeroProduct />
          </div>
        </Reveal>
        <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.16em] text-text-quaternary">
          Interactive product preview. Demo fixture from a local graph, not a live parse.
        </p>
      </div>
    </section>
  );
}
