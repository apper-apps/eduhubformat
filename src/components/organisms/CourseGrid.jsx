import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { cn } from "@/utils/cn";
import CourseCard from "@/components/molecules/CourseCard";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import { getCourses } from "@/services/api/courseService";
const CourseGrid = ({ className, limit = null, showFilters = true }) => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("전체");
  const [sortBy, setSortBy] = useState("popularity");

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

    // Filter by category
    if (selectedCategory !== "전체") {
      filtered = filtered.filter(course => course.category === selectedCategory);
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

    // Apply limit if specified
    if (limit) {
      filtered = filtered.slice(0, limit);
    }

    return filtered;
  }, [courses, selectedCategory, sortBy, limit]);

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
      {/* Filters */}
      {showFilters && (
        <div className="bg-white rounded-lg shadow-card p-6 space-y-4">
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
                  className="transition-all duration-200"
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>

          {/* Sort and Results */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0 pt-4 border-t border-gray-200">
            <div className="text-sm text-gray-600">
              총 {filteredAndSortedCourses.length}개의 강의
            </div>
            <div className="flex items-center space-x-3">
              <label htmlFor="sort" className="text-sm text-gray-600">정렬:</label>
              <select
                id="sort"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
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
      {filteredAndSortedCourses.length === 0 ? (
        <Empty 
          title="해당 조건의 강의가 없습니다"
          description="다른 카테고리를 선택하거나 필터를 초기화해보세요."
        />
      ) : (
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAndSortedCourses.map((course) => (
            <Link key={course.Id} to={`/courses/${course.Id}`}>
              <CourseCard
                course={course}
                className="animate-scale-in"
                style={{ animationDelay: `${filteredAndSortedCourses.indexOf(course) * 100}ms` }}
              />
            </Link>
          ))}
        </div>
      )}

      {/* Load More Button (if limited) */}
      {limit && filteredAndSortedCourses.length >= limit && (
        <div className="text-center pt-8">
          <Button variant="outline" size="large">
            <ApperIcon name="Plus" size={20} className="mr-2" />
            더 많은 강의 보기
          </Button>
        </div>
      )}
    </div>
  );
};

export default CourseGrid;