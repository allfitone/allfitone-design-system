"use client";

import { useEffect, useState } from "react";

type Theme = "dark" | "light";

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>("dark");

  useEffect(() => {
    document.documentElement.dataset.afoTheme = theme;
    document.documentElement.style.colorScheme = theme;
  }, [theme]);

  return (
    <div className="theme-toggle" aria-label="Preview theme">
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
