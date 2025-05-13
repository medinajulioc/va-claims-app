"use client";

import { Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeCustomizerPanel } from "./panel";
import { ThemeCustomizerDrawer } from "./drawer";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import { DropdownMenu, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Sheet, SheetTrigger } from "@/components/ui/sheet";
import { useState } from "react";

interface ThemeCustomizerToggleProps {
  defaultMode?: "panel" | "drawer";
}

export function ThemeCustomizerToggle({ defaultMode = "panel" }: ThemeCustomizerToggleProps) {
  const [mode, setMode] = useLocalStorage<"panel" | "drawer">("theme-customizer-mode", defaultMode);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleModeToggle = () => {
    setMode(mode === "panel" ? "drawer" : "panel");
  };

  const triggerButton = (
    <Button size="icon" variant="outline" className="relative">
      <Settings className="animate-tada h-[1.2rem] w-[1.2rem]" />
      <span className="absolute -top-1 -right-1 flex h-3 w-3">
        <span className="bg-primary absolute inline-flex h-full w-full animate-ping rounded-full opacity-75"></span>
        <span className="bg-primary relative inline-flex h-3 w-3 rounded-full"></span>
      </span>
    </Button>
  );

  return (
    <Tooltip delayDuration={300}>
      <TooltipTrigger asChild>
        <div>
          {mode === "panel" ? (
            <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
              <DropdownMenuTrigger asChild>{triggerButton}</DropdownMenuTrigger>
              <ThemeCustomizerPanel onModeChange={handleModeToggle} hideIcon={true} />
            </DropdownMenu>
          ) : (
            <Sheet open={drawerOpen} onOpenChange={setDrawerOpen}>
              <SheetTrigger asChild>{triggerButton}</SheetTrigger>
              <ThemeCustomizerDrawer onModeChange={handleModeToggle} hideIcon={true} />
            </Sheet>
          )}
        </div>
      </TooltipTrigger>
      <TooltipContent side="bottom">Theme Customizer</TooltipContent>
    </Tooltip>
  );
}
