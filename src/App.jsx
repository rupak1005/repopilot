import { lazy, Suspense, useEffect } from "react";
import { useTheme } from "next-themes";
import Navbar from "./components/Navbar.jsx";
import Hero from "./components/Hero.jsx";
import Footer from "./components/Footer.jsx";
import WaitlistModal from "./components/Waitlist.jsx";
import EasterEggModal from "./components/EasterEggModal.jsx";
import { SiteCursor } from "./components/effects.jsx";

const ArchitecturePipeline = lazy(() => import("./components/ArchitecturePipeline.jsx"));
const Benefits = lazy(() => import("./components/Benefits.jsx"));
const ProductSections = lazy(() => import("./components/ProductSections.jsx"));
const CapabilitiesGrid = lazy(() => import("./components/CapabilitiesGrid.jsx"));
const TechnicalSpecs = lazy(() => import("./components/TechnicalSpecs.jsx"));

function ThemeMeta() {
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    const color = resolvedTheme === "light" ? "#f7f8f8" : "#08090a";
    document.querySelector('meta[name="theme-color"]')?.setAttribute("content", color);
  }, [resolvedTheme]);

  return null;
}

function SectionFallback() {
  return <div className="section-block" aria-hidden="true" />;
}

export default function App() {
  return (
    <div className="relative min-h-[100dvh] overflow-x-clip bg-surface-base text-text-primary antialiased">
      <ThemeMeta />
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <div id="scroll-edge" className="pointer-events-none absolute inset-x-0 top-0 h-px" aria-hidden="true" />
      <EasterEggModal />
      <WaitlistModal />
      <SiteCursor />
      <Navbar />
      <main id="main" className="relative min-w-0">
        <Hero />
        <Suspense fallback={<SectionFallback />}>
          <ArchitecturePipeline />
          <Benefits />
          <ProductSections />
          <CapabilitiesGrid />
          <TechnicalSpecs />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
