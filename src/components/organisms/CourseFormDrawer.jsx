import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import { courseService } from "@/services/api/courseService";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import { cn } from "@/utils/cn";

const CourseFormDrawer = ({ 
  isOpen, 
  onClose, 
  editingCourse = null, 
  onCourseCreated, 
  onCourseUpdated 
}) => {
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("basic");
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    image: "",
    description: "",
    introduction: "",
    instructor: "",
    price: "",
    currency: "KRW",
    difficulty: "beginner",
    duration: "",
    sampleVideoId: "",
    objectives: [],
    curriculum: []
  });

  const categories = [
    { value: "programming", label: "프로그래밍" },
    { value: "design", label: "디자인" },
    { value: "business", label: "비즈니스" },
    { value: "marketing", label: "마케팅" },
    { value: "data", label: "데이터 분석" },
    { value: "language", label: "외국어" }
  ];

  const difficulties = [
    { value: "beginner", label: "초급" },
    { value: "intermediate", label: "중급" },
    { value: "advanced", label: "고급" }
  ];

  const tabs = [
    { id: "basic", label: "기본 정보", icon: "Info" },
    { id: "content", label: "강의 내용", icon: "BookOpen" },
    { id: "details", label: "상세 정보", icon: "Settings" }
  ];

  // Load editing course data
  useEffect(() => {
    if (editingCourse) {
      setFormData({
        title: editingCourse.title || editingCourse.Name || "",
        category: editingCourse.category || "",
        image: editingCourse.image || editingCourse.coverImage || "",
        description: editingCourse.description || "",
        introduction: editingCourse.introduction || editingCourse.intro_md || "",
        instructor: editingCourse.instructor || "",
        price: editingCourse.price?.toString() || "",
        currency: editingCourse.currency || "KRW",
        difficulty: editingCourse.difficulty || editingCourse.level || "beginner",
        duration: editingCourse.duration?.toString() || "",
        sampleVideoId: editingCourse.sampleVideoId || "",
        objectives: editingCourse.objectives || [],
        curriculum: editingCourse.curriculum || []
      });
    }
  }, [editingCourse]);

  // Reset form when drawer closes
  useEffect(() => {
    if (!isOpen) {
      setFormData({
        title: "",
        category: "",
        image: "",
        description: "",
        introduction: "",
        instructor: "",
        price: "",
        currency: "KRW",
        difficulty: "beginner",
        duration: "",
        sampleVideoId: "",
        objectives: [],
        curriculum: []
      });
      setActiveTab("basic");
    }
  }, [isOpen]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddObjective = () => {
    setFormData(prev => ({
      ...prev,
      objectives: [...prev.objectives, ""]
    }));
  };

  const handleRemoveObjective = (index) => {
    setFormData(prev => ({
      ...prev,
      objectives: prev.objectives.filter((_, i) => i !== index)
    }));
  };

  const handleObjectiveChange = (index, value) => {
    setFormData(prev => ({
      ...prev,
      objectives: prev.objectives.map((obj, i) => i === index ? value : obj)
    }));
  };

  const handleAddCurriculumItem = () => {
    setFormData(prev => ({
      ...prev,
      curriculum: [...prev.curriculum, { id: Date.now(), title: "", videoUrl: "" }]
    }));
  };

  const handleRemoveCurriculumItem = (id) => {
    setFormData(prev => ({
      ...prev,
      curriculum: prev.curriculum.filter(item => item.id !== id)
    }));
  };

  const handleCurriculumChange = (id, field, value) => {
    setFormData(prev => ({
      ...prev,
      curriculum: prev.curriculum.map(item => 
        item.id === id ? { ...item, [field]: value } : item
      )
    }));
  };

  const validateForm = () => {
    if (!formData.title.trim()) {
      toast.error("강의 제목을 입력해주세요.");
      return false;
    }
    if (!formData.category) {
      toast.error("카테고리를 선택해주세요.");
      return false;
    }
    if (!formData.instructor.trim()) {
      toast.error("강사명을 입력해주세요.");
      return false;
    }
    if (!formData.description.trim()) {
      toast.error("강의 설명을 입력해주세요.");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    try {
      setLoading(true);
      
      // Map form data to Apper field names
      const courseData = {
        Name: formData.title,
        category: formData.category,
        coverImage: formData.image || '/api/placeholder/400/300',
        description: formData.description,
        intro_md: formData.introduction,
        instructor: formData.instructor,
        price: formData.price ? Number(formData.price) : 0,
        currency: formData.currency,
        level: formData.difficulty,
        duration: formData.duration ? Number(formData.duration) : 0,
        sampleVideoId: formData.sampleVideoId,
        objectives: JSON.stringify(formData.objectives.filter(obj => obj.trim())),
        curriculum: JSON.stringify(formData.curriculum.filter(item => item.title.trim()))
      };

      if (editingCourse) {
        await courseService.update(editingCourse.Id, courseData);
        onCourseUpdated?.();
        toast.success("강의가 성공적으로 수정되었습니다.");
      } else {
        await courseService.create(courseData);
        onCourseCreated?.();
        toast.success("강의가 성공적으로 등록되었습니다.");
      }
    } catch (err) {
      console.error("Error saving course:", err);
      toast.error(err.message || `강의 ${editingCourse ? '수정' : '등록'}에 실패했습니다.`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
          />
          
          {/* Drawer */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed top-0 right-0 h-full w-full max-w-2xl bg-white shadow-2xl z-50 overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-white">
              <h2 className="text-2xl font-bold text-gray-900">
                {editingCourse ? "강의 수정" : "새 강의 등록"}
              </h2>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ApperIcon name="X" size={24} />
              </button>
            </div>

            {/* Tab Navigation */}
            <div className="flex border-b border-gray-200 bg-white px-6">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    "flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors",
                    activeTab === tab.id
                      ? "border-primary-800 text-primary-800"
                      : "border-transparent text-gray-500 hover:text-gray-700"
                  )}
                >
                  <ApperIcon name={tab.icon} size={16} />
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Form Content */}
            <div className="flex-1 overflow-y-auto">
              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                {/* Basic Info Tab */}
                {activeTab === "basic" && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        강의 제목 *
                      </label>
                      <input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        placeholder="강의 제목을 입력하세요"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        카테고리 *
                      </label>
                      <select
                        name="category"
                        value={formData.category}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        required
                      >
                        <option value="">카테고리 선택</option>
                        {categories.map((cat) => (
                          <option key={cat.value} value={cat.value}>
                            {cat.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        강사명 *
                      </label>
                      <input
                        type="text"
                        name="instructor"
                        value={formData.instructor}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        placeholder="강사명을 입력하세요"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        썸네일 이미지 URL
                      </label>
                      <input
                        type="url"
                        name="image"
                        value={formData.image}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        placeholder="이미지 URL을 입력하세요"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        간단한 설명 *
                      </label>
                      <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        placeholder="강의에 대한 간단한 설명을 입력하세요"
                        required
                      />
                    </div>
                  </div>
                )}

                {/* Content Tab */}
                {activeTab === "content" && (
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        상세 설명 / 커리큘럼 개요
                      </label>
                      <textarea
                        name="introduction"
                        value={formData.introduction}
                        onChange={handleInputChange}
                        rows={6}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        placeholder="강의의 상세한 설명과 커리큘럼 개요를 입력하세요"
                      />
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <label className="block text-sm font-medium text-gray-700">
                          학습 목표
                        </label>
                        <Button
                          type="button"
                          variant="secondary"
                          size="sm"
                          onClick={handleAddObjective}
                        >
                          <ApperIcon name="Plus" size={16} />
                          목표 추가
                        </Button>
                      </div>
                      <div className="space-y-2">
                        {formData.objectives.map((objective, index) => (
                          <div key={index} className="flex gap-2">
                            <input
                              type="text"
                              value={objective}
                              onChange={(e) => handleObjectiveChange(index, e.target.value)}
                              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                              placeholder={`학습 목표 ${index + 1}`}
                            />
                            <button
                              type="button"
                              onClick={() => handleRemoveObjective(index)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                            >
                              <ApperIcon name="Trash2" size={16} />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <label className="block text-sm font-medium text-gray-700">
                          커리큘럼
                        </label>
                        <Button
                          type="button"
                          variant="secondary"
                          size="sm"
                          onClick={handleAddCurriculumItem}
                        >
                          <ApperIcon name="Plus" size={16} />
                          항목 추가
                        </Button>
                      </div>
                      <div className="space-y-3">
                        {formData.curriculum.map((item, index) => (
                          <div key={item.id} className="border border-gray-200 rounded-lg p-4">
                            <div className="flex items-center justify-between mb-3">
                              <span className="text-sm font-medium text-gray-700">
                                {index + 1}. 강의 항목
                              </span>
                              <button
                                type="button"
                                onClick={() => handleRemoveCurriculumItem(item.id)}
                                className="p-1 text-red-600 hover:bg-red-50 rounded"
                              >
                                <ApperIcon name="Trash2" size={14} />
                              </button>
                            </div>
                            <div className="space-y-2">
                              <input
                                type="text"
                                value={item.title}
                                onChange={(e) => handleCurriculumChange(item.id, 'title', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                                placeholder="강의 제목"
                              />
                              <input
                                type="url"
                                value={item.videoUrl}
                                onChange={(e) => handleCurriculumChange(item.id, 'videoUrl', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                                placeholder="동영상 URL (선택사항)"
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Details Tab */}
                {activeTab === "details" && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          가격
                        </label>
                        <input
                          type="number"
                          name="price"
                          value={formData.price}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                          placeholder="0"
                          min="0"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          통화
                        </label>
                        <select
                          name="currency"
                          value={formData.currency}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        >
                          <option value="KRW">원 (KRW)</option>
                          <option value="USD">달러 (USD)</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        난이도
                      </label>
                      <select
                        name="difficulty"
                        value={formData.difficulty}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      >
                        {difficulties.map((diff) => (
                          <option key={diff.value} value={diff.value}>
                            {diff.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        예상 수강 시간 (시간)
                      </label>
                      <input
                        type="number"
                        name="duration"
                        value={formData.duration}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        placeholder="예: 10"
                        min="0"
                        step="0.5"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        샘플 동영상 ID
                      </label>
                      <input
                        type="text"
                        name="sampleVideoId"
                        value={formData.sampleVideoId}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        placeholder="YouTube 동영상 ID 등"
                      />
                    </div>
                  </div>
                )}
              </form>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 bg-white">
              <Button
                type="button"
                variant="secondary"
                onClick={onClose}
                disabled={loading}
              >
                취소
              </Button>
              <Button
                type="submit"
                variant="primary"
                onClick={handleSubmit}
                disabled={loading}
                className="min-w-[100px]"
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    저장 중...
                  </div>
                ) : (
                  editingCourse ? "수정 완료" : "등록 완료"
                )}
              </Button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CourseFormDrawer;