"use client";

import { useEffect } from "react";
import Lenis from "lenis";

export default function SmoothScroll() {
  useEffect(() => {
    // If recruiter mode is enabled, disable Lenis to allow instant page jumps
    const isRecruiter = document.documentElement.classList.contains("recruiter-mode");
    if (isRecruiter) return;

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // smooth exponential decay
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1.5,
    });

    // RAF loop
    let rafId: number;
    function raf(time: number) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }
    rafId = requestAnimationFrame(raf);

    // Intercept navigation link click scrolls to run programmatically via Lenis
    const handleNavScroll = (e: CustomEvent) => {
      const targetEl = document.getElementById(e.detail);
      if (targetEl) {
        lenis.scrollTo(targetEl, { offset: -20, duration: 1.5 });
      }
    };

    window.addEventListener("monarch-scroll-to" as any, handleNavScroll);

    // Watch for Recruiter Mode toggles to enable/disable Lenis dynamically
    const observer = new MutationObserver(() => {
      const activeRecruiter = document.documentElement.classList.contains("recruiter-mode");
      if (activeRecruiter) {
        lenis.destroy();
        cancelAnimationFrame(rafId);
      }
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });

    return () => {
      lenis.destroy();
      cancelAnimationFrame(rafId);
      window.removeEventListener("monarch-scroll-to" as any, handleNavScroll);
      observer.disconnect();
    };
  }, []);

  return null;
}
