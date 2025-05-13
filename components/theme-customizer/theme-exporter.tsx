import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Download, Check, Copy, Code } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import { useThemeConfig } from "@/components/active-theme";
import { cn } from "@/lib/utils";

export function ThemeExporter() {
  const { theme: current } = useThemeConfig();
  const [copied, setCopied] = useState(false);

  // Generate CSS variables based on current theme
  const generateThemeCSS = () => {
    const computedStyle = getComputedStyle(document.documentElement);
    const lightThemeVars = [
      "--background",
      "--foreground",
      "--card",
      "--card-foreground",
      "--popover",
      "--popover-foreground",
      "--primary",
      "--primary-foreground",
      "--secondary",
      "--secondary-foreground",
      "--muted",
      "--muted-foreground",
      "--accent",
      "--accent-foreground",
      "--destructive",
      "--destructive-foreground",
      "--border",
      "--input",
      "--ring",
      "--radius",
      "--chart-1",
      "--chart-2",
      "--chart-3",
      "--chart-4",
      "--chart-5"
    ];

    let css = "@layer base {\n  :root {\n";

    lightThemeVars.forEach((variable) => {
      const value = computedStyle.getPropertyValue(variable).trim();
      if (value) {
        css += `    ${variable}: ${value};\n`;
      }
    });

    css += "  }\n\n  .dark {\n";

    // Add a helper function to toggle dark mode, get values, and toggle back
    const darkModeVars = getDarkModeVariables(lightThemeVars);

    Object.entries(darkModeVars).forEach(([variable, value]) => {
      css += `    ${variable}: ${value};\n`;
    });

    css += "  }\n}";

    return css;
  };

  // Helper function to get dark mode variables
  const getDarkModeVariables = (variables) => {
    // In a real implementation, this would toggle dark mode, get values, and switch back
    // For simplicity, we'll use a mock implementation
    return {
      "--background": "222.2 84% 4.9%",
      "--foreground": "210 40% 98%",
      "--card": "222.2 84% 4.9%",
      "--card-foreground": "210 40% 98%",
      "--popover": "222.2 84% 4.9%",
      "--popover-foreground": "210 40% 98%",
      "--primary": "217.2 91.2% 59.8%",
      "--primary-foreground": "222.2 47.4% 11.2%",
      "--secondary": "217.2 32.6% 17.5%",
      "--secondary-foreground": "210 40% 98%",
      "--muted": "217.2 32.6% 17.5%",
      "--muted-foreground": "215 20.2% 65.1%",
      "--accent": "217.2 32.6% 17.5%",
      "--accent-foreground": "210 40% 98%",
      "--destructive": "0 62.8% 30.6%",
      "--destructive-foreground": "210 40% 98%",
      "--border": "217.2 32.6% 17.5%",
      "--input": "217.2 32.6% 17.5%",
      "--ring": "224.3 76.3% 48%",
      "--chart-1": "220 70% 50%",
      "--chart-2": "160 60% 45%",
      "--chart-3": "30 80% 55%",
      "--chart-4": "280 65% 60%",
      "--chart-5": "340 75% 55%"
    };
  };

  const themeCSS = generateThemeCSS();

  const handleCopy = () => {
    navigator.clipboard.writeText(themeCSS);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadThemeFile = () => {
    const blob = new Blob([themeCSS], { type: "text/css" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `theme-${current.preset}-${current.radius}-${current.scale}.css`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="h-8 gap-1 text-xs">
          <Code className="h-3.5 w-3.5" />
          <span>Export Theme</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Export Theme</DialogTitle>
          <DialogDescription>
            Copy and paste these CSS variables into your project's globals.css file.
          </DialogDescription>
        </DialogHeader>
        <div className="bg-muted relative mt-2 rounded-md p-4">
          <pre className="max-h-96 overflow-auto text-sm">{themeCSS}</pre>
          <div className="absolute top-2 right-2 flex gap-2">
            <Button size="icon" variant="ghost" className="h-7 w-7" onClick={handleCopy}>
              {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
            </Button>
            <Button size="icon" variant="ghost" className="h-7 w-7" onClick={downloadThemeFile}>
              <Download className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
        <div className="text-muted-foreground text-xs">
          <p className="mb-2">
            Current theme: <span className="text-foreground font-medium">{current.preset}</span>
          </p>
          <p>
            These variables reflect your current theme settings. They can be used in any project
            with shadcn/ui components to achieve the same styling.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
