import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import {
  getProject,
  projectSlugAliases,
  projects,
} from "@/data/projects";
import { projectPath } from "@/lib/slug";
import { site } from "@/data/site";

type Props = { params: Promise<{ slug: string }> };

const base = () =>
  process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) return { title: "Project" };

  const url = `${base()}${projectPath(project.slug)}`;
  return {
    title: project.title,
    description: project.summary,
    alternates: { canonical: url },
    openGraph: {
      title: `${project.title} — ${site.name}`,
      description: project.summary,
      url,
      type: "article",
      siteName: site.name,
    },
    twitter: {
      card: "summary_large_image",
      title: project.title,
      description: project.summary,
    },
  };
}

export default async function WorkProjectPage({ params }: Props) {
  const { slug } = await params;

  const aliasTarget = projectSlugAliases[slug];
  if (aliasTarget && aliasTarget !== slug) {
    redirect(projectPath(aliasTarget));
  }

  const project = getProject(slug);
  if (!project) notFound();

  const path = projectPath(project.slug);

  return (
    <>
      <Nav />
      <main className="flex-1 pt-28 pb-24">
        <article className="mx-auto max-w-3xl px-5 sm:px-8">
          <Link
            href="/#work"
            className="inline-flex items-center gap-2 text-sm text-[var(--muted)] transition-colors hover:text-[var(--accent)]"
          >
            <ArrowLeft size={16} />
            Back to work
          </Link>

          <p className="mt-10 font-mono text-xs tracking-[0.18em] text-[var(--silver-dim)] uppercase">
            {path}
          </p>
          <p className="mt-3 text-sm text-[var(--accent-hot)]">{project.year}</p>
          <h1 className="mt-2 font-[family-name:var(--font-display)] text-4xl text-[var(--cream)] sm:text-5xl">
            {project.title}
          </h1>
          <p className="mt-5 text-lg text-[var(--muted)]">{project.summary}</p>

          <div className="mt-8 flex flex-wrap gap-3">
            {project.tags.map((tag) => (
              <span
                key={tag}
                className="border border-[var(--line)] px-3 py-1 text-xs tracking-wide text-[var(--muted)] uppercase"
              >
                {tag}
              </span>
            ))}
          </div>

          <div className="mt-12 border-t border-[var(--line)] pt-10">
            <h2 className="font-[family-name:var(--font-display)] text-xl text-[var(--cream)]">
              Overview
            </h2>
            <p className="mt-4 leading-relaxed text-[var(--muted)]">
              {project.description}
            </p>
          </div>

          {project.href && (
            <a
              href={project.href}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-spell mt-10 inline-flex items-center gap-2 px-5 py-3 text-sm font-medium"
            >
              View project
              <ArrowUpRight size={16} />
            </a>
          )}
        </article>
      </main>
      <Footer />
    </>
  );
}
