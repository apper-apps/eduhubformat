import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { cn } from '@/utils/cn';
import { getEnrollmentsByUserId } from '@/services/api/enrollmentService';
import { getOrdersByUserId, formatPrice, getStatusText, getStatusColor } from '@/services/api/orderService';
import { getCourseById } from '@/services/api/courseService';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import Badge from '@/components/atoms/Badge';
import Loading from '@/components/ui/Loading';
import Error from '@/components/ui/Error';
import Empty from '@/components/ui/Empty';

const MemberDashboard = () => {
  const [enrollments, setEnrollments] = useState([]);
  const [orders, setOrders] = useState([]);
  const [coursesData, setCoursesData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('courses');

  // Mock user ID - in a real app, this would come from authentication
  const userId = 1;

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch enrollments and orders in parallel
        const [enrollmentsData, ordersData] = await Promise.all([
          getEnrollmentsByUserId(userId),
          getOrdersByUserId(userId)
        ]);

        setEnrollments(enrollmentsData);
        setOrders(ordersData);

        // Fetch course details for enrollments
        const courseIds = [...new Set(enrollmentsData.map(e => e.courseId))];
        const coursePromises = courseIds.map(id => getCourseById(id));
        const courses = await Promise.all(coursePromises);
        
        const coursesMap = {};
        courses.forEach(course => {
          coursesMap[course.Id] = course;
        });
        setCoursesData(coursesMap);

      } catch (err) {
        console.error('Dashboard data fetch error:', err);
        setError('대시보드 정보를 불러오는 중 오류가 발생했습니다.');
        toast.error('대시보드 정보를 불러오는 중 오류가 발생했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [userId]);

  const getProgressColor = (progress) => {
    if (progress >= 100) return 'bg-green-500';
    if (progress >= 70) return 'bg-blue-500';
    if (progress >= 40) return 'bg-yellow-500';
    return 'bg-gray-400';
  };

  const getStatusBadgeVariant = (status) => {
    const variants = {
      'enrolled': 'success',
      'completed': 'info',
      'waitlist': 'warning'
    };
    return variants[status] || 'default';
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleAccessCourse = (courseId) => {
    // In a real app, this would navigate to the course viewer
    toast.success('강의 페이지로 이동합니다.');
  };

  const handleDownloadMaterial = (material) => {
    // In a real app, this would trigger download
    toast.success(`${material.name} 다운로드를 시작합니다.`);
  };

  if (loading) return <Loading />;
  if (error) return <Error message={error} />;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">내 대시보드</h1>
          <p className="text-gray-600">강의 진도와 구매 내역을 확인하세요</p>
        </div>

        {/* Tab Navigation */}
        <div className="mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('courses')}
                className={cn(
                  'py-2 px-1 border-b-2 font-medium text-sm transition-colors',
                  activeTab === 'courses'
                    ? 'border-primary-800 text-primary-800'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                )}
              >
                <ApperIcon name="BookOpen" size={16} className="inline mr-2" />
                내 강의 ({enrollments.length})
              </button>
              <button
                onClick={() => setActiveTab('orders')}
                className={cn(
                  'py-2 px-1 border-b-2 font-medium text-sm transition-colors',
                  activeTab === 'orders'
                    ? 'border-primary-800 text-primary-800'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                )}
              >
                <ApperIcon name="ShoppingBag" size={16} className="inline mr-2" />
                주문내역 ({orders.length})
              </button>
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'courses' && (
          <div className="space-y-6">
            {enrollments.length === 0 ? (
              <Empty
                icon="BookOpen"
                title="수강 중인 강의가 없습니다"
                description="새로운 강의를 찾아보세요"
                actionLabel="강의 둘러보기"
                actionTo="/courses"
              />
            ) : (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {enrollments.map((enrollment) => {
                  const course = coursesData[enrollment.courseId];
                  if (!course) return null;

                  return (
                    <div key={enrollment.Id} className="bg-white rounded-lg shadow-card hover:shadow-card-hover transition-shadow">
                      <div className="aspect-video relative overflow-hidden rounded-t-lg">
                        <img 
                          src={course.coverImage} 
                          alt={course.title}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-3 right-3">
                          <Badge variant={getStatusBadgeVariant(enrollment.status)}>
                            {enrollment.status === 'enrolled' ? '수강중' : 
                             enrollment.status === 'completed' ? '완료' : '대기'}
                          </Badge>
                        </div>
                      </div>
                      
                      <div className="p-4">
                        <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                          {course.title}
                        </h3>
                        
                        <div className="mb-3">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-sm text-gray-600">진도율</span>
                            <span className="text-sm font-medium text-gray-900">
                              {enrollment.progress}%
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className={cn(
                                'h-2 rounded-full transition-all duration-300',
                                getProgressColor(enrollment.progress)
                              )}
                              style={{ width: `${enrollment.progress}%` }}
                            />
                          </div>
                          {enrollment.nextLessonTitle && enrollment.status !== 'completed' && (
                            <p className="text-xs text-gray-500 mt-1">
                              다음: {enrollment.nextLessonTitle}
                            </p>
                          )}
                        </div>

                        <div className="space-y-2 mb-4">
                          {enrollment.completedLessons !== undefined && (
                            <div className="flex items-center text-sm text-gray-600">
                              <ApperIcon name="CheckCircle" size={14} className="mr-1 text-green-500" />
                              {enrollment.completedLessons}/{enrollment.totalLessons} 강의 완료
                            </div>
                          )}
                          <div className="flex items-center text-sm text-gray-600">
                            <ApperIcon name="Clock" size={14} className="mr-1" />
                            마지막 접속: {formatDate(enrollment.lastAccessedAt)}
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Button 
                            className="w-full"
                            onClick={() => handleAccessCourse(course.Id)}
                          >
                            {enrollment.status === 'completed' ? '강의 다시보기' : '강의 계속하기'}
                          </Button>
                          
                          {/* Materials */}
                          {enrollment.materials && enrollment.materials.length > 0 && (
                            <div className="pt-2 border-t border-gray-100">
                              <h4 className="text-sm font-medium text-gray-700 mb-2">강의 자료</h4>
                              <div className="space-y-1">
                                {enrollment.materials.slice(0, 2).map((material, index) => (
                                  <button
                                    key={index}
                                    onClick={() => handleDownloadMaterial(material)}
                                    className="flex items-center text-sm text-primary-800 hover:text-primary-700 w-full text-left"
                                  >
                                    <ApperIcon 
                                      name={material.type === 'pdf' ? 'FileText' : 
                                            material.type === 'video' ? 'Play' : 'Download'} 
                                      size={14} 
                                      className="mr-1" 
                                    />
                                    {material.name}
                                  </button>
                                ))}
                                {enrollment.materials.length > 2 && (
                                  <p className="text-xs text-gray-500">
                                    +{enrollment.materials.length - 2}개 자료 더
                                  </p>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {activeTab === 'orders' && (
          <div className="space-y-6">
            {orders.length === 0 ? (
              <Empty
                icon="ShoppingBag"
                title="구매 내역이 없습니다"
                description="스토어에서 강의나 상품을 구매해보세요"
                actionLabel="스토어 둘러보기"
                actionTo="/store"
              />
            ) : (
              <div className="space-y-4">
                {orders.map((order) => (
                  <div key={order.Id} className="bg-white rounded-lg shadow-card p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900">
                            주문번호 #{order.Id.toString().padStart(6, '0')}
                          </h3>
                          <Badge className={getStatusColor(order.status)}>
                            {getStatusText(order.status)}
                          </Badge>
                        </div>
                        <div className="space-y-1 text-sm text-gray-600">
                          <p>주문일시: {formatDate(order.orderDate)}</p>
                          {order.paymentDate && (
                            <p>결제일시: {formatDate(order.paymentDate)}</p>
                          )}
                          <p>결제방법: {order.paymentMethod}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-gray-900">
                          {formatPrice(order.totalAmount)}
                        </p>
                      </div>
                    </div>

                    <div className="border-t border-gray-100 pt-4">
                      <h4 className="font-medium text-gray-900 mb-3">주문 상품</h4>
                      <div className="space-y-3">
                        {order.items.map((item, index) => (
                          <div key={index} className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <div className="w-2 h-2 bg-primary-800 rounded-full"></div>
                              <div>
                                <p className="font-medium text-gray-900">{item.title}</p>
                                <p className="text-sm text-gray-600">
                                  {item.type === 'course' ? '온라인 강의' : '상품'} × {item.quantity}
                                </p>
                              </div>
                            </div>
                            <p className="font-medium text-gray-900">
                              {formatPrice(item.price)}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {order.status === 'completed' && (
                      <div className="border-t border-gray-100 pt-4 mt-4">
                        <div className="flex flex-wrap gap-2">
                          <Button variant="outline" size="small">
                            <ApperIcon name="Download" size={14} className="mr-1" />
                            영수증 다운로드
                          </Button>
                          <Button variant="outline" size="small">
                            <ApperIcon name="MessageCircle" size={14} className="mr-1" />
                            문의하기
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MemberDashboard;