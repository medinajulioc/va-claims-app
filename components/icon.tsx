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
  // But users might pass in various formats like alert-triangle, alertTriangle
  const formattedName = name
    .split(/[-_\s]/)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join("");

  const LucideIcon = iconMap[formattedName];

  if (!LucideIcon) {
    console.warn(`Icon not found: ${name} (formatted as: ${formattedName})`);
    // Return fallback or Activity icon if icon not found
    return fallback ? <>{fallback}</> : <Activity className={className} />;
  }

  return <LucideIcon className={className} />;
};

export default Icon;
