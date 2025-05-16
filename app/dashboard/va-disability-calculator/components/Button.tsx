import React from "react";
import { Button as UIButton } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

type ButtonProps = {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  isLoading?: boolean;
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  size?: "default" | "sm" | "lg" | "icon";
  loadingText?: string;
  aria?: {
    label?: string;
    describedby?: string;
  };
};

const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  className = "",
  type = "button",
  disabled = false,
  isLoading = false,
  variant = "default",
  size = "default",
  loadingText,
  aria
}) => (
  <UIButton
    type={type}
    className={cn(className)}
    onClick={onClick}
    disabled={disabled || isLoading}
    variant={variant}
    size={size}
    aria-label={aria?.label}
    aria-describedby={aria?.describedby}>
    {isLoading && <Loader2 className="mr-2 size-4 animate-spin" />}
    {isLoading && loadingText ? loadingText : children}
  </UIButton>
);

export default Button;
