import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { formatPrice } from "@/services/api/orderService";
import { enrollInCourse } from "@/services/api/enrollmentService";
import { getCohorts, getCourseById } from "@/services/api/courseService";
import ApperIcon from "@/components/ApperIcon";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Badge from "@/components/atoms/Badge";
import Button from "@/components/atoms/Button";
import { cn } from "@/utils/cn";

const CourseDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
const [course, setCourse] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cohorts, setCohorts] = useState([]);
  const [showCohortModal, setShowCohortModal] = useState(false);
  const [showEnrollmentModal, setShowEnrollmentModal] = useState(false);
  const [selectedCohort, setSelectedCohort] = useState(null);
  const [isEnrolling, setIsEnrolling] = useState(false);
  const [userEnrollment, setUserEnrollment] = useState(null);
  const [enrollmentLoading, setEnrollmentLoading] = useState(true);

useEffect(() => {
    const loadCourse = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const [courseData, cohortsData] = await Promise.all([
          getCourseById(parseInt(id)),
          getCohorts(parseInt(id))
        ]);
        setCourse(courseData);
        setCohorts(cohortsData);
        
        // Load user enrollment status
        await loadUserEnrollment(parseInt(id));
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    loadCourse();
  }, [id]);

  const loadUserEnrollment = async (courseId) => {
    try {
      setEnrollmentLoading(true);
      
      // Initialize Apper SDK if needed
      if (!window.Apper) {
        const script = document.createElement('script');
        script.src = import.meta.env.VITE_APPER_SDK_CDN_URL;
        script.async = true;
        document.head.appendChild(script);
        
        await new Promise((resolve, reject) => {
          script.onload = resolve;
          script.onerror = reject;
        });
      }

      await window.Apper.init({
        projectId: import.meta.env.VITE_APPER_PROJECT_ID,
        publicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      // Find user's enrollment for this course
      const enrollments = await window.Apper.collection('Enrollments').find({
        where: {
          user_id: 1, // Current user ID (hardcoded for demo)
          course_id: courseId
        }
      });

      if (enrollments.length > 0) {
        // Get the latest enrollment
        const latestEnrollment = enrollments.sort((a, b) => 
          new Date(b.created_at) - new Date(a.created_at)
        )[0];
        setUserEnrollment(latestEnrollment);
      }
    } catch (err) {
      console.warn('Could not load enrollment status:', err.message);
    } finally {
      setEnrollmentLoading(false);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("ko-KR", {
      style: "currency",
      currency: "KRW",
    }).format(price);
  };

const calculateDaysLeft = (startDate) => {
    const today = new Date();
    const start = new Date(startDate);
    const diffTime = start - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

const handleEnrollClick = () => {
    if (cohorts.length === 1) {
      // If only one cohort, skip cohort selection
      setSelectedCohort(cohorts[0]);
      setShowEnrollmentModal(true);
    } else {
      // Show cohort selection modal
      setShowCohortModal(true);
    }
  };

  const handleCohortSelect = (cohort) => {
    setSelectedCohort(cohort);
    setShowCohortModal(false);
    setShowEnrollmentModal(true);
  };

const handleEnrollConfirm = async () => {
    if (!selectedCohort) return;

    try {
      setIsEnrolling(true);
      
      const result = await enrollInCourse(course.Id, selectedCohort.id);
      
      const statusMessage = result.status === 'enrolled' 
        ? '등록 완료 🎉' 
        : '대기 신청 완료';
        
      toast.success(statusMessage);
      setShowEnrollmentModal(false);
      setSelectedCohort(null);
      
      // Refresh cohorts and user enrollment data
      const updatedCohorts = await getCohorts(course.Id);
      setCohorts(updatedCohorts);
      await loadUserEnrollment(course.Id);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setIsEnrolling(false);
    }
  };

  const getRemainingSpots = (cohort) => {
    return cohort.capacity - cohort.enrolled;
  };

  const getNextCohort = () => {
    return cohorts.find(cohort => getRemainingSpots(cohort) > 0) || cohorts[0];
  };

  if (isLoading) return <Loading />;
  if (error) return <Error message={error} />;
  if (!course) return <Error message="강의를 찾을 수 없습니다." />;

const nextCohort = getNextCohort();
  const daysLeft = nextCohort ? calculateDaysLeft(nextCohort.startDate) : 0;

  // Helper function to calculate D-day
  const calculateDDay = (startDate) => {
    const today = new Date();
    const start = new Date(startDate);
    const diffTime = start - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

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

            {/* Course Tabs */}
            <div className="bg-white rounded-xl shadow-card">
              <div className="border-b border-gray-200">
                <nav className="flex space-x-8 px-6">
                  <button className="py-4 px-1 border-b-2 border-primary-500 font-medium text-sm text-primary-600">
                    강의 소개
                  </button>
                  <button className="py-4 px-1 border-b-2 border-transparent font-medium text-sm text-gray-500 hover:text-gray-700 hover:border-gray-300">
                    커리큘럼
                  </button>
                  <button className="py-4 px-1 border-b-2 border-transparent font-medium text-sm text-gray-500 hover:text-gray-700 hover:border-gray-300">
                    수강후기
                  </button>
                  {userEnrollment && (
                    <button className="py-4 px-1 border-b-2 border-transparent font-medium text-sm text-gray-500 hover:text-gray-700 hover:border-gray-300 flex items-center space-x-2">
                      <span>내 상태</span>
                      {!enrollmentLoading && (
                        <Badge 
                          variant={userEnrollment.status === 'enrolled' ? 'default' : 'outline'}
                          className={userEnrollment.status === 'enrolled' 
                            ? 'bg-green-500 text-white' 
                            : 'text-orange-600 border-orange-600'
                          }
                        >
                          {userEnrollment.status === 'enrolled' ? '수강중' : '대기중'}
                        </Badge>
                      )}
                    </button>
                  )}
                </nav>
              </div>
              
<div className="p-6 lg:p-8">
                <h2 className="text-xl font-bold text-gray-900 mb-4">강의 소개</h2>
                <p className="text-gray-700 korean-text leading-relaxed">
                  {course.description}
                </p>
              </div>
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
{/* EnrollBox Section */}
              <div className="bg-white rounded-xl shadow-card p-6">
                <div className="space-y-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-primary-800 mb-2">
                      {formatPrice(course.price)}
                    </div>
                    <p className="text-sm text-gray-600">일시불 결제</p>
                  </div>

                  {/* D-day and Cohort Selection */}
                  {nextCohort && (
                    <div className="space-y-4">
                      {/* D-day Display */}
                      <div className="bg-primary-50 rounded-lg p-4 text-center">
                        <div className="flex items-center justify-center space-x-2 mb-2">
                          <ApperIcon name="Clock" size={20} className="text-primary-600" />
                          <span className="text-lg font-bold text-primary-800">
                            ⏳ D-{calculateDDay(nextCohort.startDate)}
                          </span>
                        </div>
                        <p className="text-sm text-primary-600">
                          {nextCohort.name} 시작까지
                        </p>
                      </div>

                      {/* Cohort Dropdown */}
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">기수 선택</label>
                        <div className="relative">
                          <select 
                            value={selectedCohort?.id || ''} 
                            onChange={(e) => {
                              const cohortId = parseInt(e.target.value);
                              const cohort = cohorts.find(c => c.id === cohortId);
                              setSelectedCohort(cohort);
                            }}
                            className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white"
                          >
                            <option value="">기수를 선택하세요</option>
                            {cohorts.map((cohort) => {
                              const spotsLeft = cohort.capacity - cohort.enrolled;
                              return (
                                <option key={cohort.id} value={cohort.id}>
                                  {cohort.name} ({new Date(cohort.startDate).toLocaleDateString('ko-KR')}) - 잔여 {spotsLeft}석
                                </option>
                              );
                            })}
                          </select>
                        </div>
                      </div>

                      {/* Selected Cohort Info */}
                      {selectedCohort && (
                        <div className="bg-gray-50 rounded-lg p-4">
                          <div className="flex justify-between items-center mb-2">
                            <h4 className="font-semibold text-gray-900">{selectedCohort.name}</h4>
                            {selectedCohort.capacity - selectedCohort.enrolled === 0 && (
                              <Badge variant="outline" className="text-orange-600 border-orange-600">
                                Full
                              </Badge>
                            )}
                          </div>
                          <div className="text-sm text-gray-600 space-y-1">
                            <p>시작일: {new Date(selectedCohort.startDate).toLocaleDateString('ko-KR')}</p>
                            <div className="flex justify-between">
                              <span>잔여석: {selectedCohort.capacity - selectedCohort.enrolled}명</span>
                              <span>총 {selectedCohort.capacity}명</span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  <Button 
                    onClick={() => {
                      if (!selectedCohort) {
                        toast.error('기수를 선택해주세요.');
                        return;
                      }
                      setShowEnrollmentModal(true);
                    }}
                    className={cn(
                      "w-full text-lg py-4",
                      selectedCohort && selectedCohort.capacity - selectedCohort.enrolled > 0 
                        ? "btn-primary" 
                        : "bg-orange-500 hover:bg-orange-600 text-white font-semibold"
                    )}
                    disabled={!selectedCohort}
                  >
                    {!selectedCohort 
                      ? "기수를 선택하세요"
                      : selectedCohort.capacity - selectedCohort.enrolled > 0 
                        ? "수강 신청" 
                        : "대기 신청"
                    }
}
                  </Button>

                  {/* Review Button for Enrolled Users */}
                  {userEnrollment && userEnrollment.status === 'enrolled' && (
                    <Button 
                      variant="outline"
                      className="w-full mt-3"
                      onClick={() => {
                        // Navigate to review form with course context
                        window.location.href = `/review/create?type=course&itemId=${course.Id}&title=${encodeURIComponent(course.title)}`;
                      }}
                    >
                      <ApperIcon name="Star" size={16} className="mr-2" />
                      후기 작성
                    </Button>
                  )}

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
{nextCohort && daysLeft > 0 && (
                <div className="bg-gradient-to-r from-primary-800 to-accent-500 rounded-xl shadow-card p-6 text-white">
                  <div className="text-center">
                    <h3 className="font-bold mb-2">{nextCohort.name} 시작까지</h3>
                    <div className="text-3xl font-bold mb-2">D-{daysLeft}</div>
                    <p className="text-sm opacity-90">지금 신청하고 얼리버드 혜택을 받으세요!</p>
                  </div>
                </div>
              )}
            </div>
</div>
        </div>
      </div>

      {/* Cohort Selection Modal */}
      {showCohortModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full max-h-[80vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-gray-900">기수 선택</h3>
                <button
                  onClick={() => setShowCohortModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <ApperIcon name="X" size={24} />
                </button>
              </div>

              <div className="space-y-4">
                {cohorts.map((cohort) => {
                  const remainingSpots = getRemainingSpots(cohort);
                  const daysUntilStart = calculateDaysLeft(cohort.startDate);
                  
                  return (
                    <div
                      key={cohort.id}
                      onClick={() => handleCohortSelect(cohort)}
                      className="border rounded-lg p-4 cursor-pointer hover:border-primary-500 hover:bg-primary-50 transition-all"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-semibold text-gray-900">{cohort.name}</h4>
                        {remainingSpots === 0 && (
                          <Badge variant="outline" className="text-orange-600 border-orange-600">
                            대기신청
                          </Badge>
                        )}
                      </div>
                      
                      <div className="text-sm text-gray-600 space-y-1">
                        <p>시작일: {new Date(cohort.startDate).toLocaleDateString('ko-KR')}</p>
                        <p>
                          {daysUntilStart > 0 ? `D-${daysUntilStart}` : '진행중'}
                        </p>
                        <div className="flex justify-between">
                          <span>잔여석: {remainingSpots}명</span>
                          <span>총 {cohort.capacity}명</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Enrollment Confirmation Modal */}
{/* EnrollConfirmModal */}
      {showEnrollmentModal && selectedCohort && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-gray-900">수강신청 확인</h3>
                <button
                  onClick={() => {
                    setShowEnrollmentModal(false);
                    setSelectedCohort(null);
                  }}
                  className="text-gray-400 hover:text-gray-600"
                  disabled={isEnrolling}
                >
                  <ApperIcon name="X" size={24} />
                </button>
              </div>

              <div className="space-y-4 mb-6">
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-2">{course.title}</h4>
                  <div className="text-sm text-gray-600 space-y-1">
                    <p>선택 코호트: {selectedCohort.name}</p>
                    <p>시작일: {new Date(selectedCohort.startDate).toLocaleDateString('ko-KR')}</p>
                    <p>수강료: {formatPrice(course.price)}</p>
                    <p>강사: {course.instructor}</p>
                    <p>기간: {course.duration}</p>
                    <p>잔여석: {selectedCohort.capacity - selectedCohort.enrolled}명</p>
                  </div>
                </div>

                {selectedCohort.capacity - selectedCohort.enrolled === 0 && (
                  <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                    <div className="flex items-center space-x-2">
                      <ApperIcon name="AlertTriangle" size={20} className="text-orange-600" />
                      <p className="text-sm text-orange-800">
                        해당 기수는 정원이 마감되어 대기신청으로 진행됩니다.
                      </p>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex space-x-3">
                <Button
                  onClick={() => {
                    setShowEnrollmentModal(false);
                    setSelectedCohort(null);
                  }}
                  variant="outline"
                  className="flex-1"
                  disabled={isEnrolling}
                >
                  취소
                </Button>
                <Button
                  onClick={handleEnrollConfirm}
                  className={cn(
                    "flex-1",
                    selectedCohort.capacity - selectedCohort.enrolled > 0 
                      ? "btn-primary" 
                      : "bg-orange-500 hover:bg-orange-600 text-white font-semibold"
                  )}
                  disabled={isEnrolling}
                >
                  {isEnrolling ? (
                    <div className="flex items-center justify-center space-x-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>처리중...</span>
                    </div>
                  ) : selectedCohort.capacity - selectedCohort.enrolled > 0 ? (
                    "바로 등록"
                  ) : (
                    "대기 신청"
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CourseDetailPage;