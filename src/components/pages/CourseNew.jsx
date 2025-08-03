import React from "react";
import { useNavigate } from "react-router-dom";
import CourseForm from "@/components/organisms/CourseForm";
import ApperIcon from "@/components/ApperIcon";

function CourseNew() {
  const navigate = useNavigate();

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-4">
          <button
            onClick={() => navigate('/courses/manage')}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ApperIcon name="ArrowLeft" size={20} />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">새 강의 등록</h1>
            <p className="text-gray-600">새로운 강의를 등록하고 관리하세요.</p>
          </div>
        </div>
      </div>

      {/* Form */}
      <CourseForm />
    </div>
  );
}

export default CourseNew;