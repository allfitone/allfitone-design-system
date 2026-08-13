export const explorerThemeStorageKey = "afo-explorer-theme-v1";

export const explorerThemeInitScript = `(() => {
  const key = ${JSON.stringify(explorerThemeStorageKey)};
  let stored = null;
  try { stored = localStorage.getItem(key); } catch {}
  const theme = stored === "dark" || stored === "light"
    ? stored
    : matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  document.documentElement.dataset.afoTheme = theme;
  document.documentElement.style.colorScheme = theme;
})()`;
