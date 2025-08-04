import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import CourseCard from "@/components/molecules/CourseCard";
import CourseFormDrawer from "@/components/organisms/CourseFormDrawer";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import Button from "@/components/atoms/Button";
import { cn } from "@/utils/cn";

// Local mock courses data - exactly 10 items
const mockCourses = [
  {
    "Id": 1,
    "title": "React 마스터클래스: 현대적 웹 개발의 모든 것",
    "coverImage": "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&h=450&fit=crop&crop=center",
    "price": 299000,
    "cohort": "12기",
    "category": "프로그래밍",
    "instructor": "김개발",
    "description": "React 18의 최신 기능부터 Next.js까지, 현대적인 프론트엔드 개발을 마스터하세요.",
    "duration": "8주",
    "students": 1247,
    "rating": 4.9,
    "level": "중급",
    "createdAt": "2024-01-15T09:00:00Z"
  },
  {
    "Id": 2,
    "title": "UI/UX 디자인 완전정복: 피그마로 배우는 실무 디자인",
    "coverImage": "https://images.unsplash.com/photo-1559028006-448665bd7c7f?w=800&h=450&fit=crop&crop=center",
    "price": 249000,
    "cohort": "8기",
    "category": "디자인",
    "instructor": "박디자인",
    "description": "사용자 중심의 디자인 사고부터 실제 앱 디자인까지, 전문 디자이너로 성장하세요.",
    "duration": "10주",
    "students": 892,
    "rating": 4.8,
    "level": "초급",
    "createdAt": "2024-01-20T10:30:00Z"
  },
  {
    "Id": 3,
    "title": "Node.js 백엔드 개발: Express부터 배포까지",
    "coverImage": "https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=800&h=450&fit=crop&crop=center",
    "price": 349000,
    "cohort": "5기",
    "category": "프로그래밍",
    "instructor": "이백엔드",
    "description": "확장 가능한 백엔드 시스템 구축부터 AWS 배포까지, 실무에서 바로 쓸 수 있는 기술을 배우세요.",
    "duration": "12주",
    "students": 634,
    "rating": 4.7,
    "level": "중급",
    "createdAt": "2024-02-01T14:00:00Z"
  },
  {
    "Id": 4,
    "title": "디지털 마케팅 전략: 브랜드 성장의 비밀",
    "coverImage": "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=450&fit=crop&crop=center",
    "price": 199000,
    "cohort": "15기",
    "category": "마케팅",
    "instructor": "최마케팅",
    "description": "소셜미디어부터 퍼포먼스 마케팅까지, 디지털 시대의 마케팅 전략을 마스터하세요.",
    "duration": "6주",
    "students": 1456,
    "rating": 4.6,
    "level": "초급",
    "createdAt": "2024-02-10T11:15:00Z"
  },
  {
    "Id": 5,
    "title": "Python 데이터 분석: 입문부터 실무까지",
    "coverImage": "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=450&fit=crop&crop=center",
    "price": 279000,
    "cohort": "7기",
    "category": "프로그래밍",
    "instructor": "정데이터",
    "description": "Pandas, NumPy부터 머신러닝까지, 데이터 분석의 전 과정을 실습으로 배우세요.",
    "duration": "9주",
    "students": 823,
    "rating": 4.8,
    "level": "초급",
    "createdAt": "2024-02-15T16:20:00Z"
  },
  {
    "Id": 6,
    "title": "스타트업 창업 실무: 아이디어에서 투자까지",
    "coverImage": "https://images.unsplash.com/photo-1553484771-371a605b060b?w=800&h=450&fit=crop&crop=center",
    "price": 399000,
    "cohort": "3기",
    "category": "비즈니스",
    "instructor": "강창업",
    "description": "실제 창업 경험을 바탕으로 한 실무 중심의 창업 가이드와 투자 유치 전략을 배우세요.",
    "duration": "8주",
    "students": 456,
    "rating": 4.9,
    "level": "중급",
    "createdAt": "2024-02-20T13:45:00Z"
  },
  {
    "Id": 7,
    "title": "모바일 앱 개발: React Native로 만드는 크로스플랫폼 앱",
    "coverImage": "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800&h=450&fit=crop&crop=center",
    "price": 329000,
    "cohort": "6기",
    "category": "프로그래밍",
    "instructor": "송모바일",
    "description": "하나의 코드로 iOS, Android 앱을 동시에 개발하는 방법을 실습으로 배우세요.",
    "duration": "10주",
    "students": 567,
    "rating": 4.7,
    "level": "중급",
    "createdAt": "2024-02-25T09:30:00Z"
  },
  {
    "Id": 8,
    "title": "Adobe 포토샵 & 일러스트레이터 마스터코스",
    "coverImage": "https://images.unsplash.com/photo-1626785774625-0b1c2c4eab67?w=800&h=450&fit=crop&crop=center",
    "price": 189000,
    "cohort": "20기",
    "category": "디자인",
    "instructor": "한그래픽",
    "description": "기초부터 고급 기법까지, 그래픽 디자인의 필수 도구를 완전히 마스터하세요.",
    "duration": "7주",
    "students": 1923,
    "rating": 4.8,
    "level": "초급",
    "createdAt": "2024-03-01T15:10:00Z"
  },
  {
    "Id": 9,
    "title": "블록체인 & 암호화폐 개발: Web3의 미래",
    "coverImage": "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=800&h=450&fit=crop&crop=center",
    "price": 449000,
    "cohort": "2기",
    "category": "프로그래밍",
    "instructor": "임블록체인",
    "description": "스마트 컨트랙트부터 DeFi 애플리케이션까지, Web3 개발의 모든 것을 배우세요.",
    "duration": "14주",
    "students": 234,
    "rating": 4.9,
    "level": "고급",
    "createdAt": "2024-03-05T12:25:00Z"
  },
  {
    "Id": 10,
    "title": "영상 제작 & 편집: 유튜브 크리에이터 되기",
    "coverImage": "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=800&h=450&fit=crop&crop=center",
    "price": 219000,
    "cohort": "11기",
    "category": "디자인",
    "instructor": "유영상",
    "description": "기획부터 촬영, 편집, 업로드까지 성공적인 유튜브 채널 운영의 모든 과정을 배우세요.",
    "duration": "8주",
    "students": 1134,
    "rating": 4.7,
    "level": "초급",
    "createdAt": "2024-03-10T17:40:00Z"
  }
];
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
      
      // Use local mock data instead of API call
      setCourses([...mockCourses]);
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
                          // Remove from local mock data instead of API call
                          const updatedCourses = courses.filter(c => c.Id !== course.Id);
                          setCourses(updatedCourses);
                          toast.success('강의가 성공적으로 삭제되었습니다.');
                        } catch (error) {
                          toast.error('강의 삭제에 실패했습니다.');
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