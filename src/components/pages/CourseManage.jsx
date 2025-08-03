import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import { cn } from '@/utils/cn';
import { getCourses, deleteCourse } from '@/services/api/courseService';
import Button from '@/components/atoms/Button';
import ApperIcon from '@/components/ApperIcon';
import Loading from '@/components/ui/Loading';
import Error from '@/components/ui/Error';
import Empty from '@/components/ui/Empty';

function CourseManage() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [courseToDelete, setCourseToDelete] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    loadCourses();
  }, []);

  const loadCourses = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getCourses();
      setCourses(data);
    } catch (err) {
      setError(err.message);
      toast.error('강의 목록을 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (course) => {
    setCourseToDelete(course);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (!courseToDelete) return;
    
    try {
      setDeleteLoading(courseToDelete.Id);
      await deleteCourse(courseToDelete.Id);
      toast.success('강의가 성공적으로 삭제되었습니다.');
      await loadCourses(); // Refresh the list
      setShowDeleteModal(false);
      setCourseToDelete(null);
    } catch (err) {
      toast.error(err.message || '강의 삭제에 실패했습니다.');
    } finally {
      setDeleteLoading(null);
    }
  };

  const handleDeleteCancel = () => {
    setShowDeleteModal(false);
    setCourseToDelete(null);
  };

  const formatDate = (dateString) => {
    try {
      return format(new Date(dateString), 'yyyy.MM.dd', { locale: ko });
    } catch {
      return '-';
    }
  };

  const getCategoryLabel = (category) => {
    const categoryMap = {
      'programming': '프로그래밍',
      'design': '디자인',
      'business': '비즈니스',
      'marketing': '마케팅',
      'data': '데이터분석',
      'language': '언어'
    };
    return categoryMap[category] || category;
  };

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadCourses} />;

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">강의 관리</h1>
          <p className="text-gray-600">전체 강의를 관리하고 새로운 강의를 등록할 수 있습니다.</p>
        </div>
        <Link to="/courses/new">
          <Button variant="primary" className="flex items-center gap-2">
            <ApperIcon name="Plus" size={20} />
            신규 등록
          </Button>
        </Link>
      </div>

      {/* Courses Table */}
      {courses.length === 0 ? (
        <Empty 
          title="등록된 강의가 없습니다"
          description="새로운 강의를 등록해보세요."
          action={
            <Link to="/courses/new">
              <Button variant="primary">강의 등록하기</Button>
            </Link>
          }
        />
      ) : (
        <div className="bg-white rounded-lg shadow-card overflow-hidden">
          {/* Desktop Table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">강의명</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">카테고리</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">등록일</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">관리</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {courses.map((course) => (
                  <tr key={course.Id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={course.image}
                          alt={course.title}
                          className="w-12 h-12 rounded-lg object-cover"
                          onError={(e) => {
                            e.target.src = '/api/placeholder/400/300';
                          }}
                        />
                        <div>
                          <h3 className="font-semibold text-gray-900 line-clamp-1">{course.title}</h3>
                          <p className="text-sm text-gray-500">₩{course.price?.toLocaleString()}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {getCategoryLabel(course.category)}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {formatDate(course.createdAt)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => navigate(`/courses/${course.Id}/edit`)}
                          className="p-2 text-gray-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                          title="수정"
                        >
                          <ApperIcon name="Edit" size={16} />
                        </button>
                        <button
                          onClick={() => handleDeleteClick(course)}
                          className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="삭제"
                          disabled={deleteLoading === course.Id}
                        >
                          {deleteLoading === course.Id ? (
                            <ApperIcon name="Loader2" size={16} className="animate-spin" />
                          ) : (
                            <ApperIcon name="Trash2" size={16} />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="md:hidden divide-y divide-gray-200">
            {courses.map((course) => (
              <div key={course.Id} className="p-4">
                <div className="flex items-start gap-3 mb-3">
                  <img
                    src={course.image}
                    alt={course.title}
                    className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
                    onError={(e) => {
                      e.target.src = '/api/placeholder/400/300';
                    }}
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 line-clamp-2 mb-1">{course.title}</h3>
                    <p className="text-sm text-gray-500 mb-1">₩{course.price?.toLocaleString()}</p>
                    <div className="flex items-center gap-3 text-xs text-gray-500">
                      <span>{getCategoryLabel(course.category)}</span>
                      <span>•</span>
                      <span>{formatDate(course.createdAt)}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-end gap-2">
                  <button
                    onClick={() => navigate(`/courses/${course.Id}/edit`)}
                    className="flex items-center gap-1 px-3 py-1.5 text-sm text-gray-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                  >
                    <ApperIcon name="Edit" size={14} />
                    수정
                  </button>
                  <button
                    onClick={() => handleDeleteClick(course)}
                    className="flex items-center gap-1 px-3 py-1.5 text-sm text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    disabled={deleteLoading === course.Id}
                  >
                    {deleteLoading === course.Id ? (
                      <ApperIcon name="Loader2" size={14} className="animate-spin" />
                    ) : (
                      <ApperIcon name="Trash2" size={14} />
                    )}
                    삭제
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-elevated max-w-md w-full p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <ApperIcon name="AlertTriangle" size={24} className="text-red-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">강의 삭제</h3>
                <p className="text-sm text-gray-600">이 작업은 되돌릴 수 없습니다.</p>
              </div>
            </div>
            
            {courseToDelete && (
              <div className="bg-gray-50 rounded-lg p-3 mb-6">
                <p className="text-sm text-gray-600 mb-1">삭제할 강의:</p>
                <p className="font-semibold text-gray-900">{courseToDelete.title}</p>
              </div>
            )}
            
            <div className="flex gap-3">
              <Button
                variant="secondary"
                onClick={handleDeleteCancel}
                className="flex-1"
                disabled={deleteLoading}
              >
                취소
              </Button>
              <Button
                variant="primary"
                onClick={handleDeleteConfirm}
                className="flex-1 bg-red-600 hover:bg-red-700"
                disabled={deleteLoading}
              >
                {deleteLoading ? (
                  <div className="flex items-center gap-2">
                    <ApperIcon name="Loader2" size={16} className="animate-spin" />
                    삭제 중...
                  </div>
                ) : (
                  '삭제하기'
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CourseManage;