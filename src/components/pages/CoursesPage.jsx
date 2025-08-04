import React, { useState } from "react";
import { motion } from "framer-motion";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import CourseGrid from "@/components/organisms/CourseGrid";
import ApperIcon from "@/components/ApperIcon";
import CourseFormDrawer from "@/components/organisms/CourseFormDrawer";
const CoursesPage = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  const user = useSelector(state => state.auth.user);
  
  const handleOpenDrawer = (course = null) => {
    setEditingCourse(course);
    setIsDrawerOpen(true);
  };
  
  const handleCloseDrawer = () => {
    setIsDrawerOpen(false);
    setEditingCourse(null);
  };
  
  const handleCourseCreated = () => {
    handleCloseDrawer();
    toast.success('강의가 성공적으로 등록되었습니다.');
  };
  
  const handleCourseUpdated = () => {
    handleCloseDrawer();
    toast.success('강의가 성공적으로 수정되었습니다.');
  };

  // Check if user has permission to add courses
  const canManageCourses = user && (user.role === 'admin' || user.role === 'instructor');

  return (
    <div className="min-h-screen bg-stone-50">
      {/* Page Header */}
<section className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
          <motion.div
            className="text-center space-y-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 korean-text">
              온라인 <span className="text-gradient">강의</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto korean-text">
              전문가들이 제작한 고품질 강의로 새로운 기술을 배우고 성장하세요.
              원하는 분야의 강의를 찾아 지금 바로 시작해보세요.
            </p>
            
            {/* Quick Stats */}
            <div className="flex flex-wrap justify-center items-center space-x-8 space-y-2 sm:space-y-0 text-gray-500 pt-6">
              <div className="flex items-center space-x-2">
                <ApperIcon name="BookOpen" size={20} />
                <span className="font-medium">200+ 강의</span>
              </div>
              <div className="flex items-center space-x-2">
                <ApperIcon name="Users" size={20} />
                <span className="font-medium">10,000+ 수강생</span>
              </div>
              <div className="flex items-center space-x-2">
                <ApperIcon name="Star" size={20} className="text-yellow-400 fill-current" />
                <span className="font-medium">4.8 평균 평점</span>
              </div>
              <div className="flex items-center space-x-2">
                <ApperIcon name="Clock" size={20} />
                <span className="font-medium">평생 수강</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Course Grid Section */}
<section className="py-8 md:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <CourseGrid showFilters={true} />
          </motion.div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="bg-hero-gradient rounded-2xl p-8 lg:p-12 text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <div className="max-w-2xl mx-auto space-y-6">
              <h2 className="text-3xl font-bold text-white korean-text">
                새로운 강의 소식을 받아보세요
              </h2>
              <p className="text-xl text-white/90 korean-text">
                매주 새로운 강의와 특별 할인 정보를 이메일로 받아보세요.
              </p>
              <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4 max-w-md mx-auto">
                <input
                  type="email"
                  placeholder="이메일 주소를 입력하세요"
                  className="w-full px-4 py-3 rounded-lg border-0 focus:outline-none focus:ring-2 focus:ring-white/50 text-gray-900"
                />
<button className="w-full sm:w-auto bg-white text-primary-800 font-semibold px-6 py-3 rounded-lg hover:bg-gray-50 transition-colors duration-200 whitespace-nowrap touch-manipulation min-h-[44px]">
                  구독하기
                </button>
              </div>
              <p className="text-sm text-white/70">
                언제든지 구독을 취소할 수 있습니다. 개인정보는 안전하게 보호됩니다.
              </p>
            </div>
          </motion.div>
        </div>
</section>

      {/* Floating Action Button */}
      {canManageCourses && (
        <button
          onClick={() => handleOpenDrawer()}
          className="fixed bottom-6 right-6 z-40 bg-primary-800 hover:bg-primary-700 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 group"
          title="강의 등록"
        >
          <ApperIcon name="Plus" size={24} className="group-hover:rotate-90 transition-transform duration-300" />
        </button>
      )}

      {/* Course Form Drawer */}
      <CourseFormDrawer
        isOpen={isDrawerOpen}
        onClose={handleCloseDrawer}
        editingCourse={editingCourse}
        onCourseCreated={handleCourseCreated}
        onCourseUpdated={handleCourseUpdated}
      />
    </div>
  );
};

export default CoursesPage;