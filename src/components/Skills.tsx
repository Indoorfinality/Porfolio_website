"use client";

import { skillGroups } from "@/data/skills";

export default function Skills() {
  return (
    <section id="skills" className="stage-panel relative scroll-mt-20 py-24 sm:py-32">
      <div className="parallax-orb pointer-events-none absolute right-[15%] bottom-20 h-48 w-48 rounded-full bg-[var(--accent)]/10 blur-3xl" />
      <div className="parallax-orb pointer-events-none absolute left-[8%] top-32 h-36 w-36 rounded-full bg-[var(--silver)]/5 blur-3xl" />
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <div className="reveal max-w-2xl">
          <p className="eyebrow text-xs font-medium tracking-[0.28em] text-[var(--accent-hot)] uppercase">
            Capabilities
          </p>
          <h2 className="mt-4 font-[family-name:var(--font-display)] text-5xl text-[var(--cream)] sm:text-6xl">
            Stack I ship with.
          </h2>
          <div className="section-rule mt-6 max-w-sm" />
          <p className="mt-5 text-lg text-[var(--muted)]">
            AI pipelines, backend services, RPA, data, and hardware—grouped by how
            they show up in real work.
          </p>
        </div>

        <div className="mt-14 grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
          {skillGroups.map((group) => (
            <div key={group.id}>
              <h3 className="font-[family-name:var(--font-display)] text-2xl text-[var(--accent-hot)]">
                {group.label}
              </h3>
              <ul className="mt-4 space-y-2">
                {group.skills.map((skill) => (
                  <li
                    key={skill}
                    className="skill-unlock border-b border-[var(--line)] pb-2 text-lg text-[var(--cream)]"
                  >
                    {skill}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
