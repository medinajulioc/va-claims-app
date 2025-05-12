import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Save, Download, Upload, Share2, Trash2, Check } from "lucide-react";
import { useTheme } from "@/components/active-theme";
import { cn } from "@/lib/utils";

interface SavedTheme {
  id: string;
  name: string;
  timestamp: number;
  themeData: Record<string, any>;
  cssVars: Record<string, string>;
}

export function ThemeManager() {
  const { current, setTheme } = useTheme();
  const [savedThemes, setSavedThemes] = useState<SavedTheme[]>([]);
  const [newThemeName, setNewThemeName] = useState("");
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);
  const [loadDialogOpen, setLoadDialogOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  // Load saved themes from localStorage on component mount
  useEffect(() => {
    const loadThemes = () => {
      try {
        const savedThemesStr = localStorage.getItem("savedThemes");
        if (savedThemesStr) {
          setSavedThemes(JSON.parse(savedThemesStr));
        }
      } catch (error) {
        console.error("Error loading saved themes:", error);
      }
    };
    
    loadThemes();
  }, []);

  // Save themes to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("savedThemes", JSON.stringify(savedThemes));
  }, [savedThemes]);

  // Get current CSS variables
  const getCurrentCSSVars = () => {
    const computedStyle = getComputedStyle(document.documentElement);
    const cssVars: Record<string, string> = {};
    
    // Array of CSS variable names to save
    const varNames = [
      "--background", "--foreground", "--card", "--card-foreground",
      "--popover", "--popover-foreground", "--primary", "--primary-foreground",
      "--secondary", "--secondary-foreground", "--muted", "--muted-foreground",
      "--accent", "--accent-foreground", "--destructive", "--destructive-foreground",
      "--border", "--input", "--ring", "--radius",
    ];
    
    varNames.forEach(name => {
      cssVars[name] = computedStyle.getPropertyValue(name).trim();
    });
    
    return cssVars;
  };

  // Save current theme
  const saveCurrentTheme = () => {
    if (!newThemeName.trim()) return;
    
    const newTheme: SavedTheme = {
      id: crypto.randomUUID(),
      name: newThemeName.trim(),
      timestamp: Date.now(),
      themeData: { ...current },
      cssVars: getCurrentCSSVars(),
    };
    
    setSavedThemes(prev => [...prev, newTheme]);
    setNewThemeName("");
    setSaveDialogOpen(false);
  };

  // Load a saved theme
  const loadTheme = (theme: SavedTheme) => {
    // Apply theme presets
    setTheme(theme.themeData);
    
    // Apply CSS variables
    Object.entries(theme.cssVars).forEach(([varName, value]) => {
      document.documentElement.style.setProperty(varName, value);
    });
    
    setLoadDialogOpen(false);
  };

  // Delete a saved theme
  const deleteTheme = (id: string) => {
    setSavedThemes(prev => prev.filter(theme => theme.id !== id));
  };

  // Export theme as JSON file
  const exportTheme = (theme: SavedTheme) => {
    const blob = new Blob([JSON.stringify(theme, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${theme.name.toLowerCase().replace(/\s+/g, "-")}-theme.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Import theme from JSON file
  const importTheme = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const imported = JSON.parse(e.target?.result as string) as SavedTheme;
        
        // Validate imported theme has required properties
        if (!imported.name || !imported.themeData || !imported.cssVars) {
          throw new Error("Invalid theme file format");
        }
        
        // Add ID and timestamp if missing
        const validTheme: SavedTheme = {
          ...imported,
          id: imported.id || crypto.randomUUID(),
          timestamp: imported.timestamp || Date.now(),
        };
        
        setSavedThemes(prev => [...prev, validTheme]);
      } catch (error) {
        console.error("Error importing theme:", error);
        alert("Invalid theme file format");
      }
    };
    reader.readAsText(file);
    
    // Reset the input
    event.target.value = "";
  };

  // Share theme as URL
  const shareTheme = (theme: SavedTheme) => {
    try {
      // Create a compressed version of the theme with only essential data
      const shareData = {
        n: theme.name,
        t: theme.themeData,
        c: theme.cssVars
      };
      
      // Create shareable URL
      const compressed = btoa(JSON.stringify(shareData));
      const url = `${window.location.origin}?theme=${encodeURIComponent(compressed)}`;
      
      navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("Error sharing theme:", error);
    }
  };

  return (
    <div className="flex flex-col space-y-1.5">
      <Label>Theme Manager</Label>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          className="h-8 gap-1 text-xs"
          onClick={() => setSaveDialogOpen(true)}
        >
          <Save className="h-3.5 w-3.5" />
          <span>Save</span>
        </Button>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="h-8 gap-1 text-xs"
              disabled={savedThemes.length === 0}
            >
              <Download className="h-3.5 w-3.5" />
              <span>Load</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {savedThemes.length > 0 ? (
              savedThemes.map(theme => (
                <DropdownMenuItem 
                  key={theme.id}
                  onClick={() => loadTheme(theme)}
                >
                  {theme.name}
                </DropdownMenuItem>
              ))
            ) : (
              <DropdownMenuItem disabled>No saved themes</DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
        
        <div className="relative">
          <Input
            type="file"
            id="import-theme"
            className="absolute inset-0 cursor-pointer opacity-0"
            accept=".json"
            onChange={importTheme}
          />
          <Button
            variant="outline"
            size="sm"
            className="h-8 gap-1 text-xs"
          >
            <Upload className="h-3.5 w-3.5" />
            <span>Import</span>
          </Button>
        </div>
      </div>
      
      {/* Save Theme Dialog */}
      <Dialog open={saveDialogOpen} onOpenChange={setSaveDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Save Current Theme</DialogTitle>
            <DialogDescription>
              Give your theme a name to save it for later use.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="theme-name">Theme Name</Label>
              <Input
                id="theme-name"
                placeholder="My Awesome Theme"
                value={newThemeName}
                onChange={(e) => setNewThemeName(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setSaveDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button 
              onClick={saveCurrentTheme}
              disabled={!newThemeName.trim()}
            >
              Save Theme
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Manage Themes Dialog */}
      <Dialog open={loadDialogOpen} onOpenChange={setLoadDialogOpen}>
        <DialogTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="mt-2 h-8 w-full gap-1 text-xs"
            disabled={savedThemes.length === 0}
          >
            Manage Themes
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Manage Saved Themes</DialogTitle>
            <DialogDescription>
              Load, export, share or delete your saved themes.
            </DialogDescription>
          </DialogHeader>
          <div className="max-h-96 overflow-y-auto">
            {savedThemes.length > 0 ? (
              <div className="space-y-4">
                {savedThemes.map(theme => (
                  <div 
                    key={theme.id} 
                    className="flex items-center justify-between rounded-md border p-3"
                  >
                    <div className="flex-1">
                      <h4 className="text-sm font-medium">{theme.name}</h4>
                      <p className="text-xs text-muted-foreground">
                        {new Date(theme.timestamp).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7"
                        onClick={() => loadTheme(theme)}
                      >
                        <Download className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7"
                        onClick={() => exportTheme(theme)}
                      >
                        <Share2 className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-destructive"
                        onClick={() => deleteTheme(theme.id)}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex h-24 items-center justify-center text-center text-sm text-muted-foreground">
                No saved themes. Create one by customizing and saving your theme.
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
} 