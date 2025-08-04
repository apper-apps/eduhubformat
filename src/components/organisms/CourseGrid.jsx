import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { deleteCourse, getCourses } from "@/services/api/courseService";
import ApperIcon from "@/components/ApperIcon";
import CourseCard from "@/components/molecules/CourseCard";
import CourseFormDrawer from "@/components/organisms/CourseFormDrawer";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import Button from "@/components/atoms/Button";
import { cn } from "@/utils/cn";
const CourseGrid = ({ className, limit = null, showFilters = true }) => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("전체");
  const [sortBy, setSortBy] = useState("popularity");
  const [searchQuery, setSearchQuery] = useState("");
  const [priceRange, setPriceRange] = useState({ min: "", max: "" });
const [currentPage, setCurrentPage] = useState(1);
const [itemsPerPage] = useState(9);
const [showCourseForm, setShowCourseForm] = useState(false);

const navigate = useNavigate();
const { user } = useSelector((state) => state.auth);

  const categories = ["전체", "프로그래밍", "디자인", "비즈니스", "마케팅", "언어"];
  const sortOptions = [
    { value: "popularity", label: "인기순" },
    { value: "latest", label: "최신순" },
    { value: "price_low", label: "가격 낮은순" },
    { value: "price_high", label: "가격 높은순" },
  ];

  const loadCourses = async () => {
    try {
      setLoading(true);
      setError("");
      
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const data = await getCourses();
      setCourses(data);
    } catch (err) {
      setError("강의를 불러오는데 실패했습니다. 다시 시도해주세요.");
      console.error("Error loading courses:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCourses();
  }, []);

const filteredAndSortedCourses = React.useMemo(() => {
    let filtered = courses;

    // Filter by search query
    if (searchQuery.trim()) {
      filtered = filtered.filter(course => 
        course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.instructor.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by category
    if (selectedCategory !== "전체") {
      filtered = filtered.filter(course => course.category === selectedCategory);
    }

    // Filter by price range
    if (priceRange.min !== "") {
      filtered = filtered.filter(course => course.price >= parseInt(priceRange.min));
    }
    if (priceRange.max !== "") {
      filtered = filtered.filter(course => course.price <= parseInt(priceRange.max));
    }

    // Sort courses
    filtered = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case "latest":
          return new Date(b.createdAt) - new Date(a.createdAt);
        case "price_low":
          return a.price - b.price;
        case "price_high":
          return b.price - a.price;
        case "popularity":
        default:
          return b.students - a.students;
      }
    });

    return filtered;
  }, [courses, selectedCategory, sortBy, searchQuery, priceRange]);

  // Pagination logic
  const totalPages = Math.ceil(filteredAndSortedCourses.length / itemsPerPage);
  const paginatedCourses = React.useMemo(() => {
    if (limit) {
      return filteredAndSortedCourses.slice(0, limit);
    }
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredAndSortedCourses.slice(startIndex, endIndex);
  }, [filteredAndSortedCourses, currentPage, itemsPerPage, limit]);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, sortBy, searchQuery, priceRange]);

const handleClearFilters = () => {
    setSelectedCategory("전체");
    setSearchQuery("");
    setPriceRange({ min: "", max: "" });
    setSortBy("popularity");
    setCurrentPage(1);
  };

  const handleCourseCreated = () => {
    setShowCourseForm(false);
    toast.success("새 강의가 성공적으로 등록되었습니다!");
    loadCourses(); // Refresh the course list
  };

const handleOpenCourseForm = () => {
setShowCourseForm(true);
};
  if (loading) {
    return <Loading className={className} />;
  }

  if (error) {
    return <Error message={error} onRetry={loadCourses} className={className} />;
  }

  if (courses.length === 0) {
    return <Empty className={className} />;
  }

return (
<div className={cn("space-y-6", className)}>
{/* Header with Add Course Button */}
{showFilters && (
<div className="flex justify-between items-center mb-6">
<h2 className="text-2xl font-bold text-gray-900">강의 목록</h2>
{/* Desktop Add Course Button */}
<div className="hidden md:block">
<Button
id="AddCourseBtn"
variant="primary"
onClick={handleOpenCourseForm}
className="flex items-center gap-2"
title="새 강의 만들기"
>
<ApperIcon name="Plus" size={16} />
강의 등록
</Button>
</div>
</div>
)}

{/* Mobile Floating Action Button */}
<div className="md:hidden">
<button
onClick={handleOpenCourseForm}
className="floating-action-button"
title="새 강의 만들기"
aria-label="새 강의 등록"
>
<ApperIcon name="Plus" size={20} />
</button>
</div>
      
      {/* Search and Filters */}
      {showFilters && (
        <div className="bg-white rounded-lg shadow-card p-6 space-y-6">
          {/* Search Bar */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-gray-900">강의 검색</h3>
            <div className="relative">
              <ApperIcon 
                name="Search" 
                size={20} 
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" 
              />
              <input
                type="text"
                placeholder="강의명, 설명, 강사명으로 검색하세요..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <ApperIcon name="X" size={16} />
                </button>
              )}
            </div>
          </div>

          {/* Category Filter */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-gray-900">카테고리</h3>
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "primary" : "outline"}
                  size="small"
                  onClick={() => setSelectedCategory(category)}
                  className="transition-all duration-200 hover:scale-105"
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>

          {/* Price Range Filter */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-gray-900">가격 범위</h3>
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1">
                <label htmlFor="min-price" className="block text-sm text-gray-600 mb-1">최소 가격</label>
                <div className="relative">
                  <input
                    id="min-price"
                    type="number"
                    placeholder="0"
                    value={priceRange.min}
                    onChange={(e) => setPriceRange(prev => ({ ...prev, min: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    min="0"
                  />
                  <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm">원</span>
                </div>
              </div>
              <div className="flex items-end justify-center pb-2">
                <span className="text-gray-400">~</span>
              </div>
              <div className="flex-1">
                <label htmlFor="max-price" className="block text-sm text-gray-600 mb-1">최대 가격</label>
                <div className="relative">
                  <input
                    id="max-price"
                    type="number"
                    placeholder="1000000"
                    value={priceRange.max}
                    onChange={(e) => setPriceRange(prev => ({ ...prev, max: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    min="0"
                  />
                  <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm">원</span>
                </div>
              </div>
            </div>
          </div>

          {/* Sort, Results, and Clear Filters */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0 pt-4 border-t border-gray-200">
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-600">
                총 {filteredAndSortedCourses.length}개의 강의
              </div>
              {(searchQuery || selectedCategory !== "전체" || priceRange.min || priceRange.max) && (
                <Button
                  variant="outline"
                  size="small"
                  onClick={handleClearFilters}
                  className="text-xs"
                >
                  <ApperIcon name="RotateCcw" size={14} className="mr-1" />
                  필터 초기화
                </Button>
              )}
            </div>
            <div className="flex items-center space-x-3">
              <label htmlFor="sort" className="text-sm text-gray-600">정렬:</label>
              <select
                id="sort"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                {sortOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Course Grid */}
      {loading ? (
        <Loading />
      ) : error ? (
        <Error message={error} onRetry={loadCourses} />
      ) : paginatedCourses.length === 0 ? (
        <Empty 
          title="해당 조건의 강의가 없습니다"
          description="다른 검색어나 필터 조건을 시도해보세요."
        />
      ) : (
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {paginatedCourses.map((course, index) => (
            <div key={course.Id} className="relative group">
              <Link to={`/courses/${course.Id}`}>
                <CourseCard
                  course={course}
                  className="animate-fade-in hover:animate-scale-in"
                  style={{ animationDelay: `${index * 100}ms` }}
                />
              </Link>
{(user?.role === 'admin' || user?.role === 'instructor') && (
                <div className="card-admin-bar">
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      navigate(`/courses/edit/${course.Id}`);
                    }}
                    className="p-2 bg-white rounded-full shadow-md hover:bg-gray-50 transition-colors"
                    title="강의 수정"
                  >
                    <ApperIcon name="Edit" size={16} className="text-gray-600" />
                  </button>
                  <button
                    onClick={async (e) => {
                      e.preventDefault();
                      if (window.confirm('정말로 이 강의를 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.')) {
                        try {
                          await deleteCourse(course.Id);
                          toast.success('강의가 성공적으로 삭제되었습니다.');
                          loadCourses(); // Refresh the course list
                        } catch (error) {
                          toast.error(error.message || '강의 삭제에 실패했습니다.');
                        }
                      }
                    }}
                    className="p-2 bg-white rounded-full shadow-md hover:bg-red-50 transition-colors"
                    title="강의 삭제"
                  >
                    <ApperIcon name="Trash2" size={16} className="text-red-600" />
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {!limit && totalPages > 1 && (
        <div className="flex items-center justify-center space-x-2 pt-8">
          <Button
            variant="outline"
            size="small"
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="transition-all duration-200"
          >
            <ApperIcon name="ChevronLeft" size={16} />
          </Button>
          
          {[...Array(totalPages)].map((_, index) => {
            const page = index + 1;
            const isActive = page === currentPage;
            
            // Show first, last, current, and adjacent pages
            if (
              page === 1 || 
              page === totalPages || 
              Math.abs(page - currentPage) <= 1
            ) {
              return (
                <Button
                  key={page}
                  variant={isActive ? "primary" : "outline"}
                  size="small"
                  onClick={() => setCurrentPage(page)}
                  className={cn(
                    "min-w-[40px] transition-all duration-200",
                    isActive && "scale-110"
                  )}
                >
                  {page}
                </Button>
              );
            } else if (
              (page === currentPage - 2 && currentPage > 3) ||
              (page === currentPage + 2 && currentPage < totalPages - 2)
            ) {
              return (
                <span key={page} className="text-gray-400 px-2">
                  ...
                </span>
              );
            }
            return null;
          })}
          
          <Button
            variant="outline"
            size="small"
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="transition-all duration-200"
          >
            <ApperIcon name="ChevronRight" size={16} />
          </Button>
        </div>
      )}

      {/* Load More Button (if limited) */}
      {limit && filteredAndSortedCourses.length >= limit && (
        <div className="text-center pt-8">
          <Button variant="outline" size="large">
더 많은 강의 보기
          </Button>
        </div>
      )}

      {/* Course Form Drawer */}
      <CourseFormDrawer
        isOpen={showCourseForm}
        onClose={() => setShowCourseForm(false)}
        onCourseCreated={handleCourseCreated}
      />
</div>
  );
};

export default CourseGrid;