"use client";

import { useEffect, useMemo, useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform, type MotionValue } from "framer-motion";
import { useTheme } from "@/components/ThemeProvider";
import { gsap, registerGsap, ScrollTrigger } from "@/lib/gsap";
import SkyDragon from "@/components/SkyDragon";

const EASE = [0.42, 0, 0.2, 1] as const;
const DURATION = 2.1;

/** Ridge line where the sun clips behind the hills (~% from top). */
const RIDGE = 58;

function Stars({ visible }: { visible: boolean }) {
  const stars = useMemo(
    () =>
      Array.from({ length: 70 }, (_, i) => ({
        id: i,
        left: `${(i * 47) % 100}%`,
        top: `${(i * 29) % 55}%`,
        size: 1 + (i % 3),
        delay: `${(i % 10) * 0.2}s`,
        duration: `${2 + (i % 5) * 0.35}s`,
      })),
    [],
  );

  return (
    <motion.div
      className="absolute inset-0"
      initial={false}
      animate={{ opacity: visible ? 1 : 0 }}
      transition={{ duration: 1.2, delay: visible ? 0.55 : 0, ease: EASE }}
    >
      {stars.map((star) => (
        <span
          key={star.id}
          className="sky-star absolute rounded-full bg-white"
          style={{
            left: star.left,
            top: star.top,
            width: star.size,
            height: star.size,
            animationDuration: star.duration,
            animationDelay: star.delay,
          }}
        />
      ))}
    </motion.div>
  );
}

function Hills({
  farY,
  midY,
  nearY,
}: {
  farY: MotionValue<number>;
  midY: MotionValue<number>;
  nearY: MotionValue<number>;
}) {
  const { skyTheme } = useTheme();
  const isDark = skyTheme === "dark";

  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[6] h-[46%] sm:h-[42%]">
      <motion.svg
        className="absolute inset-x-0 bottom-[18%] h-[70%] w-full will-change-transform"
        viewBox="0 0 1440 320"
        preserveAspectRatio="none"
        style={{ y: farY }}
        aria-hidden
      >
        <path
          d="M0 220 C120 180 220 140 340 155 C480 175 520 240 680 210 C820 185 900 120 1040 145 C1180 170 1280 210 1440 180 L1440 320 L0 320 Z"
          fill={isDark ? "#0a0f1c" : "#2a1a12"}
          opacity={isDark ? 0.85 : 0.55}
        />
      </motion.svg>

      <motion.svg
        className="absolute inset-x-0 bottom-[6%] h-[78%] w-full will-change-transform"
        viewBox="0 0 1440 360"
        preserveAspectRatio="none"
        style={{ y: midY }}
        aria-hidden
      >
        <path
          d="M0 240 C160 200 240 150 380 170 C520 192 560 260 720 230 C880 200 940 140 1100 165 C1240 188 1320 230 1440 210 L1440 360 L0 360 Z"
          fill={isDark ? "#060a14" : "#1c120c"}
          opacity={isDark ? 0.95 : 0.72}
        />
      </motion.svg>

      <motion.svg
        className="absolute inset-x-0 bottom-0 h-full w-full will-change-transform"
        viewBox="0 0 1440 400"
        preserveAspectRatio="none"
        style={{ y: nearY }}
        aria-hidden
      >
        <defs>
          <linearGradient id="hill-face" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={isDark ? "#0c1220" : "#241610"} />
            <stop offset="100%" stopColor={isDark ? "#070b18" : "#16100c"} />
          </linearGradient>
        </defs>
        <path
          d="M0 265 C90 235 170 205 280 220 C400 238 450 290 580 270 C720 248 760 195 900 215 C1040 235 1100 285 1220 260 C1320 242 1380 250 1440 245 L1440 400 L0 400 Z"
          fill="url(#hill-face)"
        />
        <path
          d="M0 265 C90 235 170 205 280 220 C400 238 450 290 580 270 C720 248 760 195 900 215 C1040 235 1100 285 1220 260 C1320 242 1380 250 1440 245"
          fill="none"
          stroke={isDark ? "rgba(196,92,58,0.25)" : "rgba(212,82,26,0.2)"}
          strokeWidth="2"
        />
      </motion.svg>

      <div className="absolute inset-x-0 bottom-0 h-[35%] bg-gradient-to-t from-[var(--ink)] to-transparent" />
    </div>
  );
}

export default function SkyScene() {
  const { skyTheme, isAnimating } = useTheme();
  const isDark = skyTheme === "dark";
  const rootRef = useRef<HTMLDivElement>(null);
  const scrollY = useMotionValue(0);
  const smoothY = useSpring(scrollY, { stiffness: 90, damping: 28, mass: 0.4 });

  const farY = useTransform(smoothY, [0, 600], [0, 28]);
  const midY = useTransform(smoothY, [0, 600], [0, 55]);
  const nearY = useTransform(smoothY, [0, 600], [0, 95]);
  const sunParallax = useTransform(smoothY, [0, 600], [0, 40]);

  useEffect(() => {
    registerGsap();
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (prefersReduced) return;

    const onScroll = () => {
      const hero = document.getElementById("top");
      if (!hero) return;
      const rect = hero.getBoundingClientRect();
      const progress = Math.min(600, Math.max(0, -rect.top));
      scrollY.set(progress);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: "#top",
        start: "top top",
        end: "bottom top",
        onUpdate: (self) => scrollY.set(self.progress * 600),
      });
    });

    return () => {
      window.removeEventListener("scroll", onScroll);
      ctx.revert();
    };
  }, [scrollY]);

  return (
    <div ref={rootRef} className="absolute inset-0 -z-0 overflow-hidden" aria-hidden>
      <div
        className="absolute inset-0 transition-[background] duration-[1800ms] ease-in-out"
        style={{
          background: isDark
            ? `linear-gradient(180deg, var(--sky-top) 0%, var(--sky-mid) 40%, var(--sky-bot) 68%, #1a0e18 100%)`
            : `linear-gradient(180deg, var(--sky-top) 0%, var(--sky-mid) 48%, var(--sky-bot) 78%, #ffc9a0 100%)`,
        }}
      />

      {/* Horizon glow — breathes along the ridge */}
      <motion.div
        className="horizon-breath absolute inset-x-0 z-[1]"
        style={{ top: `${RIDGE - 18}%`, height: "42%" }}
        initial={false}
        animate={{
          opacity: isAnimating ? 1 : isDark ? 0.5 : 0.7,
        }}
        transition={{ duration: DURATION * 0.7, ease: EASE }}
      >
        <div
          className="absolute inset-0"
          style={{
            background: `radial-gradient(ellipse 70% 55% at 72% 70%, color-mix(in srgb, var(--horizon) 70%, transparent), transparent 70%)`,
          }}
        />
      </motion.div>

      <motion.div
        className="drift-x absolute top-[20%] left-[6%] z-0 h-16 w-40 rounded-full bg-white/40 blur-2xl sm:h-20 sm:w-56"
        initial={false}
        animate={{ opacity: isDark ? 0 : 1, y: isDark ? 24 : 0 }}
        transition={{ duration: 1.3, ease: EASE }}
      />
      <motion.div
        className="absolute top-[28%] left-[16%] z-0 h-12 w-28 rounded-full bg-white/28 blur-xl"
        style={{ animation: "drift-x 22s ease-in-out infinite reverse" }}
        initial={false}
        animate={{ opacity: isDark ? 0 : 0.85, y: isDark ? 18 : 0 }}
        transition={{ duration: 1.3, delay: 0.05, ease: EASE }}
      />

      <Stars visible={isDark} />

      <SkyDragon />

      {/* Sun/moon behind the dragon */}
      <motion.div
        className="absolute right-[10%] z-[3] h-32 w-32 sm:right-[14%] sm:h-44 sm:w-44"
        initial={false}
        animate={{
          top: isDark ? `${RIDGE + 14}%` : "14%",
          opacity: isDark ? 0 : 1,
          scale: isDark ? 0.78 : 1,
          x: isDark ? 18 : 0,
        }}
        transition={{ duration: DURATION, ease: EASE }}
        style={{ y: sunParallax, willChange: "top, opacity, transform" }}
      >
        <motion.div
          className="sun-rays absolute inset-[-22%] rounded-full"
          initial={false}
          animate={{ opacity: isDark ? 0.15 : 0.75 }}
          transition={{ duration: DURATION, ease: EASE }}
        />
        <motion.div
          className="absolute inset-0 rounded-full"
          initial={false}
          animate={{
            background: isDark
              ? "radial-gradient(circle at 40% 35%, #ffd08a, #ff8a4a 50%, #e04520 100%)"
              : "radial-gradient(circle at 40% 35%, #fff1a8, #ffcf5c 55%, #ff8f5c 100%)",
            boxShadow: isDark
              ? "0 0 60px rgba(255,120,60,0.55), 0 0 120px rgba(224,69,32,0.35)"
              : "0 0 80px rgba(255,179,71,0.55), 0 0 140px rgba(255,143,92,0.35)",
          }}
          transition={{ duration: DURATION, ease: EASE }}
        />
      </motion.div>

      <motion.div
        className="absolute right-[12%] z-[3] h-24 w-24 sm:right-[16%] sm:h-36 sm:w-36"
        initial={false}
        animate={{
          top: isDark ? "12%" : `${RIDGE + 16}%`,
          opacity: isDark ? 1 : 0,
          scale: isDark ? 1 : 0.8,
          x: isDark ? 0 : -12,
        }}
        transition={{
          duration: DURATION,
          ease: EASE,
          delay: isDark ? 0.35 : 0,
        }}
        style={{ y: sunParallax }}
      >
        <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_35%_35%,#fff,#e8eef8_45%,#c5d0e0_100%)] shadow-[0_0_60px_rgba(255,255,255,0.35)]" />
        <div className="absolute top-[18%] left-[22%] h-3.5 w-3.5 rounded-full bg-[#d5dde8]/70 sm:h-5 sm:w-5" />
        <div className="absolute top-[46%] left-[48%] h-5 w-5 rounded-full bg-[#cfd8e6]/55 sm:h-7 sm:w-7" />
        <div className="absolute top-[58%] left-[28%] h-2.5 w-2.5 rounded-full bg-[#d7e0ec]/65" />
      </motion.div>

      <Hills farY={farY} midY={midY} nearY={nearY} />
    </div>
  );
}
