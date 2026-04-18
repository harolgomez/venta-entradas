import { cn } from "@/lib/utils";
import { type ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
}

export function Button({
  className,
  variant = "primary",
  size = "md",
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center font-medium transition-colors rounded-lg focus:outline-none focus:ring-2 focus:ring-accent/50 disabled:opacity-50 disabled:cursor-not-allowed",
        {
          "bg-accent text-white hover:bg-accent-hover": variant === "primary",
          "bg-surface text-text-primary hover:bg-surface-hover": variant === "secondary",
          "border border-border text-text-primary hover:bg-surface-hover": variant === "outline",
          "text-text-secondary hover:text-text-primary hover:bg-surface-hover": variant === "ghost",
          "bg-danger text-white hover:bg-red-600": variant === "danger",
        },
        {
          "px-3 py-1.5 text-sm": size === "sm",
          "px-4 py-2 text-sm": size === "md",
          "px-6 py-3 text-base": size === "lg",
        },
        className
      )}
      disabled={disabled}
      {...props}
    />
  );
}
