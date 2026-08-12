"use client";

import { useEffect, useRef } from "react";
import { featuredProjects } from "@/data/projects";
import ProjectCard from "@/components/ProjectCard";
import { gsap, registerGsap, ScrollTrigger } from "@/lib/gsap";

export default function Work() {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLUListElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    registerGsap();
    const section = sectionRef.current;
    const track = trackRef.current;
    if (!section || !track) return;

    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const desktopMq = window.matchMedia("(min-width: 768px)");
    if (prefersReduced || !desktopMq.matches) return;

    const cards = Array.from(
      track.querySelectorAll<HTMLElement>(".quest-card"),
    );

    const getDistance = () =>
      Math.max(track.scrollWidth - window.innerWidth + 120, 1);

    const ctx = gsap.context(() => {
      gsap.set(track, { x: 0 });
      gsap.set(cards, { y: 48, opacity: 0.4, scale: 0.92 });

      if (headingRef.current) {
        gsap.fromTo(
          headingRef.current,
          { y: 28, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.85,
            ease: "power3.out",
            scrollTrigger: {
              trigger: section,
              start: "top 72%",
              toggleActions: "play none none reverse",
            },
          },
        );
      }

      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: () => `+=${getDistance() + window.innerHeight * 0.4}`,
          scrub: 0.9,
          pin: true,
          pinSpacing: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      tl.to(
        track,
        {
          x: () => -getDistance(),
          ease: "none",
          duration: 1,
        },
        0,
      );

      cards.forEach((card, i) => {
        tl.to(
          card,
          {
            y: 0,
            opacity: 1,
            scale: 1,
            ease: "power1.out",
            duration: 0.18,
          },
          i * 0.07,
        );
      });
    }, section);

    const refresh = () => ScrollTrigger.refresh();
    const t1 = window.setTimeout(refresh, 100);
    const t2 = window.setTimeout(refresh, 600);
    window.addEventListener("resize", refresh);
    desktopMq.addEventListener("change", refresh);

    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
      window.removeEventListener("resize", refresh);
      desktopMq.removeEventListener("change", refresh);
      ctx.revert();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="work"
      className="work-pin stage-panel relative scroll-mt-20"
    >
      <div className="parallax-orb pointer-events-none absolute top-24 left-[10%] h-40 w-40 rounded-full bg-[var(--accent)]/20 blur-3xl" />
      <div className="parallax-orb pointer-events-none absolute top-40 right-[12%] h-32 w-32 rounded-full bg-[var(--silver)]/8 blur-3xl" />

      <div className="hidden min-h-[100svh] flex-col justify-center py-24 md:flex">
        <div
          ref={headingRef}
          className="work-heading mx-auto w-full max-w-6xl px-5 sm:px-8"
        >
          <p className="eyebrow text-xs font-medium tracking-[0.28em] text-[var(--accent-hot)] uppercase">
            Selected work
          </p>
          <h2 className="mt-4 max-w-2xl font-[family-name:var(--font-display)] text-5xl text-[var(--cream)] sm:text-6xl">
            Systems that extract, reason, and automate.
          </h2>
          <div className="section-rule mt-6 max-w-md" />
          <p className="mt-5 max-w-xl text-lg text-[var(--muted)]">
            Scroll to move through projects — each one a build that shipped.
          </p>
        </div>

        <div className="mt-14 w-full overflow-hidden">
          <ul
            ref={trackRef}
            className="work-track flex w-max gap-6 px-5 will-change-transform sm:px-8 md:px-[max(2rem,calc((100vw-72rem)/2+2rem))]"
          >
            {featuredProjects.map((project, i) => (
              <ProjectCard
                key={project.slug}
                project={project}
                index={i}
                variant="rail"
              />
            ))}
          </ul>
        </div>
      </div>

      <div className="py-24 sm:py-32 md:hidden">
        <div className="mx-auto max-w-6xl px-5 sm:px-8">
          <div className="reveal max-w-2xl">
            <p className="eyebrow text-xs font-medium tracking-[0.28em] text-[var(--accent-hot)] uppercase">
              Selected work
            </p>
            <h2 className="mt-4 font-[family-name:var(--font-display)] text-5xl text-[var(--cream)]">
              Systems that extract, reason, and automate.
            </h2>
            <div className="section-rule mt-6" />
            <p className="mt-5 text-lg text-[var(--muted)]">
              A focused set of AI, RPA, ML, and robotics builds.
            </p>
          </div>
          <ul className="mt-16 divide-y divide-[var(--silver)]/10 border-y border-[var(--silver)]/10">
            {featuredProjects.map((project, i) => (
              <ProjectCard key={project.slug} project={project} index={i} />
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
