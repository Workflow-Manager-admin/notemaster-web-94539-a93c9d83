"use client";
import { createContext, useEffect, useState, ReactNode } from "react";

// PUBLIC_INTERFACE
export const ThemeContext = createContext<{
  theme: "light" | "dark";
  setTheme: (v: "light" | "dark") => void;
}>({ theme: "light", setTheme: () => {} });

/**
 * Wraps child components and provides theme context and switching.
 * Handles persistence to localStorage and HTML class.
 */
// PUBLIC_INTERFACE
export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    // Prefer saved, else prefers-color-scheme, else light
    const user = typeof window !== "undefined";
    const stored = user ? (localStorage.getItem("theme") as "light" | "dark" | null) : null;
    const prefersDark =
      user && window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
    const t: "light" | "dark" =
      stored ? stored : prefersDark ? "dark" : "light";
    setTheme(t);
    if (user) {
      document.documentElement.classList.toggle("dark", t === "dark");
    }
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    if (typeof window !== "undefined") {
      localStorage.setItem("theme", theme);
    }
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
