"use client";

import { useState } from "react";
import { Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeCustomizerPanel } from "./panel";
import { ThemeCustomizerDrawer } from "./drawer";
import { useLocalStorage } from "@/hooks/use-local-storage";

interface ThemeCustomizerToggleProps {
  defaultMode?: "panel" | "drawer";
}

export function ThemeCustomizerToggle({ defaultMode = "panel" }: ThemeCustomizerToggleProps) {
  const [mode, setMode] = useLocalStorage<"panel" | "drawer">("theme-customizer-mode", defaultMode);

  // Toggle between panel and drawer modes
  const toggleMode = () => {
    setMode(mode === "panel" ? "drawer" : "panel");
  };

  return (
    <div className="relative">
      {mode === "panel" ? <ThemeCustomizerPanel /> : <ThemeCustomizerDrawer />}

      <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 transform">
        <Button
          variant="ghost"
          size="sm"
          className="text-muted-foreground hover:text-foreground h-auto rounded-sm px-2 text-xs hover:bg-transparent"
          onClick={toggleMode}>
          {mode === "panel" ? "Try drawer mode" : "Try panel mode"}
        </Button>
      </div>
    </div>
  );
}
