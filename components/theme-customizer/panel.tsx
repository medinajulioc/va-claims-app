"use client";

import { Settings, BookOpen } from "lucide-react";
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

interface ThemeCustomizerPanelProps {
  onModeChange?: () => void;
  hideIcon?: boolean;
}

export function ThemeCustomizerPanel({
  onModeChange,
  hideIcon = false
}: ThemeCustomizerPanelProps) {
  const isMobile = useIsMobile();

  // Just render the content directly when hideIcon is true
  if (hideIcon) {
    return (
      <DropdownMenuContent
        className="me-4 w-[340px] p-4 shadow-xl lg:me-0"
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
          <div className="flex flex-col items-center gap-4">
            <ResetThemeButton />
            {onModeChange && (
              <Button
                size="sm"
                variant="outline"
                className="flex items-center gap-1.5"
                onClick={onModeChange}>
                <BookOpen className="h-3.5 w-3.5" />
                <span className="text-xs">Switch to drawer</span>
              </Button>
            )}
          </div>
        </div>
      </DropdownMenuContent>
    );
  }

  // Show the full component with trigger when hideIcon is false
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
        className="me-4 w-[340px] p-4 shadow-xl lg:me-0"
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
          <div className="flex flex-col items-center gap-4">
            <ResetThemeButton />
            {onModeChange && (
              <Button
                size="sm"
                variant="outline"
                className="flex items-center gap-1.5"
                onClick={onModeChange}>
                <BookOpen className="h-3.5 w-3.5" />
                <span className="text-xs">Switch to drawer</span>
              </Button>
            )}
          </div>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
