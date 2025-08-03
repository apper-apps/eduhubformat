import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { DragDropContext, Draggable, Droppable } from "@hello-pangea/dnd";
import { createCourse, getCourseById, updateCourse } from "@/services/api/courseService";
import ApperIcon from "@/components/ApperIcon";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Button from "@/components/atoms/Button";
import { cn } from "@/utils/cn";

export default function CourseForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!id;
  
  const [activeTab, setActiveTab] = useState('introduction'); // introduction, objectives, curriculum
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(isEditMode);
  const [error, setError] = useState(null);
  
  const [formData, setFormData] = useState({
    title: '',
    introduction: '', // Markdown content
    objectives: [], // Array of strings
    curriculum: [], // Array of { id, title, videoUrl }
    category: 'programming',
    price: '',
    level: 'beginner',
    duration: '',
    image: '',
    instructor: '',
    tags: []
  });
  
  const [newObjective, setNewObjective] = useState('');
  const [newCurriculumItem, setNewCurriculumItem] = useState({ title: '', videoUrl: '' });
  const [showNewCurriculumForm, setShowNewCurriculumForm] = useState(false);
  const [tagInput, setTagInput] = useState('');

  const categories = [
    { value: 'programming', label: '프로그래밍' },
    { value: 'design', label: '디자인' },
    { value: 'business', label: '비즈니스' },
    { value: 'marketing', label: '마케팅' },
    { value: 'data', label: '데이터분석' },
    { value: 'language', label: '언어' }
  ];

  const levels = [
    { value: 'beginner', label: '초급' },
    { value: 'intermediate', label: '중급' },
    { value: 'advanced', label: '고급' }
  ];

  const tabs = [
    { id: 'introduction', label: '강의소개', icon: 'BookOpen' },
    { id: 'objectives', label: '학습목표', icon: 'Target' },
    { id: 'curriculum', label: '커리큘럼', icon: 'List' }
  ];

  // Load course data for edit mode
  useEffect(() => {
    if (isEditMode) {
      loadCourseData();
    }
  }, [id]);

  const loadCourseData = async () => {
    try {
      setInitialLoading(true);
      setError(null);
      const course = await getCourseById(parseInt(id));
      
      setFormData({
        title: course.title || '',
        introduction: course.introduction || course.description || '',
        objectives: course.objectives || [],
        curriculum: course.curriculum || [],
        category: course.category || 'programming',
        price: course.price?.toString() || '',
        level: course.level || 'beginner',
        duration: course.duration?.toString() || '',
        image: course.image || '',
        instructor: course.instructor || '',
        tags: course.tags || []
      });
    } catch (err) {
      setError(err.message);
      toast.error(err.message || '강의 정보를 불러오는데 실패했습니다.');
    } finally {
      setInitialLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Objectives management
  const handleAddObjective = () => {
    if (newObjective.trim()) {
      setFormData(prev => ({
        ...prev,
        objectives: [...prev.objectives, newObjective.trim()]
      }));
      setNewObjective('');
    }
  };

  const handleRemoveObjective = (index) => {
    setFormData(prev => ({
      ...prev,
      objectives: prev.objectives.filter((_, i) => i !== index)
    }));
  };

  // Curriculum management
  const handleAddCurriculumItem = () => {
    if (newCurriculumItem.title.trim()) {
      const newItem = {
        id: Date.now().toString(),
        title: newCurriculumItem.title.trim(),
        videoUrl: newCurriculumItem.videoUrl.trim()
      };
      
      setFormData(prev => ({
        ...prev,
        curriculum: [...prev.curriculum, newItem]
      }));
      
      setNewCurriculumItem({ title: '', videoUrl: '' });
      setShowNewCurriculumForm(false);
    }
  };

  const handleRemoveCurriculumItem = (id) => {
    setFormData(prev => ({
      ...prev,
      curriculum: prev.curriculum.filter(item => item.id !== id)
    }));
  };

  const handleDragEnd = (result) => {
    if (!result.destination) return;

    const items = Array.from(formData.curriculum);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setFormData(prev => ({
      ...prev,
      curriculum: items
    }));
  };

  // Tags management
  const handleAddTag = (e) => {
    e.preventDefault();
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()]
      }));
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const validateForm = () => {
    if (!formData.title.trim()) {
      toast.error('강의명을 입력해주세요.');
      return false;
    }
    
    if (formData.curriculum.length === 0) {
      toast.error('최소 1개의 커리큘럼 항목이 필요합니다.');
      setActiveTab('curriculum');
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    try {
      setLoading(true);
      
      const courseData = {
        ...formData,
        price: formData.price ? Number(formData.price) : 0,
        duration: formData.duration ? Number(formData.duration) : 0,
        image: formData.image || '/api/placeholder/400/300',
        description: formData.introduction // Maintain backward compatibility
      };

      if (isEditMode) {
        await updateCourse(parseInt(id), courseData);
        toast.success('강의가 성공적으로 수정되었습니다.');
      } else {
        await createCourse(courseData);
        toast.success('강의가 성공적으로 등록되었습니다.');
      }
      
      navigate('/courses/manage');
    } catch (err) {
      toast.error(err.message || `강의 ${isEditMode ? '수정' : '등록'}에 실패했습니다.`);
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <Loading className="py-12" />
      </div>
    );
  }

  if (error && isEditMode) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <Error 
          message={error}
          onRetry={loadCourseData}
          className="py-12"
        />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 pb-24">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          {isEditMode ? '강의 수정' : '새 강의 등록'}
        </h1>
        <p className="text-gray-600">
          {isEditMode ? '강의 정보를 수정하세요.' : '새로운 강의를 등록하세요.'}
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-card">
        {/* Tab Navigation */}
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6" aria-label="Tabs">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  'py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2 transition-colors',
                  activeTab === tab.id
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                )}
              >
                <ApperIcon name={tab.icon} size={16} />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          {/* Introduction Tab */}
          {activeTab === 'introduction' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                    강의명 *
                  </label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    placeholder="강의명을 입력하세요"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                    카테고리 *
                  </label>
                  <select
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    required
                  >
                    {categories.map(cat => (
                      <option key={cat.value} value={cat.value}>{cat.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="level" className="block text-sm font-medium text-gray-700 mb-2">
                    난이도 *
                  </label>
                  <select
                    id="level"
                    name="level"
                    value={formData.level}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    required
                  >
                    {levels.map(level => (
                      <option key={level.value} value={level.value}>{level.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-2">
                    가격 (원) *
                  </label>
                  <input
                    type="number"
                    id="price"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    placeholder="0"
                    min="0"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="duration" className="block text-sm font-medium text-gray-700 mb-2">
                    수업 시간 (시간)
                  </label>
                  <input
                    type="number"
                    id="duration"
                    name="duration"
                    value={formData.duration}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    placeholder="0"
                    min="0"
                  />
                </div>

                <div>
                  <label htmlFor="instructor" className="block text-sm font-medium text-gray-700 mb-2">
                    강사명 *
                  </label>
                  <input
                    type="text"
                    id="instructor"
                    name="instructor"
                    value={formData.instructor}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    placeholder="강사명을 입력하세요"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-2">
                    대표 이미지 URL
                  </label>
                  <input
                    type="url"
                    id="image"
                    name="image"
                    value={formData.image}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    placeholder="https://example.com/image.jpg"
                  />
                </div>

                <div className="md:col-span-2">
                  <label htmlFor="introduction" className="block text-sm font-medium text-gray-700 mb-2">
                    강의 소개 (Markdown) *
                  </label>
                  <textarea
                    id="introduction"
                    name="introduction"
                    value={formData.introduction}
                    onChange={handleInputChange}
                    rows={10}
                    style={{ height: '240px' }}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 font-mono text-sm resize-none"
                    placeholder="# 강의 소개&#10;&#10;이 강의에서는...&#10;&#10;## 주요 내용&#10;- 항목 1&#10;- 항목 2"
                    required
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    Markdown 문법을 사용하여 강의를 소개하세요. (제목: #, 목록: -, 굵게: **텍스트**)
                  </p>
                </div>
              </div>

              {/* Tags */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900">태그</h3>
                <div>
                  <div className="flex gap-2 mb-3">
                    <input
                      type="text"
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      placeholder="태그를 입력하세요"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          handleAddTag(e);
                        }
                      }}
                    />
                    <Button
                      type="button"
                      variant="secondary"
                      onClick={handleAddTag}
                      className="px-4"
                    >
                      추가
                    </Button>
                  </div>
                  
                  {formData.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {formData.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center gap-1 px-3 py-1 bg-primary-100 text-primary-800 text-sm rounded-full"
                        >
                          {tag}
                          <button
                            type="button"
                            onClick={() => handleRemoveTag(tag)}
                            className="ml-1 hover:text-primary-600"
                          >
                            <ApperIcon name="X" size={14} />
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Objectives Tab */}
          {activeTab === 'objectives' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">학습 목표</h3>
                
                <div className="flex gap-2 mb-4">
                  <input
                    type="text"
                    value={newObjective}
                    onChange={(e) => setNewObjective(e.target.value)}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    placeholder="새로운 학습 목표를 입력하세요"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddObjective();
                      }
                    }}
                  />
                  <Button
                    type="button"
                    variant="primary"
                    onClick={handleAddObjective}
                    className="px-6"
                  >
                    <ApperIcon name="Plus" size={16} className="mr-1" />
                    추가
                  </Button>
                </div>

                {formData.objectives.length > 0 ? (
                  <div className="space-y-2">
                    {formData.objectives.map((objective, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg group hover:bg-gray-100 transition-colors"
                      >
                        <div className="w-2 h-2 bg-primary-500 rounded-full flex-shrink-0"></div>
                        <span className="flex-1 text-gray-900">{objective}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveObjective(index)}
                          className="opacity-0 group-hover:opacity-100 p-1 text-red-600 hover:text-red-700 hover:bg-red-50 rounded transition-all"
                        >
                          <ApperIcon name="Trash2" size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <ApperIcon name="Target" size={48} className="mx-auto mb-3 text-gray-300" />
                    <p>아직 학습 목표가 없습니다.</p>
                    <p className="text-sm">위에서 새로운 목표를 추가해보세요.</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Curriculum Tab */}
          {activeTab === 'curriculum' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-gray-900">커리큘럼</h3>
                <Button
                  type="button"
                  variant="primary"
                  onClick={() => setShowNewCurriculumForm(true)}
                  className="px-4"
                >
                  <ApperIcon name="Plus" size={16} className="mr-1" />
                  항목 추가
                </Button>
              </div>

              {/* New Curriculum Form */}
              {showNewCurriculumForm && (
                <div className="p-4 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        제목 *
                      </label>
                      <input
                        type="text"
                        value={newCurriculumItem.title}
                        onChange={(e) => setNewCurriculumItem(prev => ({ ...prev, title: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        placeholder="커리큘럼 제목을 입력하세요"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Video Embed URL
                      </label>
                      <input
                        type="url"
                        value={newCurriculumItem.videoUrl}
                        onChange={(e) => setNewCurriculumItem(prev => ({ ...prev, videoUrl: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        placeholder="https://youtube.com/embed/..."
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        variant="primary"
                        onClick={handleAddCurriculumItem}
                        className="px-6"
                      >
                        저장
                      </Button>
                      <Button
                        type="button"
                        variant="secondary"
                        onClick={() => {
                          setShowNewCurriculumForm(false);
                          setNewCurriculumItem({ title: '', videoUrl: '' });
                        }}
                        className="px-6"
                      >
                        취소
                      </Button>
                    </div>
                  </div>
                </div>
              )}
)}

              {/* Curriculum List */}
              {formData.curriculum.length > 0 ? (
                <DragDropContext onDragEnd={handleDragEnd}>
                  <Droppable droppableId="curriculum-list">
                    {(provided) => (
                      <div
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                        className="space-y-2"
                      >
                        {formData.curriculum.map((item, index) => (
                          <Draggable key={item.id} draggableId={item.id} index={index}>
                            {(provided, snapshot) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                className={cn(
                                  "bg-white border border-gray-200 rounded-lg p-4 transition-all",
                                  snapshot.isDragging ? "shadow-lg" : "shadow-sm"
                                )}
                              >
                                <div className="flex items-center gap-3">
                                  <div
                                    {...provided.dragHandleProps}
                                    className="cursor-move p-1 text-gray-400 hover:text-gray-600"
                                  >
                                    <ApperIcon name="GripVertical" size={16} />
                                  </div>
                                  
                                  <div className="flex-1">
                                    <div className="flex items-center justify-between">
                                      <h4 className="font-medium text-gray-900">
                                        {index + 1}. {item.title}
                                      </h4>
                                      <button
                                        type="button"
                                        onClick={() => handleRemoveCurriculumItem(item.id)}
                                        className="p-1 text-red-600 hover:text-red-700 hover:bg-red-50 rounded transition-all"
                                      >
                                        <ApperIcon name="Trash2" size={16} />
                                      </button>
                                    </div>
                                    
                                    {item.videoUrl && (
                                      <div className="mt-2">
                                        <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden">
                                          <iframe
                                            src={item.videoUrl}
                                            className="w-full h-full"
                                            frameBorder="0"
                                            allowFullScreen
                                            title={item.title}
                                          />
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </DragDropContext>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <ApperIcon name="List" size={48} className="mx-auto mb-3 text-gray-300" />
                  <p>아직 커리큘럼이 없습니다.</p>
                  <p className="text-sm">위에서 새로운 항목을 추가해보세요.</p>
                </div>
              )}
          )}
        </form>
      </div>

      {/* Fixed Bottom Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-10">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex gap-4">
            <Button
              type="button"
              variant="secondary"
              onClick={() => navigate('/courses/manage')}
              className="flex-1"
              disabled={loading}
            >
              취소
            </Button>
            <Button
              type="button"
              variant="primary"
              onClick={handleSubmit}
              className="flex-1"
              disabled={loading}
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <ApperIcon name="Loader2" size={16} className="animate-spin" />
                  {isEditMode ? '수정 중...' : '등록 중...'}
                </div>
              ) : (
                isEditMode ? '수정 완료' : '등록 완료'
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}