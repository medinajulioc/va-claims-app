import React, { useState, useEffect } from "react";
import { HexColorPicker } from "react-colorful";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { PaintBucket } from "lucide-react";
import { cn } from "@/lib/utils";

// Define the available theme variables that can be customized
const THEME_VARIABLES = [
  { name: "Background", value: "--background" },
  { name: "Foreground", value: "--foreground" },
  { name: "Primary", value: "--primary" },
  { name: "Primary Foreground", value: "--primary-foreground" },
  { name: "Secondary", value: "--secondary" },
  { name: "Secondary Foreground", value: "--secondary-foreground" },
  { name: "Muted", value: "--muted" },
  { name: "Muted Foreground", value: "--muted-foreground" },
  { name: "Accent", value: "--accent" },
  { name: "Accent Foreground", value: "--accent-foreground" },
  { name: "Border", value: "--border" },
  { name: "Input", value: "--input" },
  { name: "Ring", value: "--ring" }
];

interface ColorPickerProps {
  className?: string;
}

export function ColorPicker({ className }: ColorPickerProps) {
  const [selectedVariable, setSelectedVariable] = useState("--primary");
  const [color, setColor] = useState("#000000");
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Get the current CSS value when the selected variable changes
    const computedStyle = getComputedStyle(document.documentElement);
    const value = computedStyle.getPropertyValue(selectedVariable).trim();

    // If it's an HSL value, attempt to convert to HEX (simplified)
    if (value.includes("hsl") || value.match(/\d+\s+\d+%\s+\d+%/)) {
      // This is a simplified approach - in a real implementation, use a proper HSL to HEX converter
      setColor("#3B82F6"); // Default fallback color if we can't parse
    } else if (value.startsWith("#")) {
      setColor(value);
    } else {
      setColor("#3B82F6"); // Default fallback
    }
  }, [selectedVariable]);

  const handleColorChange = (newColor: string) => {
    setColor(newColor);

    // Update the CSS variable
    // Note: In a real implementation, this should integrate with your theme state management
    updateCSSVariable(selectedVariable, newColor);
  };

  // Helper function to update CSS variables
  const updateCSSVariable = (variable: string, value: string) => {
    try {
      // Convert HEX to HSL for shadcn/ui compatibility
      const r = parseInt(value.slice(1, 3), 16) / 255;
      const g = parseInt(value.slice(3, 5), 16) / 255;
      const b = parseInt(value.slice(5, 7), 16) / 255;

      const max = Math.max(r, g, b);
      const min = Math.min(r, g, b);
      let h = 0,
        s = 0,
        l = (max + min) / 2;

      if (max !== min) {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

        switch (max) {
          case r:
            h = (g - b) / d + (g < b ? 6 : 0);
            break;
          case g:
            h = (b - r) / d + 2;
            break;
          case b:
            h = (r - g) / d + 4;
            break;
        }

        h *= 60;
      }

      // Format HSL value for CSS variable (works with shadcn/ui)
      const hslValue = `${Math.round(h)} ${Math.round(s * 100)}% ${Math.round(l * 100)}%`;
      document.documentElement.style.setProperty(variable, hslValue);
    } catch (error) {
      console.error("Error updating CSS variable:", error);
    }
  };

  return (
    <div className={cn("flex flex-col space-y-1.5", className)}>
      <Label htmlFor="color-variable">Customize Colors</Label>
      <div className="flex items-center gap-2">
        <Select value={selectedVariable} onValueChange={setSelectedVariable}>
          <SelectTrigger id="color-variable" className="flex-1">
            <SelectValue placeholder="Select variable" />
          </SelectTrigger>
          <SelectContent position="popper">
            {THEME_VARIABLES.map((variable) => (
              <SelectItem key={variable.value} value={variable.value}>
                {variable.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Popover open={isOpen} onOpenChange={setIsOpen}>
          <PopoverTrigger asChild>
            <Button variant="outline" size="icon" className="relative h-9 w-9 border-dashed">
              <div className="absolute inset-0 m-1 rounded" style={{ backgroundColor: color }} />
              <PaintBucket className="text-muted-foreground/30 h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-3" align="end">
            <HexColorPicker color={color} onChange={handleColorChange} />
            <div className="mt-2 flex items-center justify-between">
              <code className="text-xs">{color.toUpperCase()}</code>
            </div>
          </PopoverContent>
        </Popover>
      </div>
      <p className="text-muted-foreground text-xs">
        Customize individual color variables in your theme
      </p>
    </div>
  );
}
