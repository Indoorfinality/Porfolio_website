"use client";

import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { site } from "@/data/site";
import { GithubIcon, LinkedinIcon } from "@/components/icons";
import ThemeToggle from "@/components/ThemeToggle";

const links = [
  { href: "#work", label: "Work" },
  { href: "#about", label: "About" },
  { href: "#skills", label: "Skills" },
  { href: "#contact", label: "Contact" },
];

export default function Nav() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
        scrolled || open
          ? "border-b border-[var(--line)] bg-[var(--ink)]/90 backdrop-blur-md"
          : "bg-transparent"
      }`}
    >
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 sm:px-8">
        <motion.a
          href="#top"
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="font-[family-name:var(--font-display)] text-2xl tracking-wide text-[var(--cream)]"
        >
          {site.shortName}
          <span className="text-[var(--accent-hot)]">.</span>
        </motion.a>

        <ul className="hidden items-center gap-8 md:flex">
          {links.map((l, i) => (
            <motion.li
              key={l.href}
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.05 * i }}
            >
              <a href={l.href} className="nav-link text-sm tracking-wide">
                {l.label}
              </a>
            </motion.li>
          ))}
          <motion.li
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.24 }}
            className="flex items-center gap-3 border-l border-[var(--line)] pl-6"
          >
            <ThemeToggle />
            <a
              href={site.links.github}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
              className="text-[var(--silver-dim)] transition-colors hover:text-[var(--accent-hot)]"
            >
              <GithubIcon size={18} />
            </a>
            <a
              href={site.links.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              className="text-[var(--silver-dim)] transition-colors hover:text-[var(--accent-hot)]"
            >
              <LinkedinIcon size={18} />
            </a>
          </motion.li>
        </ul>

        <div className="flex items-center gap-3 md:hidden">
          <ThemeToggle />
          <button
            type="button"
            className="text-[var(--cream)]"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden border-t border-[var(--line)] bg-[var(--ink)] md:hidden"
          >
            <div className="px-5 py-8">
              <ul className="flex flex-col gap-5">
                {links.map((l, i) => (
                  <motion.li
                    key={l.href}
                    initial={{ opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.05 * i }}
                  >
                    <a
                      href={l.href}
                      className="font-[family-name:var(--font-display)] text-2xl text-[var(--cream)]"
                      onClick={() => setOpen(false)}
                    >
                      {l.label}
                    </a>
                  </motion.li>
                ))}
              </ul>
              <div className="mt-8 flex gap-4">
                <a href={site.links.github} target="_blank" rel="noopener noreferrer">
                  <GithubIcon className="text-[var(--accent-hot)]" size={22} />
                </a>
                <a href={site.links.linkedin} target="_blank" rel="noopener noreferrer">
                  <LinkedinIcon className="text-[var(--accent-hot)]" size={22} />
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
