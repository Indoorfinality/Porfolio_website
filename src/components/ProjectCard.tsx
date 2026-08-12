"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import type { Project } from "@/data/projects";
import { getProjectHref } from "@/data/projects";

type Props = {
  project: Project;
  index: number;
  variant?: "list" | "rail";
};

const tagVariants = {
  hidden: { opacity: 0, y: 8 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: 0.05 * i,
      duration: 0.35,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  }),
};

export default function ProjectCard({
  project,
  index,
  variant = "list",
}: Props) {
  if (variant === "rail") {
    return (
      <li className="quest-card relative w-[min(85vw,28rem)] shrink-0 snap-start">
        <Link
          href={getProjectHref(project)}
          className="group relative flex h-full min-h-[22rem] flex-col justify-between overflow-hidden border border-[var(--line)] bg-[var(--card)] p-7 backdrop-blur-sm hover:border-[var(--accent-hot)]/50"
        >
          <span className="card-shine" aria-hidden />
          <div
            className="pointer-events-none absolute -top-16 -right-16 h-40 w-40 rounded-full bg-[var(--accent)]/25 blur-3xl opacity-70 transition-opacity group-hover:opacity-100"
            aria-hidden
          />
          <div>
            <div className="flex items-center justify-between gap-3">
              <motion.span
                className="font-mono text-xs tracking-[0.22em] text-[var(--accent-hot)]"
                initial={{ opacity: 0, y: 6 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4 }}
              >
                {String(index + 1).padStart(2, "0")}
              </motion.span>
              <span className="text-xs text-[var(--silver-dim)]">{project.year}</span>
            </div>
            <h3 className="mt-6 font-[family-name:var(--font-display)] text-4xl leading-tight text-[var(--cream)] transition-colors group-hover:text-[var(--accent-hot)]">
              {project.title}
            </h3>
            <p className="mt-4 text-[var(--muted)]">{project.summary}</p>
          </div>
          <div className="mt-8 flex items-end justify-between gap-4">
            <div className="flex flex-wrap gap-2">
              {project.tags.slice(0, 3).map((tag, i) => (
                <motion.span
                  key={tag}
                  custom={i}
                  variants={tagVariants}
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true }}
                  className="border border-[var(--line)] px-2 py-0.5 text-[10px] tracking-wide text-[var(--silver-dim)] uppercase"
                >
                  {tag}
                </motion.span>
              ))}
            </div>
            <motion.span
              className="text-[var(--accent-hot)] transition-transform group-hover:translate-x-1 group-hover:-translate-y-1"
            >
              <ArrowUpRight size={22} />
            </motion.span>
          </div>
        </Link>
      </li>
    );
  }

  return (
    <li className="reveal group">
      <Link
        href={getProjectHref(project)}
        className="relative grid gap-4 overflow-hidden py-8 transition-colors sm:grid-cols-[5rem_1fr_auto] sm:items-center sm:gap-8"
      >
        <span className="card-shine card-shine--soft" aria-hidden />
        <motion.span
          className="font-mono text-sm text-[var(--accent-hot)]"
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          {String(index + 1).padStart(2, "0")}
        </motion.span>
        <div>
          <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
            <h3 className="font-[family-name:var(--font-display)] text-2xl text-[var(--cream)] transition-colors group-hover:text-[var(--accent-hot)] sm:text-3xl">
              {project.title}
            </h3>
            <span className="text-sm text-[var(--muted)]">{project.year}</span>
          </div>
          <p className="mt-2 max-w-xl text-[var(--muted)]">{project.summary}</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {project.tags.slice(0, 4).map((tag, i) => (
              <motion.span
                key={tag}
                custom={i}
                variants={tagVariants}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
                className="text-xs tracking-wide text-[var(--muted)] uppercase"
              >
                {tag}
              </motion.span>
            ))}
          </div>
        </div>
        <span className="hidden text-[var(--accent-hot)] transition-transform group-hover:translate-x-1 group-hover:-translate-y-1 sm:inline-flex">
          <ArrowUpRight size={22} />
        </span>
      </Link>
    </li>
  );
}
