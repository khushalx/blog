"use client";

import { useSyncExternalStore } from "react";
import { Moon, Sun } from "lucide-react";
import { themeStorageKey } from "@/lib/theme";

const themeChangeEvent = "long-view-theme-change";
const isDark = () => document.documentElement.dataset.theme === "dark";
const serverSnapshot = () => false;

function subscribe(onChange: () => void) {
  const root = document.documentElement;
  const system = window.matchMedia("(prefers-color-scheme: dark)");
  const applySystem = () => {
    if (root.dataset.themePreference === "system") {
      root.dataset.theme = system.matches ? "dark" : "light";
      onChange();
    }
  };
  const syncTabs = (event: StorageEvent) => {
    if (event.key !== themeStorageKey && event.key !== null) return;
    const value = event.newValue;
    root.dataset.themePreference = value === "light" || value === "dark" ? value : "system";
    root.dataset.theme = root.dataset.themePreference === "system"
      ? (system.matches ? "dark" : "light") : root.dataset.themePreference;
    onChange();
  };
  window.addEventListener(themeChangeEvent, onChange);
  window.addEventListener("storage", syncTabs);
  system.addEventListener("change", applySystem);
  return () => {
    window.removeEventListener(themeChangeEvent, onChange);
    window.removeEventListener("storage", syncTabs);
    system.removeEventListener("change", applySystem);
  };
}

export function ThemeToggle() {
  const dark = useSyncExternalStore(subscribe, isDark, serverSnapshot);
  return (
    <button
      type="button"
      className="theme-toggle"
      aria-label="Dark mode"
      aria-pressed={dark}
      title={dark ? "Switch to light mode" : "Switch to dark mode"}
      onClick={() => {
        const theme = isDark() ? "light" : "dark";
        document.documentElement.dataset.theme = theme;
        document.documentElement.dataset.themePreference = theme;
        try { localStorage.setItem(themeStorageKey, theme); } catch { /* Keep the toggle usable when storage is unavailable. */ }
        window.dispatchEvent(new Event(themeChangeEvent));
      }}
    >
      <Moon className="theme-icon-moon" size={19} aria-hidden="true" />
      <Sun className="theme-icon-sun" size={19} aria-hidden="true" />
    </button>
  );
}
