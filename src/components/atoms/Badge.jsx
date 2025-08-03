import React, { forwardRef } from "react";
import { cn } from "@/utils/cn";

const Badge = forwardRef(({ 
  children, 
  variant = "default", 
  size = "default", 
  className, 
  ...props 
}, ref) => {
  const baseStyles = "inline-flex items-center font-semibold rounded-full transition-all duration-200";
  
  const variants = {
    default: "bg-gray-100 text-gray-800",
    primary: "bg-primary-100 text-primary-800",
    secondary: "bg-purple-100 text-purple-800",
    accent: "bg-accent-500 text-white",
    success: "bg-green-100 text-green-800",
    warning: "bg-yellow-100 text-yellow-800",
    error: "bg-red-100 text-red-800",
    cohort: "bg-gradient-to-r from-accent-500 to-pink-500 text-white shadow-sm",
  };

  const sizes = {
    small: "px-2 py-1 text-xs",
    default: "px-3 py-1 text-sm",
    large: "px-4 py-2 text-base",
  };

  return (
    <span
      ref={ref}
      className={cn(
        baseStyles,
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
});

Badge.displayName = "Badge";

export default Badge;