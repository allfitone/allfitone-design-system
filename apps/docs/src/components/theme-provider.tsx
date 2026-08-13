"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import { explorerThemeStorageKey } from "@/lib/theme";

export type ExplorerTheme = "dark" | "light";

type ThemeContextValue = {
  theme: ExplorerTheme;
  setTheme: (theme: ExplorerTheme) => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

function isTheme(value: string | null): value is ExplorerTheme {
  return value === "dark" || value === "light";
}

function systemTheme(media: MediaQueryList): ExplorerTheme {
  return media.matches ? "dark" : "light";
}

function applyTheme(theme: ExplorerTheme) {
  document.documentElement.dataset.afoTheme = theme;
  document.documentElement.style.colorScheme = theme;
}

function readStoredTheme() {
  try {
    return window.localStorage.getItem(explorerThemeStorageKey);
  } catch {
    return null;
  }
}

function storeTheme(theme: ExplorerTheme) {
  try {
    window.localStorage.setItem(explorerThemeStorageKey, theme);
  } catch {
    // The applied DOM theme still works when storage is unavailable.
  }
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setEffectiveTheme] = useState<ExplorerTheme>("dark");

  useEffect(() => {
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const stored = readStoredTheme();
    const initialTheme = isTheme(stored)
      ? stored
      : document.documentElement.dataset.afoTheme === "light"
        ? "light"
        : systemTheme(media);

    applyTheme(initialTheme);
    const initialSyncFrame = window.requestAnimationFrame(() => setEffectiveTheme(initialTheme));

    const syncSystemTheme = () => {
      if (!isTheme(readStoredTheme())) {
        const nextTheme = systemTheme(media);
        setEffectiveTheme(nextTheme);
        applyTheme(nextTheme);
      }
    };
    const syncStoredTheme = (event: StorageEvent) => {
      if (event.key !== explorerThemeStorageKey) return;
      const nextTheme = isTheme(event.newValue) ? event.newValue : systemTheme(media);
      setEffectiveTheme(nextTheme);
      applyTheme(nextTheme);
    };

    media.addEventListener("change", syncSystemTheme);
    window.addEventListener("storage", syncStoredTheme);
    return () => {
      window.cancelAnimationFrame(initialSyncFrame);
      media.removeEventListener("change", syncSystemTheme);
      window.removeEventListener("storage", syncStoredTheme);
    };
  }, []);

  const value = useMemo<ThemeContextValue>(() => ({
    theme,
    setTheme: (nextTheme) => {
      storeTheme(nextTheme);
      setEffectiveTheme(nextTheme);
      applyTheme(nextTheme);
    },
  }), [theme]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useExplorerTheme() {
  const context = useContext(ThemeContext);
  if (!context) throw new Error("useExplorerTheme must be used within ThemeProvider.");
  return context;
}
