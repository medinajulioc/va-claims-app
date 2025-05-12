import React from "react";
import { Button as UIButton } from "@/components/ui/button";

type ButtonProps = {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  type?: "button" | "submit" | "reset";
};

const Button: React.FC<ButtonProps> = ({ children, onClick, className = "", type = "button" }) => (
  <UIButton type={type} className={className} onClick={onClick}>
    {children}
  </UIButton>
);

export default Button;
