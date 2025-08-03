import React from "react";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";

const Logo = ({ className, size = "default" }) => {
  const sizes = {
    small: "text-xl",
    default: "text-2xl",
    large: "text-3xl",
  };

  return (
    <div className={cn("flex items-center space-x-3", className)}>
      <div className="relative">
        <div className="absolute inset-0 bg-hero-gradient rounded-lg blur-sm opacity-75"></div>
        <div className="relative bg-hero-gradient p-2 rounded-lg">
          <ApperIcon name="GraduationCap" className="text-white" size={size === "small" ? 20 : size === "large" ? 28 : 24} />
        </div>
      </div>
      <div className={cn("font-bold text-gradient", sizes[size])}>
        EduHub Pro
      </div>
    </div>
  );
};

export default Logo;