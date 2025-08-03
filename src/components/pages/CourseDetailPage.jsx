import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { cn } from "@/utils/cn";
import { getCourseById } from "@/services/api/courseService";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import ApperIcon from "@/components/ApperIcon";

const CourseDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadCourse = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const courseData = await getCourseById(parseInt(id));
        setCourse(courseData);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    loadCourse();
  }, [id]);

  const formatPrice = (price) => {
    return new Intl.NumberFormat("ko-KR", {
      style: "currency",
      currency: "KRW",
    }).format(price);
  };

  const calculateDaysLeft = () => {
    // Mock start date - 30 days from now
    const startDate = new Date();
    startDate.setDate(startDate.getDate() + 30);
    const today = new Date();
    const diffTime = startDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const handleEnroll = () => {
    toast.success(`${course.title} 수강신청이 완료되었습니다!`);
  };

  if (isLoading) return <Loading />;
  if (error) return <Error message={error} />;
  if (!course) return <Error message="강의를 찾을 수 없습니다." />;

  const daysLeft = calculateDaysLeft();

  // Mock curriculum data
  const curriculum = [
    { week: 1, title: "기초 개념과 환경 설정", lessons: 4, duration: "2시간" },
    { week: 2, title: "핵심 기능 익히기", lessons: 5, duration: "2.5시간" },
    { week: 3, title: "실전 프로젝트 시작", lessons: 6, duration: "3시간" },
    { week: 4, title: "고급 기법과 최적화", lessons: 4, duration: "2시간" },
    { week: 5, title: "배포와 운영", lessons: 3, duration: "1.5시간" },
  ];

  const learningOutcomes = [
    "실무에서 바로 적용할 수 있는 핵심 기술 습득",
    "체계적인 프로젝트 구조 설계 능력",
    "효율적인 개발 워크플로우 구축",
    "최신 트렌드와 베스트 프랙티스 이해",
    "포트폴리오에 추가할 수 있는 완성도 높은 프로젝트",
  ];

  return (
    <div className="min-h-screen bg-stone-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center space-x-2 py-4 text-sm">
            <Link 
              to="/courses" 
              className="text-gray-500 hover:text-primary-800 transition-colors duration-200"
            >
              강의 목록
            </Link>
            <ApperIcon name="ChevronRight" size={16} className="text-gray-400" />
            <span className="text-gray-900 font-medium truncate">{course.title}</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Course Header */}
            <div className="bg-white rounded-xl shadow-card p-6 lg:p-8">
              <div className="space-y-6">
                {/* Cover Image */}
                <div className="aspect-video rounded-lg overflow-hidden">
                  <img
                    src={course.coverImage}
                    alt={course.title}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Title and Badges */}
                <div className="space-y-4">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge variant="primary">{course.category}</Badge>
                    <Badge variant="secondary">{course.level}</Badge>
                    {course.cohort && (
                      <Badge variant="cohort">{course.cohort}</Badge>
                    )}
                  </div>

                  <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 korean-text">
                    {course.title}
                  </h1>

                  <div className="flex items-center space-x-6 text-sm text-gray-600">
                    <div className="flex items-center space-x-2">
                      <ApperIcon name="User" size={16} />
                      <span>{course.instructor}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <ApperIcon name="Users" size={16} />
                      <span>{course.students?.toLocaleString()}명 수강</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <ApperIcon name="Star" size={16} className="text-yellow-400 fill-current" />
                      <span>{course.rating}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Course Description */}
            <div className="bg-white rounded-xl shadow-card p-6 lg:p-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4">강의 소개</h2>
              <p className="text-gray-700 korean-text leading-relaxed">
                {course.description}
              </p>
            </div>

            {/* Learning Outcomes */}
            <div className="bg-white rounded-xl shadow-card p-6 lg:p-8">
              <h2 className="text-xl font-bold text-gray-900 mb-6">학습 목표</h2>
              <div className="space-y-3">
                {learningOutcomes.map((outcome, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className="flex-shrink-0 w-6 h-6 bg-primary-100 rounded-full flex items-center justify-center mt-0.5">
                      <ApperIcon name="Check" size={14} className="text-primary-800" />
                    </div>
                    <span className="text-gray-700 korean-text">{outcome}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Curriculum */}
            <div className="bg-white rounded-xl shadow-card p-6 lg:p-8">
              <h2 className="text-xl font-bold text-gray-900 mb-6">커리큘럼</h2>
              <div className="space-y-4">
                {curriculum.map((week) => (
                  <div 
                    key={week.week}
                    className="border border-gray-200 rounded-lg p-4 hover:border-primary-300 transition-colors duration-200"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3">
                          <div className="flex-shrink-0 w-8 h-8 bg-primary-800 text-white rounded-full flex items-center justify-center text-sm font-bold">
                            {week.week}
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900">{week.title}</h3>
                            <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                              <span>{week.lessons}개 강의</span>
                              <span>{week.duration}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <ApperIcon name="ChevronDown" size={20} className="text-gray-400" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-8 space-y-6">
              {/* Enrollment Card */}
              <div className="bg-white rounded-xl shadow-card p-6">
                <div className="space-y-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-primary-800 mb-2">
                      {formatPrice(course.price)}
                    </div>
                    <p className="text-sm text-gray-600">일시불 결제</p>
                  </div>

                  <Button 
                    onClick={handleEnroll}
                    className="w-full btn-primary text-lg py-4"
                  >
                    수강신청
                  </Button>

                  <div className="text-center text-sm text-gray-600">
                    <p>30일 무조건 환불보장</p>
                  </div>
                </div>
              </div>

              {/* Course Info */}
              <div className="bg-white rounded-xl shadow-card p-6">
                <h3 className="font-bold text-gray-900 mb-4">강의 정보</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-600">수강 기간</span>
                    <span className="font-semibold text-gray-900">{course.duration}</span>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-600">난이도</span>
                    <Badge variant="secondary" size="small">{course.level}</Badge>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-600">수강생</span>
                    <span className="font-semibold text-gray-900">{course.students?.toLocaleString()}명</span>
                  </div>
                  <div className="flex items-center justify-between py-2">
                    <span className="text-gray-600">평점</span>
                    <div className="flex items-center space-x-1">
                      <ApperIcon name="Star" size={16} className="text-yellow-400 fill-current" />
                      <span className="font-semibold text-gray-900">{course.rating}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Countdown */}
              <div className="bg-gradient-to-r from-primary-800 to-accent-500 rounded-xl shadow-card p-6 text-white">
                <div className="text-center">
                  <h3 className="font-bold mb-2">다음 기수 시작까지</h3>
                  <div className="text-3xl font-bold mb-2">D-{daysLeft}</div>
                  <p className="text-sm opacity-90">지금 신청하고 얼리버드 혜택을 받으세요!</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetailPage;