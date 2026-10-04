export const themeStorageKey = "long-view-theme";

// Run in the document head so a saved dark preference is applied before paint.
export const themeInitScript = `(() => {
  let preference = 'system';
  try {
    const saved = localStorage.getItem('${themeStorageKey}');
    if (saved === 'light' || saved === 'dark') preference = saved;
  } catch {}
  const root = document.documentElement;
  root.dataset.themePreference = preference;
  root.dataset.theme = preference === 'system'
    ? (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
    : preference;
})();`;
