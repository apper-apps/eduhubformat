import React from "react";
import { cn } from "@/utils/cn";

const Loading = ({ className }) => {
  return (
    <div className={cn("space-y-6", className)}>
      {/* Header Skeleton */}
      <div className="bg-white rounded-lg shadow-card p-6">
        <div className="space-y-4">
          <div className="shimmer h-6 w-32 rounded"></div>
          <div className="flex flex-wrap gap-2">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="shimmer h-8 w-20 rounded-full"></div>
            ))}
          </div>
          <div className="flex justify-between items-center pt-4 border-t border-gray-200">
            <div className="shimmer h-4 w-24 rounded"></div>
            <div className="shimmer h-8 w-32 rounded"></div>
          </div>
        </div>
      </div>

      {/* Course Grid Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="bg-white rounded-lg shadow-card overflow-hidden">
            {/* Image Skeleton */}
            <div className="aspect-video shimmer"></div>
            
            {/* Content Skeleton */}
            <div className="p-6 space-y-4">
              <div className="space-y-2">
                <div className="shimmer h-5 w-full rounded"></div>
                <div className="shimmer h-5 w-3/4 rounded"></div>
              </div>
              
              <div className="flex items-center space-x-2">
                <div className="shimmer h-4 w-4 rounded-full"></div>
                <div className="shimmer h-4 w-20 rounded"></div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="shimmer h-6 w-24 rounded"></div>
                <div className="shimmer h-8 w-16 rounded"></div>
              </div>
              
              <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                <div className="shimmer h-4 w-16 rounded"></div>
                <div className="shimmer h-4 w-12 rounded"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Loading;