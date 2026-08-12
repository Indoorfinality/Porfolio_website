"use client";

import { useEffect, useState } from "react";
import { gsap, registerGsap, ScrollTrigger } from "@/lib/gsap";

const STAGES = [
  { id: "top", label: "01 · INTRO", href: "#top" },
  { id: "work", label: "02 · WORK", href: "#work" },
  { id: "about", label: "03 · ABOUT", href: "#about" },
  { id: "skills", label: "04 · SKILLS", href: "#skills" },
  { id: "contact", label: "05 · CONTACT", href: "#contact" },
];

export default function ScrollHUD() {
  const [progress, setProgress] = useState(0);
  const [activeId, setActiveId] = useState(STAGES[0].id);

  useEffect(() => {
    registerGsap();
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const update = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const p = max > 0 ? window.scrollY / max : 0;
      setProgress(Math.min(1, Math.max(0, p)));
    };

    update();
    window.addEventListener("scroll", update, { passive: true });

    if (prefersReduced) {
      return () => window.removeEventListener("scroll", update);
    }

    const triggers = STAGES.map((s) =>
      ScrollTrigger.create({
        trigger: `#${s.id}`,
        start: "top center",
        end: "bottom center",
        onEnter: () => setActiveId(s.id),
        onEnterBack: () => setActiveId(s.id),
      }),
    );

    return () => {
      window.removeEventListener("scroll", update);
      triggers.forEach((t) => t.kill());
    };
  }, []);

  const stage = STAGES.find((s) => s.id === activeId)?.label ?? STAGES[0].label;

  return (
    <>
      <div
        className="pointer-events-none fixed top-0 right-0 left-0 z-[60] h-[3px] bg-[var(--line)]"
        aria-hidden
      >
        <div
          className="h-full origin-left transition-[width] duration-75"
          style={{
            width: `${progress * 100}%`,
            background:
              "linear-gradient(90deg, var(--horizon) 0%, var(--accent-hot) 55%, var(--sun) 100%)",
            boxShadow: "0 0 10px var(--accent-glow)",
          }}
        />
      </div>

      <div className="pointer-events-none fixed top-20 right-4 z-[55] hidden font-mono text-[10px] tracking-[0.22em] text-[var(--silver)] uppercase sm:block md:right-8">
        <div className="border border-[var(--line)] bg-[var(--card)] px-3 py-2 backdrop-blur-sm">
          <span className="text-[var(--accent-hot)]">{stage}</span>
          <div className="mt-1 text-[var(--silver-dim)]">
            {Math.round(progress * 100).toString().padStart(3, "0")}%
          </div>
        </div>
      </div>

      <nav
        className="pointer-events-auto fixed top-1/2 left-3 z-[55] hidden -translate-y-1/2 flex-col gap-3 lg:flex"
        aria-label="Stage navigation"
      >
        {STAGES.map((s) => (
          <a
            key={s.id}
            href={s.href}
            title={s.label}
            className="group relative flex h-3 w-3 items-center"
          >
            <span
              className={`block h-2 w-2 rounded-full border border-[var(--silver)]/40 transition-all group-hover:scale-125 group-hover:bg-[var(--silver)] ${
                activeId === s.id
                  ? "bg-[var(--accent-hot)] shadow-[0_0_8px_var(--accent-glow)]"
                  : "bg-transparent"
              }`}
            />
            <span className="pointer-events-none absolute left-5 whitespace-nowrap text-[10px] tracking-widest text-[var(--silver-dim)] opacity-0 transition-opacity group-hover:opacity-100">
              {s.label}
            </span>
          </a>
        ))}
      </nav>
    </>
  );
}
