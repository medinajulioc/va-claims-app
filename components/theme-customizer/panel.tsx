"use client";

import { Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  PresetSelector,
  SidebarModeSelector,
  ThemeScaleSelector,
  ColorModeSelector,
  ContentLayoutSelector,
  ThemeRadiusSelector,
  FontSelector,
  ResetThemeButton,
  ChartPresetSelector,
  ColorPicker,
  ThemeManager,
  ThemeExporter
} from "@/components/theme-customizer/index";
import { useIsMobile } from "@/hooks/use-mobile";

export function ThemeCustomizerPanel() {
  const isMobile = useIsMobile();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size="icon" variant="outline" className="relative">
          <Settings className="animate-tada h-[1.2rem] w-[1.2rem]" />
          <span className="absolute -top-1 -right-1 flex h-3 w-3">
            <span className="bg-primary absolute inline-flex h-full w-full animate-ping rounded-full opacity-75"></span>
            <span className="bg-primary relative inline-flex h-3 w-3 rounded-full"></span>
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="me-4 w-[320px] p-4 shadow-xl lg:me-0"
        align={isMobile ? "center" : "end"}>
        <Tabs defaultValue="presets" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="presets">Presets</TabsTrigger>
            <TabsTrigger value="colors">Colors</TabsTrigger>
            <TabsTrigger value="advanced">Advanced</TabsTrigger>
          </TabsList>

          <TabsContent value="presets" className="mt-4 space-y-4">
            <PresetSelector />
            <ChartPresetSelector />
            <ThemeScaleSelector />
            <ThemeRadiusSelector />
          </TabsContent>

          <TabsContent value="colors" className="mt-4 space-y-4">
            <ColorPicker />
            <ColorModeSelector />
            <FontSelector />
          </TabsContent>

          <TabsContent value="advanced" className="mt-4 space-y-4">
            <ContentLayoutSelector />
            <SidebarModeSelector />
            <ThemeManager />
            <div className="pt-2">
              <ThemeExporter />
            </div>
          </TabsContent>
        </Tabs>

        <div className="mt-4 border-t pt-4">
          <ResetThemeButton />
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
