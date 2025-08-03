import React from "react";
import { cn } from "@/utils/cn";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";

const Error = ({ 
  message = "문제가 발생했습니다. 다시 시도해주세요.", 
  onRetry = null, 
  className 
}) => {
  return (
    <div className={cn(
      "flex flex-col items-center justify-center min-h-[400px] text-center space-y-6 bg-white rounded-lg shadow-card p-8",
      className
    )}>
      {/* Error Icon */}
      <div className="relative">
        <div className="absolute inset-0 bg-red-100 rounded-full blur-xl opacity-50"></div>
        <div className="relative bg-red-50 p-6 rounded-full">
          <ApperIcon name="AlertTriangle" size={48} className="text-red-500" />
        </div>
      </div>

      {/* Error Content */}
      <div className="space-y-3 max-w-md">
        <h3 className="text-xl font-bold text-gray-900">
          오류가 발생했습니다
        </h3>
        <p className="text-gray-600 korean-text">
          {message}
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center space-y-3 sm:space-y-0 sm:space-x-4">
        {onRetry && (
          <Button 
            variant="primary" 
            onClick={onRetry}
            className="w-full sm:w-auto"
          >
            <ApperIcon name="RotateCcw" size={20} className="mr-2" />
            다시 시도
          </Button>
        )}
        <Button 
          variant="outline" 
          onClick={() => window.location.reload()}
          className="w-full sm:w-auto"
        >
          <ApperIcon name="RefreshCw" size={20} className="mr-2" />
          페이지 새로고침
        </Button>
      </div>

      {/* Additional Help */}
      <div className="text-sm text-gray-500 pt-4 border-t border-gray-200 max-w-md">
        <p>문제가 계속 발생하면 고객센터로 문의해주세요.</p>
        <div className="flex items-center justify-center space-x-4 mt-2">
          <span className="flex items-center space-x-1">
            <ApperIcon name="Mail" size={14} />
            <span>support@eduhub.com</span>
          </span>
          <span className="flex items-center space-x-1">
            <ApperIcon name="Phone" size={14} />
            <span>1588-1234</span>
          </span>
        </div>
      </div>
    </div>
  );
};

export default Error;