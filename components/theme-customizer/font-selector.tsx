"use client";

import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { useThemeConfig } from "@/components/active-theme";
import { THEME_FONTS } from "@/lib/themes";

export function FontSelector() {
  const { theme, setTheme } = useThemeConfig();

  return (
    <div className="flex flex-col gap-4">
      <Label>Font:</Label>
      <Select
        value={theme.font}
        onValueChange={(value) => setTheme({ ...theme, font: value as any })}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select font" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="default">Default</SelectItem>
          {THEME_FONTS.map((item, key) => {
            return (
              <SelectItem key={key} value={item.value}>
                {item.name}
              </SelectItem>
            );
          })}
        </SelectContent>
      </Select>
    </div>
  );
}
