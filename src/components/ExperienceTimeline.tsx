"use client";

import { useEffect, useRef, useState } from "react";
import { experience } from "@/data/experience";
import { gsap, registerGsap, ScrollTrigger } from "@/lib/gsap";

export default function ExperienceTimeline() {
  const root = useRef<HTMLDivElement>(null);
  const [activeId, setActiveId] = useState<string | null>(experience[0]?.id ?? null);

  useEffect(() => {
    registerGsap();
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const ctx = gsap.context(() => {
      const items = gsap.utils.toArray<HTMLElement>(".exp-item");

      if (!prefersReduced) {
        items.forEach((item, i) => {
          gsap.fromTo(
            item,
            { opacity: 0, x: -36, filter: "blur(5px)" },
            {
              opacity: 1,
              x: 0,
              filter: "blur(0px)",
              duration: 0.8,
              delay: i * 0.04,
              ease: "power3.out",
              scrollTrigger: {
                trigger: item,
                start: "top 88%",
                toggleActions: "play none none reverse",
              },
            },
          );
        });

        gsap.fromTo(
          ".exp-line",
          { scaleY: 0 },
          {
            scaleY: 1,
            ease: "none",
            scrollTrigger: {
              trigger: ".exp-track",
              start: "top 70%",
              end: "bottom 30%",
              scrub: 0.85,
            },
          },
        );
      }

      items.forEach((item) => {
        ScrollTrigger.create({
          trigger: item,
          start: "top center",
          end: "bottom center",
          onEnter: () => setActiveId(item.dataset.id || null),
          onEnterBack: () => setActiveId(item.dataset.id || null),
        });
      });
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={root} className="exp-track relative pl-8">
      <div className="absolute top-1 bottom-1 left-[7px] w-px origin-top bg-[var(--line)]">
        <div className="exp-line h-full w-full origin-top bg-gradient-to-b from-[var(--accent-hot)] via-[var(--accent)] to-[var(--accent)]/40" />
      </div>

      <ol className="space-y-10">
        {experience.map((job) => {
          const active = activeId === job.id;
          return (
            <li
              key={job.id}
              data-id={job.id}
              className={`exp-item relative transition-opacity duration-300 ${
                active ? "opacity-100" : "opacity-70"
              }`}
            >
              <span
                className={`exp-node absolute top-1.5 -left-[29px] h-2.5 w-2.5 rounded-full border border-[var(--accent-hot)] bg-[var(--ink-elevated)] transition-all duration-300 ${
                  active
                    ? "scale-150 shadow-[0_0_18px_var(--accent-glow)]"
                    : "scale-100 shadow-[0_0_8px_var(--accent-glow)]"
                }`}
              />
              {active && (
                <span className="pointer-events-none absolute top-0 -left-[33px] h-4 w-4 animate-ping rounded-full bg-[var(--accent-hot)]/30" />
              )}
              <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                <h3
                  className={`font-[family-name:var(--font-display)] text-xl transition-colors duration-300 ${
                    active ? "text-[var(--accent-hot)]" : "text-[var(--cream)]"
                  }`}
                >
                  {job.role}
                </h3>
                {job.current && (
                  <span className="text-xs tracking-wide text-[var(--accent-hot)] uppercase">
                    Now
                  </span>
                )}
              </div>
              <p className="mt-1 text-sm text-[var(--muted)]">
                {job.org} · {job.period}
              </p>
              <ul className="mt-3 space-y-1.5 text-sm text-[var(--muted)]">
                {job.bullets.map((b) => (
                  <li key={b} className="leading-relaxed">
                    {b}
                  </li>
                ))}
              </ul>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
