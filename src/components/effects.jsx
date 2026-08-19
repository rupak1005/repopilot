import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useReducedMotion, useScroll, useSpring, useTransform } from "motion/react";

const REVEAL_EASE = [0.2, 0.8, 0.2, 1];
const CHAR_EASE = [0.16, 1, 0.3, 1];

export function SplitText({ text, delay = 0, className = "" }) {
  const reduce = useReducedMotion();
  let charIndex = 0;

  return (
    <span className={className}>
      {text.split(/(\s+)/).map((token, tokenIndex) => {
        if (/^\s+$/.test(token) || token === "") {
          return <span key={`s-${tokenIndex}`}>{token}</span>;
        }
        return (
          <span key={`w-${tokenIndex}`} className="split-word">
            {Array.from(token).map((char) => {
              const index = charIndex;
              charIndex += 1;
              return (
                <motion.span
                  key={`${char}-${index}`}
                  className="split-char"
                  initial={reduce ? false : { opacity: 0, y: 20, rotateX: -20 }}
                  animate={{ opacity: 1, y: 0, rotateX: 0 }}
                  transition={{ duration: 0.8, delay: delay + index * 0.03, ease: CHAR_EASE }}
                >
                  {char}
                </motion.span>
              );
            })}
          </span>
        );
      })}
    </span>
  );
}

export function FlipWords({ words, duration = 2600, className = "", delay = 0 }) {
  const [index, setIndex] = useState(0);
  const reduce = useReducedMotion();
  const word = words[index];
  const longest = words.reduce((a, b) => (a.length >= b.length ? a : b));

  useEffect(() => {
    if (reduce || words.length < 2) return undefined;
    let intervalId = 0;
    const startId = window.setTimeout(() => {
      intervalId = window.setInterval(() => {
        setIndex((prev) => (prev + 1) % words.length);
      }, duration);
    }, delay * 1000 + duration);
    return () => {
      window.clearTimeout(startId);
      window.clearInterval(intervalId);
    };
  }, [words, duration, reduce, delay]);

  return (
    <span className={`hero-flip-slot ${className}`} aria-live="polite">
      <span className="hero-flip-mask">
        <span className="hero-flip-sizer" aria-hidden="true">
          {longest}
        </span>
        <motion.span
          key={word}
          initial={reduce ? false : { y: "80%", opacity: 0 }}
          animate={{ y: "0%", opacity: 1 }}
          transition={{ duration: 0.28, delay: index === 0 ? delay : 0, ease: CHAR_EASE }}
          className="hero-flip"
        >
          {word}
        </motion.span>
      </span>
    </span>
  );
}

export function CardSpotlight({ children, className = "" }) {
  const ref = useRef(null);
  const reduce = useReducedMotion();

  const onMove = (event) => {
    if (reduce) return;
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    el.style.setProperty("--spot-x", `${event.clientX - rect.left}px`);
    el.style.setProperty("--spot-y", `${event.clientY - rect.top}px`);
  };

  return (
    <div
      ref={ref}
      onMouseMove={onMove}
      className={`liquid-glass liquid-glass-spot relative min-w-0 p-5 sm:p-6 ${className}`}
    >
      {children}
    </div>
  );
}

export function TracingBeam({ children, stops = [] }) {
  const ref = useRef(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.2", "end 0.7"],
  });
  const progress = useSpring(scrollYProgress, { stiffness: 90, damping: 26, mass: 0.35 });
  const headTop = useTransform(progress, (value) => `${Math.min(1, Math.max(0, value)) * 100}%`);
  const [active, setActive] = useState(stops[0]?.id ?? "");

  useEffect(() => {
    const nodes = stops
      .map((stop) => document.getElementById(stop.id))
      .filter(Boolean);
    if (!nodes.length) return undefined;

    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible?.target?.id) setActive(visible.target.id);
      },
      { rootMargin: "-28% 0px -52% 0px", threshold: [0, 0.2, 0.45, 0.7, 1] }
    );
    nodes.forEach((node) => io.observe(node));
    return () => io.disconnect();
  }, [stops]);

  return (
    <div ref={ref} className="tracing-wrap">
      <nav className="tracing-rail" aria-label="Section progress">
        <div className="tracing-track">
          <motion.div
            className="tracing-fill"
            style={{ scaleY: reduce ? 1 : progress }}
            aria-hidden="true"
          />
          <motion.span className="tracing-head" style={{ top: reduce ? "100%" : headTop }} aria-hidden="true" />
        </div>
        <ol className="tracing-stops">
          {stops.map((stop) => (
            <li key={stop.id}>
              <a
                href={`#${stop.id}`}
                className={`tracing-stop ${active === stop.id ? "is-active" : ""}`}
                aria-current={active === stop.id ? "location" : undefined}
                title={stop.label}
              >
                <span className="sr-only">{stop.label}</span>
              </a>
            </li>
          ))}
        </ol>
      </nav>
      {children}
    </div>
  );
}

export function Magnetic({ children, className = "" }) {
  const reduce = useReducedMotion();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 220, damping: 20, mass: 0.35 });
  const sy = useSpring(y, { stiffness: 220, damping: 20, mass: 0.35 });

  const onMove = (event) => {
    if (reduce) return;
    const rect = event.currentTarget.getBoundingClientRect();
    if (window.matchMedia("(pointer: coarse)").matches) return;
    x.set((event.clientX - rect.left - rect.width / 2) * 0.18);
    y.set((event.clientY - rect.top - rect.height / 2) * 0.18);
  };

  const onLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.span
      style={{ x: sx, y: sy }}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className={`inline-block ${className}`}
    >
      {children}
    </motion.span>
  );
}

export function Reveal({ children, className = "", delay = 0 }) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduce ? false : { opacity: 0, y: 40, scale: 0.95 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, amount: 0.12, margin: "0px 0px -50px 0px" }}
      transition={{ duration: 1.2, delay, ease: REVEAL_EASE }}
    >
      {children}
    </motion.div>
  );
}

export function SiteCursor() {
  const ringRef = useRef(null);
  const dotRef = useRef(null);

  useEffect(() => {
    const ring = ringRef.current;
    const dot = dotRef.current;
    if (!ring || !dot) return undefined;

    const fine = window.matchMedia("(pointer: fine)").matches;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine || reduce) return undefined;

    document.documentElement.classList.add("has-site-cursor");

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let ringX = mouseX;
    let ringY = mouseY;
    let raf = 0;

    const onMove = (event) => {
      mouseX = event.clientX;
      mouseY = event.clientY;
      dot.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`;
    };

    const onOver = (event) => {
      const hover = event.target.closest("a, button, [role='button'], input, textarea, select");
      ring.classList.toggle("is-hover", Boolean(hover));
    };

    const loop = () => {
      ringX += (mouseX - ringX) * 0.15;
      ringY += (mouseY - ringY) * 0.15;
      ring.style.transform = `translate3d(${ringX}px, ${ringY}px, 0)`;
      raf = requestAnimationFrame(loop);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerover", onOver, { passive: true });
    raf = requestAnimationFrame(loop);

    return () => {
      document.documentElement.classList.remove("has-site-cursor");
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerover", onOver);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <>
      <div ref={ringRef} className="site-cursor" aria-hidden="true" />
      <div ref={dotRef} className="site-cursor-dot" aria-hidden="true" />
    </>
  );
}
