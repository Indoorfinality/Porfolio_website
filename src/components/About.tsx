"use client";

import { site } from "@/data/site";
import ExperienceTimeline from "@/components/ExperienceTimeline";

export default function About() {
  return (
    <section id="about" className="stage-panel scroll-mt-20 py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <div className="reveal grid gap-12 lg:grid-cols-[1fr_1.2fr] lg:gap-20">
          <div>
            <p className="eyebrow text-xs font-medium tracking-[0.28em] text-[var(--accent-hot)] uppercase">
              About
            </p>
            <h2 className="mt-3 font-[family-name:var(--font-display)] text-5xl text-[var(--cream)] sm:text-6xl">
              From robotics labs to RAG in production.
            </h2>
            <p className="mt-5 text-lg text-[var(--muted)] leading-relaxed">
              {site.summary} Currently studying {site.education.degree} at{" "}
              {site.education.school}.
            </p>
            <p className="mt-4 text-base text-[var(--muted)]">
              {site.education.school} · {site.education.period}
            </p>
          </div>

          <ExperienceTimeline />
        </div>
      </div>
    </section>
  );
}
