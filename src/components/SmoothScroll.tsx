"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { gsap, registerGsap, ScrollTrigger } from "@/lib/gsap";

export default function SmoothScroll() {
  useEffect(() => {
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (prefersReduced) return;

    registerGsap();

    const lenis = new Lenis({
      duration: 1.05,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 1.4,
      // Keep native scroll position for GSAP pin + scrub
      autoRaf: false,
    });

    lenis.on("scroll", ScrollTrigger.update);

    const ticker = (time: number) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(ticker);
    gsap.ticker.lagSmoothing(0);

    // Expose for debugging / late refresh after rail mounts
    (window as unknown as { __lenis?: Lenis }).__lenis = lenis;
    const warm = window.setTimeout(() => ScrollTrigger.refresh(), 500);

    return () => {
      window.clearTimeout(warm);
      gsap.ticker.remove(ticker);
      delete (window as unknown as { __lenis?: Lenis }).__lenis;
      lenis.destroy();
    };
  }, []);

  return null;
}
