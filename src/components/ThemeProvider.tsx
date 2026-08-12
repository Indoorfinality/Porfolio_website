"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";

export type ThemeMode = "light" | "dark";

type ThemeContextValue = {
  theme: ThemeMode;
  skyTheme: ThemeMode;
  isAnimating: boolean;
  setTheme: (theme: ThemeMode) => void;
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);
const TRANSITION_MS = 2200;

function applyTheme(theme: ThemeMode) {
  const root = document.documentElement;
  root.classList.remove("light", "dark");
  root.classList.add(theme);
  root.style.colorScheme = theme;
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<ThemeMode>("light");
  const [skyTheme, setSkyTheme] = useState<ThemeMode>("light");
  const [isAnimating, setIsAnimating] = useState(false);
  const [ready, setReady] = useState(false);
  const themeRef = useRef<ThemeMode>("light");
  const animatingRef = useRef(false);
  const timers = useRef<number[]>([]);

  const clearTimers = () => {
    timers.current.forEach((id) => window.clearTimeout(id));
    timers.current = [];
  };

  useEffect(() => {
    const stored = window.localStorage.getItem("portfolio-theme") as ThemeMode | null;
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const initial: ThemeMode =
      stored === "light" || stored === "dark" ? stored : prefersDark ? "dark" : "light";
    themeRef.current = initial;
    setThemeState(initial);
    setSkyTheme(initial);
    applyTheme(initial);
    setReady(true);
    return clearTimers;
  }, []);

  const setTheme = useCallback((next: ThemeMode) => {
    if (animatingRef.current || themeRef.current === next) return;

    clearTimers();
    animatingRef.current = true;
    setIsAnimating(true);
    setSkyTheme(next);

    if (next === "dark") {
      // Keep warm sky while the sun sinks behind the hills, then flip to night.
      timers.current.push(
        window.setTimeout(() => {
          applyTheme("dark");
        }, 900),
      );
    } else {
      // Day opens immediately as the sun rises from the ridge.
      applyTheme("light");
    }

    timers.current.push(
      window.setTimeout(() => {
        themeRef.current = next;
        setThemeState(next);
        setSkyTheme(next);
        applyTheme(next);
        window.localStorage.setItem("portfolio-theme", next);
        animatingRef.current = false;
        setIsAnimating(false);
      }, TRANSITION_MS),
    );
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme(skyTheme === "light" ? "dark" : "light");
  }, [setTheme, skyTheme]);

  const value = useMemo(
    () => ({ theme, skyTheme, isAnimating, setTheme, toggleTheme }),
    [theme, skyTheme, isAnimating, setTheme, toggleTheme],
  );

  return (
    <ThemeContext.Provider value={value}>
      <div
        style={{ opacity: ready ? 1 : 0 }}
        className="flex min-h-full flex-1 flex-col transition-opacity duration-300"
      >
        {children}
      </div>
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
}
