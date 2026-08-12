"use client";

import { useEffect, useRef } from "react";
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useSpring,
} from "framer-motion";
import { ArrowDownRight } from "lucide-react";
import { site } from "@/data/site";
import SkyScene from "@/components/SkyScene";
import { useTheme } from "@/components/ThemeProvider";

export default function Hero() {
  const { skyTheme } = useTheme();
  const isDark = skyTheme === "dark";
  const sectionRef = useRef<HTMLElement>(null);

  const rawX = useMotionValue(50);
  const rawY = useMotionValue(40);
  const x = useSpring(rawX, { stiffness: 120, damping: 28, mass: 0.35 });
  const y = useSpring(rawY, { stiffness: 120, damping: 28, mass: 0.35 });
  const glow = useMotionTemplate`radial-gradient(520px circle at ${x}% ${y}%, ${
    isDark
      ? "rgba(180, 210, 255, 0.16)"
      : "rgba(255, 170, 90, 0.28)"
  }, transparent 55%)`;

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (prefersReduced) return;

    const onMove = (e: PointerEvent) => {
      const rect = el.getBoundingClientRect();
      const px = ((e.clientX - rect.left) / rect.width) * 100;
      const py = ((e.clientY - rect.top) / rect.height) * 100;
      rawX.set(px);
      rawY.set(py);
    };

    el.addEventListener("pointermove", onMove);
    return () => el.removeEventListener("pointermove", onMove);
  }, [rawX, rawY]);

  return (
    <section
      ref={sectionRef}
      id="top"
      className="stage-panel relative flex min-h-[100svh] items-end overflow-hidden pb-16 pt-28 sm:items-center sm:pb-0 sm:pt-20"
    >
      <SkyScene />

      <motion.div
        className="pointer-events-none absolute inset-0 z-[1] mix-blend-soft-light"
        style={{ background: glow }}
        aria-hidden
      />

      <div className="hero-content relative z-10 mx-auto w-full max-w-6xl px-5 sm:px-8">
        <div className="max-w-xl lg:max-w-lg">
          <motion.h1
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.06, ease: [0.22, 1, 0.36, 1] }}
            className="font-[family-name:var(--font-display)] text-[clamp(3.5rem,9vw,6.25rem)] leading-[0.92] tracking-tight text-[var(--cream)]"
            style={{
              textShadow: isDark
                ? "0 8px 40px rgba(0,0,0,0.35)"
                : "0 1px 0 rgba(255,250,244,0.55), 0 12px 36px rgba(243,230,216,0.75)",
            }}
          >
            {site.name}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.16, ease: [0.22, 1, 0.36, 1] }}
            className="mt-6 max-w-lg text-xl font-medium leading-relaxed text-[var(--muted)] sm:text-2xl"
          >
            {site.tagline}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.26, ease: [0.22, 1, 0.36, 1] }}
            className="mt-10 flex flex-wrap items-center gap-4"
          >
            <motion.a
              href="#work"
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
              className="btn-spell inline-flex items-center gap-2 px-7 py-3.5 text-base font-medium tracking-wide"
            >
              View work
              <ArrowDownRight size={16} />
            </motion.a>
            <motion.a
              href="#contact"
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
              className="btn-ghost inline-flex items-center gap-2 px-7 py-3.5 text-base tracking-wide"
            >
              Contact
            </motion.a>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
