import { ExternalLink } from "lucide-react";
import { site } from "@/data/site";
import { GithubIcon, LinkedinIcon } from "@/components/icons";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-[var(--line)] py-10">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-5 sm:flex-row sm:items-center sm:justify-between sm:px-8">
        <p className="text-sm text-[var(--muted)]">
          © {year} {site.name}
        </p>
        <div className="flex items-center gap-5">
          <a
            href={site.links.github}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[var(--muted)] transition-colors hover:text-[var(--accent)]"
            aria-label="GitHub"
          >
            <GithubIcon size={18} />
          </a>
          <a
            href={site.links.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[var(--muted)] transition-colors hover:text-[var(--accent)]"
            aria-label="LinkedIn"
          >
            <LinkedinIcon size={18} />
          </a>
          <a
            href={site.links.kaggle}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-sm text-[var(--muted)] transition-colors hover:text-[var(--accent)]"
          >
            Kaggle
            <ExternalLink size={14} />
          </a>
        </div>
      </div>
    </footer>
  );
}
