"use client";

import { useExplorerTheme } from "@/components/theme-provider";

export function ThemeToggle() {
  const { theme, setTheme } = useExplorerTheme();

  return (
    <div className="theme-toggle" role="group" aria-label="Preview theme">
      {(["dark", "light"] as const).map((item) => (
        <button
          key={item}
          type="button"
          className="theme-toggle__option"
          onClick={() => setTheme(item)}
          aria-pressed={theme === item}
        >
          {item}
        </button>
      ))}
    </div>
  );
}
