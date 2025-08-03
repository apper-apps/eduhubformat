import React from "react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/utils/cn";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";

const Empty = ({ 
  title = "강의가 없습니다", 
  description = "아직 등록된 강의가 없습니다. 새로운 강의를 기다려주세요!", 
  className 
}) => {
  const navigate = useNavigate();

  const handleExploreClick = () => {
    navigate("/courses");
  };

  const handleHomeClick = () => {
    navigate("/");
  };

  return (
    <div className={cn(
      "flex flex-col items-center justify-center min-h-[400px] text-center space-y-6 bg-white rounded-lg shadow-card p-8",
      className
    )}>
      {/* Empty State Icon */}
      <div className="relative">
        <div className="absolute inset-0 bg-primary-100 rounded-full blur-xl opacity-50"></div>
        <div className="relative bg-primary-50 p-8 rounded-full">
          <ApperIcon name="BookOpen" size={64} className="text-primary-600" />
        </div>
      </div>

      {/* Empty Content */}
      <div className="space-y-3 max-w-md">
        <h3 className="text-2xl font-bold text-gray-900">
          {title}
        </h3>
        <p className="text-gray-600 leading-relaxed korean-text">
          {description}
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center space-y-3 sm:space-y-0 sm:space-x-4 pt-4">
        <Button 
          variant="gradient" 
          onClick={handleExploreClick}
          className="w-full sm:w-auto"
        >
          <ApperIcon name="Search" size={20} className="mr-2" />
          강의 둘러보기
        </Button>
        <Button 
          variant="outline" 
          onClick={handleHomeClick}
          className="w-full sm:w-auto"
        >
          <ApperIcon name="Home" size={20} className="mr-2" />
          홈으로 가기
        </Button>
      </div>

      {/* Additional Info */}
      <div className="text-center space-y-3 pt-6 border-t border-gray-200 max-w-md">
        <p className="text-sm text-gray-500">
          새로운 강의 소식을 받아보세요
        </p>
        <div className="flex items-center justify-center space-x-6 text-sm text-gray-400">
          <div className="flex items-center space-x-1">
            <ApperIcon name="Users" size={16} />
            <span>10,000+ 수강생</span>
          </div>
          <div className="flex items-center space-x-1">
            <ApperIcon name="Star" size={16} />
            <span>4.8/5 평점</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Empty;