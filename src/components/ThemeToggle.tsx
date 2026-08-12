"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/components/ThemeProvider";

export default function ThemeToggle() {
  const { skyTheme, isAnimating, toggleTheme } = useTheme();
  const isDark = skyTheme === "dark";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      disabled={isAnimating}
      aria-label={isDark ? "Switch to sunrise light mode" : "Switch to night dark mode"}
      className="relative inline-flex h-9 w-9 items-center justify-center overflow-hidden rounded-full border border-[var(--line)] bg-[var(--card)] text-[var(--accent-hot)] transition-colors hover:border-[var(--accent-hot)] disabled:cursor-wait disabled:opacity-60"
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={isDark ? "sun" : "moon"}
          initial={{ y: 14, opacity: 0, rotate: -40, scale: 0.7 }}
          animate={{ y: 0, opacity: 1, rotate: 0, scale: 1 }}
          exit={{ y: -14, opacity: 0, rotate: 40, scale: 0.7 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className="inline-flex"
        >
          {isDark ? <Sun size={16} /> : <Moon size={16} />}
        </motion.span>
      </AnimatePresence>
    </button>
  );
}
