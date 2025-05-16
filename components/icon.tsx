import { icons } from "lucide-react";
import { Activity } from "lucide-react";

type IconProps = {
  name: string;
  className?: string;
  fallback?: React.ReactNode;
};

type IconType = React.ComponentType<React.SVGProps<SVGSVGElement>>;

type IconsType = {
  [key: string]: IconType;
};

const iconMap: IconsType = icons;

const Icon: React.FC<IconProps> = ({ name, className, fallback }) => {
  // Handle case conversion - lucide icons are PascalCase
  // But users might pass in various formats like alert-triangle, alertTriangle, or FileText

  // First, handle already PascalCase names that might have been improperly formatted
  if (iconMap[name]) {
    const IconComponent = iconMap[name];
    return <IconComponent className={className} />;
  }

  // Handle camelCase, kebab-case, and snake_case conversions to PascalCase
  let formattedName = "";

  // Special case handling for compound words with internal capitalization
  const specialCases: Record<string, string> = {
    filetext: "FileText",
    filecheck: "FileCheck",
    clipboardlist: "ClipboardList",
    stickynote: "StickyNote",
    messagesquare: "MessageSquare",
    squarecheck: "SquareCheck",
    bookopen: "BookOpen",
    filetemplate: "FileTemplate",
    clipboardminus: "ClipboardMinus",
    trianglealert: "TriangleAlert",
    alerttriangle: "AlertTriangle"
  };

  // Check if it's one of our special cases (case-insensitive)
  const lowerName = name.toLowerCase();
  if (specialCases[lowerName]) {
    formattedName = specialCases[lowerName];
  } else {
    // Standard conversion to PascalCase
    formattedName = name
      .split(/[-_\s]/)
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
      .join("");
  }

  const LucideIcon = iconMap[formattedName];

  if (!LucideIcon) {
    console.warn(`Icon not found: ${name} (formatted as: ${formattedName})`);
    // Return fallback or Activity icon if icon not found
    return fallback ? <>{fallback}</> : <Activity className={className} />;
  }

  return <LucideIcon className={className} />;
};

export default Icon;
