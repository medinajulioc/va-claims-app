import React, { useState } from "react";
import { Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
} from "@/components/ui/sheet";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
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
  ThemeExporter,
} from "@/components/theme-customizer/index";

export function ThemeCustomizerDrawer() {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button size="icon" variant="outline" className="relative">
          <Settings className="animate-tada h-[1.2rem] w-[1.2rem]" />
          <span className="absolute -right-1 -top-1 flex h-3 w-3">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75"></span>
            <span className="relative inline-flex h-3 w-3 rounded-full bg-primary"></span>
          </span>
        </Button>
      </SheetTrigger>
      <SheetContent className="w-[400px] sm:max-w-[540px]">
        <SheetHeader className="px-1">
          <SheetTitle>Customize Your Theme</SheetTitle>
          <SheetDescription>
            Personalize the look and feel of your dashboard.
          </SheetDescription>
        </SheetHeader>
        
        <Tabs defaultValue="presets" className="mt-6">
          <TabsList className="w-full">
            <TabsTrigger value="presets" className="flex-1">Presets</TabsTrigger>
            <TabsTrigger value="colors" className="flex-1">Colors</TabsTrigger>
            <TabsTrigger value="advanced" className="flex-1">Advanced</TabsTrigger>
          </TabsList>
          
          <TabsContent value="presets" className="space-y-6 px-1 py-4">
            <div className="space-y-4">
              <PresetSelector />
              <ChartPresetSelector />
              <ThemeScaleSelector />
              <ThemeRadiusSelector />
            </div>
          </TabsContent>
          
          <TabsContent value="colors" className="space-y-6 px-1 py-4">
            <div className="space-y-4">
              <ColorPicker />
              <ColorModeSelector />
              <FontSelector />
            </div>
          </TabsContent>
          
          <TabsContent value="advanced" className="space-y-6 px-1 py-4">
            <div className="space-y-4">
              <ContentLayoutSelector />
              <SidebarModeSelector />
              <ThemeManager />
              <div className="pt-4">
                <ThemeExporter />
              </div>
            </div>
          </TabsContent>
        </Tabs>
        
        <SheetFooter className="mt-6 flex-row items-center justify-between border-t pt-4">
          <ResetThemeButton />
          <Button
            variant="default"
            size="sm"
            onClick={() => setOpen(false)}
          >
            Close
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
} 