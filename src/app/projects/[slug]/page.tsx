import { redirect } from "next/navigation";
import { getProject, projectSlugAliases, projects } from "@/data/projects";
import { projectPath } from "@/lib/slug";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  const current = projects.map((p) => ({ slug: p.slug }));
  const aliases = Object.keys(projectSlugAliases).map((slug) => ({ slug }));
  return [...current, ...aliases];
}

/** Legacy `/projects/:slug` → canonical `/work/:slug`. */
export default async function LegacyProjectRedirect({ params }: Props) {
  const { slug } = await params;
  const project = getProject(slug);
  if (project) redirect(projectPath(project.slug));

  const alias = projectSlugAliases[slug];
  if (alias) redirect(projectPath(alias));

  redirect("/#work");
}
