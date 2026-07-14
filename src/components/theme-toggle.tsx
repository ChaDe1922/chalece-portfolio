"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";

/**
 * Light/dark toggle. Both icons are rendered in static markup and shown/hidden
 * purely via the `.dark` class (set by next-themes before paint), so there is
 * no hydration mismatch and no setState-in-effect. The click handler reads the
 * resolved theme, which is always defined by the time a user can interact.
 */
export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();

  // Flag <html> for the duration of the switch so globals.css eases the colors
  // (see the ".theme-transition" rule). Scoping it to the toggle keeps hover
  // states snappy; reduced-motion is handled in CSS, so the class is a no-op there.
  const toggle = () => {
    const root = document.documentElement;
    root.classList.add("theme-transition");
    setTheme(resolvedTheme === "dark" ? "light" : "dark");
    window.setTimeout(() => root.classList.remove("theme-transition"), 750);
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      className="size-11"
      aria-label="Toggle dark mode"
      onClick={toggle}
    >
      <Sun className="hidden size-5 dark:block" aria-hidden="true" />
      <Moon className="size-5 dark:hidden" aria-hidden="true" />
    </Button>
  );
}
