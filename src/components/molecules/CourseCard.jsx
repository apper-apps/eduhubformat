import React from "react";
import { cn } from "@/utils/cn";
import Badge from "@/components/atoms/Badge";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";

const CourseCard = ({ course, className, ...props }) => {
  const { title, coverImage, price, cohort, instructor, category } = course;

  const formatPrice = (price) => {
    return new Intl.NumberFormat("ko-KR", {
      style: "currency",
      currency: "KRW",
    }).format(price);
  };

  return (
<div
      className={cn(
        "card-elevated bg-card-gradient p-0 overflow-hidden group cursor-pointer touch-manipulation active:scale-[0.98] transition-transform duration-200",
        className
      )}
      {...props}
    >
      {/* Course Image */}
      <div className="relative aspect-video overflow-hidden">
        <img
          src={coverImage}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        
        {/* Cohort Badge */}
        {cohort && (
          <div className="absolute top-3 right-3">
            <Badge variant="cohort" size="small">
              {cohort}
            </Badge>
          </div>
        )}

        {/* Category Badge */}
        {category && (
          <div className="absolute top-3 left-3">
            <Badge variant="primary" size="small">
              {category}
            </Badge>
          </div>
        )}
      </div>

      {/* Course Content */}
      <div className="p-6">
        <div className="space-y-4">
          {/* Title */}
          <h3 className="text-lg font-bold text-gray-900 line-clamp-2 korean-text group-hover:text-primary-800 transition-colors duration-200">
            {title}
          </h3>

          {/* Instructor */}
          {instructor && (
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <ApperIcon name="User" size={16} />
              <span>{instructor}</span>
            </div>
          )}

{/* Price */}
          <div className="flex items-center justify-between">
            <div className="text-2xl font-bold text-primary-800">
              {formatPrice(price)}
            </div>
          </div>

          {/* Course Stats */}
          <div className="flex items-center justify-between text-sm text-gray-500 pt-2 border-t border-gray-100">
            <div className="flex items-center space-x-1">
              <ApperIcon name="Users" size={14} />
              <span>125명 수강</span>
            </div>
            <div className="flex items-center space-x-1">
              <ApperIcon name="Star" size={14} className="text-yellow-400 fill-current" />
              <span>4.8</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseCard;