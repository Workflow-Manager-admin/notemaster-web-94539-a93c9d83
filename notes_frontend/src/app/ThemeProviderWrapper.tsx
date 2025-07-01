"use client";
import { ReactNode } from "react";
import { ThemeProvider } from "./ThemeProvider";

/**
 * Separate client-only component to provide the theme context for the app.
 * Wraps inner app in ThemeProvider so layout.tsx stays server-only.
 */
// PUBLIC_INTERFACE
export default function ThemeProviderWrapper({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider>
      {children}
    </ThemeProvider>
  );
}
