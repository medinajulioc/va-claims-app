"use client";

import { CHART_THEMES } from "@/lib/themes";
import { useThemeConfig } from "@/components/active-theme";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

export function ChartPresetSelector() {
  const { theme, setTheme } = useThemeConfig();

  return (
    <div className="flex flex-col gap-4">
      <Label>Chart preset:</Label>
      <Select
        value={theme.chartPreset}
        onValueChange={(value) => setTheme({ ...theme, chartPreset: value as any })}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select a theme" />
        </SelectTrigger>
        <SelectContent align="end">
          {CHART_THEMES.map((theme) => (
            <SelectItem key={theme.name} value={theme.value}>
              <div className="flex shrink-0 gap-1">
                {theme.colors.map((color, key) => (
                  <span
                    key={key}
                    className="size-2 rounded-full"
                    style={{ backgroundColor: color }}></span>
                ))}
              </div>
              {theme.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
