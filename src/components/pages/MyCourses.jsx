import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import CourseCard from '@/components/molecules/CourseCard';
import Loading from '@/components/ui/Loading';
import Error from '@/components/ui/Error';
import Empty from '@/components/ui/Empty';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import { cn } from '@/utils/cn';

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
  }
];

// Local mock purchases data - only 3 items matching first 3 courses
const mockPurchases = [
  {
    Id: 1,
    userId: 1,
    courseId: 1,
    purchaseDate: '2024-03-01T10:00:00Z',
    price: 299000,
    status: 'completed',
    progress: 75,
    lastAccessedAt: '2024-12-28T14:30:00Z',
    completedLessons: 12,
    totalLessons: 16,
    certificateEarned: false
  },
  {
    Id: 2,
    userId: 1,
    courseId: 2,
    purchaseDate: '2024-03-02T11:00:00Z',
    price: 249000,
    status: 'completed',
    progress: 45,
    lastAccessedAt: '2024-12-27T09:15:00Z',
    completedLessons: 9,
    totalLessons: 20,
    certificateEarned: false
  },
  {
    Id: 3,
    userId: 1,
    courseId: 5,
    purchaseDate: '2024-02-15T16:20:00Z',
    price: 279000,
    status: 'completed',
    progress: 100,
    lastAccessedAt: '2024-04-10T18:45:00Z',
    completedLessons: 18,
    totalLessons: 18,
    certificateEarned: true
  }
];

const MyCourses = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useSelector(state => state.auth);
  const [courses, setCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all'); // all, in-progress, completed

  // Auth guard - redirect to login if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      toast.info('로그인이 필요한 페이지입니다.');
      navigate('/login');
      return;
    }
  }, [isAuthenticated, navigate]);

  // Load user's purchased courses
  useEffect(() => {
    if (!isAuthenticated || !user) return;

    const loadMyCourses = async () => {
try {
        setIsLoading(true);
        setError(null);

        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 300));

        // Use local mock data instead of API calls
        const purchases = mockPurchases.filter(purchase => purchase.userId === (user.id || 1));
        
        // Map purchases to courses with local mock data
        const validCourses = purchases.map(purchase => {
          const course = mockCourses.find(c => c.Id === purchase.courseId);
          if (course) {
            return {
              ...course,
              purchaseId: purchase.Id,
              progress: purchase.progress,
              lastAccessedAt: purchase.lastAccessedAt,
              completedLessons: purchase.completedLessons,
              totalLessons: purchase.totalLessons,
              certificateEarned: purchase.certificateEarned,
              purchaseDate: purchase.purchaseDate
            };
          }
          return null;
        }).filter(course => course !== null);
        
        setCourses(validCourses);
      } catch (err) {
        console.error('Failed to load my courses:', err);
        setError('강의 목록을 불러오는데 실패했습니다.');
        toast.error('강의 목록을 불러오는데 실패했습니다.');
      } finally {
        setIsLoading(false);
      }
    };

    loadMyCourses();
  }, [isAuthenticated, user]);
  // Filter courses based on selected filter
  const filteredCourses = courses.filter(course => {
    switch (filter) {
      case 'in-progress':
        return course.progress > 0 && course.progress < 100;
      case 'completed':
        return course.progress >= 100;
      default:
        return true;
    }
  });

  const handleCourseClick = (course) => {
    // Navigate to course detail with owned=true parameter
    navigate(`/courses/${course.Id}?owned=true`);
  };

  const getProgressStatus = (progress) => {
    if (progress >= 100) return { text: '완료', color: 'text-green-600' };
    if (progress > 0) return { text: '진행중', color: 'text-blue-600' };
    return { text: '시작 전', color: 'text-gray-500' };
  };

  // Don't render anything if not authenticated (will redirect)
  if (!isAuthenticated) {
    return null;
  }

  if (isLoading) {
    return <Loading message="내 강의를 불러오는 중..." />;
  }

  if (error) {
    return (
      <Error 
        message={error}
        onRetry={() => window.location.reload()}
      />
    );
  }

  return (
    <div className="min-h-screen bg-stone-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <ApperIcon name="BookOpen" size={32} className="text-primary-800" />
            <h1 className="text-3xl font-bold text-gray-900">내 강의</h1>
          </div>
          <p className="text-lg text-gray-600">
            구매한 강의를 확인하고 학습을 계속하세요.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-card p-6">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-primary-100 rounded-full">
                <ApperIcon name="BookOpen" size={24} className="text-primary-800" />
              </div>
              <div>
                <p className="text-sm text-gray-600">총 강의 수</p>
                <p className="text-2xl font-bold text-gray-900">{courses.length}개</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-card p-6">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-blue-100 rounded-full">
                <ApperIcon name="Play" size={24} className="text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">진행중인 강의</p>
                <p className="text-2xl font-bold text-gray-900">
                  {courses.filter(c => c.progress > 0 && c.progress < 100).length}개
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-card p-6">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-green-100 rounded-full">
                <ApperIcon name="CheckCircle" size={24} className="text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">완료한 강의</p>
                <p className="text-2xl font-bold text-gray-900">
                  {courses.filter(c => c.progress >= 100).length}개
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="bg-white rounded-xl shadow-card p-6 mb-8">
          <div className="flex flex-wrap gap-2">
            {[
              { key: 'all', label: '전체', count: courses.length },
              { key: 'in-progress', label: '진행중', count: courses.filter(c => c.progress > 0 && c.progress < 100).length },
              { key: 'completed', label: '완료', count: courses.filter(c => c.progress >= 100).length }
            ].map(({ key, label, count }) => (
              <Button
                key={key}
                variant={filter === key ? 'default' : 'ghost'}
                onClick={() => setFilter(key)}
                className={cn(
                  "min-h-[44px] px-6 py-3 rounded-lg transition-all duration-200",
                  filter === key 
                    ? "bg-primary-800 text-white" 
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                )}
              >
                {label} ({count})
              </Button>
            ))}
          </div>
        </div>

        {/* Course Grid */}
        {filteredCourses.length === 0 ? (
          <Empty 
            title={
              filter === 'all' 
                ? "구매한 강의가 없습니다" 
                : filter === 'in-progress'
                ? "진행중인 강의가 없습니다"
                : "완료한 강의가 없습니다"
            }
            description={
              filter === 'all'
                ? "강의를 구매하고 학습을 시작해보세요."
                : filter === 'in-progress'
                ? "새로운 강의를 시작하거나 기존 강의를 계속 학습해보세요."
                : "강의를 완료하면 여기에 표시됩니다."
            }
            action={
              filter === 'all' && (
                <Button 
                  onClick={() => navigate('/courses')}
                  className="btn-primary"
                >
                  강의 둘러보기
                </Button>
              )
            }
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredCourses.map((course) => {
              const progressStatus = getProgressStatus(course.progress);
              
              return (
                <div 
                  key={course.Id}
                  className="group cursor-pointer transform transition-all duration-300 hover:scale-105"
                  onClick={() => handleCourseClick(course)}
                >
                  <CourseCard
                    course={course}
                    progress={course.progress}
                    showProgress={true}
                    className="h-full hover:shadow-card-hover"
                  />
                  
                  {/* Additional course info */}
                  <div className="mt-4 px-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className={cn("font-medium", progressStatus.color)}>
                        {progressStatus.text}
                      </span>
                      <span className="text-gray-500">
                        {course.completedLessons}/{course.totalLessons} 강의
                      </span>
                    </div>
                    
                    {course.lastAccessedAt && (
                      <p className="text-xs text-gray-400 mt-1">
                        최근 학습: {new Date(course.lastAccessedAt).toLocaleDateString('ko-KR')}
                      </p>
                    )}
                    
                    {course.certificateEarned && (
                      <div className="flex items-center space-x-1 mt-2">
                        <ApperIcon name="Award" size={14} className="text-yellow-500" />
                        <span className="text-xs text-yellow-600 font-medium">수료증 획득</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Continue Learning CTA */}
        {courses.length > 0 && filteredCourses.length > 0 && (
          <div className="mt-12 bg-gradient-to-r from-primary-800 to-accent-500 rounded-xl p-8 text-center text-white">
            <h3 className="text-2xl font-bold mb-4">학습을 계속하세요!</h3>
            <p className="text-lg mb-6 opacity-90">
              꾸준한 학습으로 목표를 달성해보세요.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                onClick={() => navigate('/courses')}
                className="bg-white text-primary-800 hover:bg-gray-100 font-semibold px-8 py-3"
              >
                새로운 강의 찾기
              </Button>
              {courses.filter(c => c.progress > 0 && c.progress < 100).length > 0 && (
                <Button 
                  onClick={() => {
                    const inProgressCourse = courses.find(c => c.progress > 0 && c.progress < 100);
                    if (inProgressCourse) {
                      handleCourseClick(inProgressCourse);
                    }
                  }}
                  variant="outline"
                  className="border-white text-white hover:bg-white hover:text-primary-800 font-semibold px-8 py-3"
                >
                  진행중인 강의 계속하기
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyCourses;