import React, { forwardRef } from "react";
import { cn } from "@/utils/cn";

const Button = forwardRef(({ 
  children, 
  variant = "primary", 
  size = "default", 
  className, 
  disabled = false,
  ...props 
}, ref) => {
  const baseStyles = "inline-flex items-center justify-center rounded-lg font-semibold transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transform active:scale-95";
  
  const variants = {
    primary: "bg-primary-800 hover:bg-primary-700 text-white shadow-lg hover:shadow-xl hover:scale-105",
    secondary: "bg-white hover:bg-gray-50 text-primary-800 border-2 border-primary-800 hover:scale-105",
    outline: "border-2 border-gray-300 hover:border-primary-800 text-gray-700 hover:text-primary-800 bg-transparent",
    ghost: "text-primary-800 hover:bg-primary-50",
    gradient: "bg-hero-gradient text-white shadow-lg hover:shadow-xl hover:scale-105",
  };

  const sizes = {
    small: "px-4 py-2 text-sm",
    default: "px-6 py-3 text-base",
    large: "px-8 py-4 text-lg",
  };

  return (
    <button
      ref={ref}
      className={cn(
        baseStyles,
        variants[variant],
        sizes[size],
        disabled && "hover:scale-100 hover:shadow-none",
        className
      )}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
});

Button.displayName = "Button";

export default Button;