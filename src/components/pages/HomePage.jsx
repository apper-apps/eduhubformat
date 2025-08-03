import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { getRecommendedCourses } from "@/services/api/recommendationService";
import RecommendationCarousel from "@/components/organisms/RecommendationCarousel";
import ApperIcon from "@/components/ApperIcon";
import CourseGrid from "@/components/organisms/CourseGrid";
import HeroSection from "@/components/organisms/HeroSection";
import Button from "@/components/atoms/Button";
const HomePage = () => {
  const [recommendedCourses, setRecommendedCourses] = useState([]);
  const [recommendationsLoading, setRecommendationsLoading] = useState(true);

  useEffect(() => {
    const loadRecommendations = async () => {
      try {
        setRecommendationsLoading(true);
        const coursesData = await getRecommendedCourses();
        setRecommendedCourses(coursesData);
      } catch (err) {
        console.error('Failed to load recommended courses:', err);
      } finally {
        setRecommendationsLoading(false);
      }
    };

    loadRecommendations();
  }, []);

  const features = [
    {
      icon: "BookOpen",
      title: "전문가 강의",
      description: "업계 최고 전문가들이 직접 제작한 고품질 강의를 만나보세요.",
    },
    {
      icon: "Users",
      title: "실시간 멘토링",
      description: "강사와 동료 학습자들과의 실시간 소통으로 더 깊이 있는 학습을 경험하세요.",
    },
    {
      icon: "Award",
      title: "수료증 발급",
      description: "과정 완료 시 공식 수료증을 발급받아 경력 발전에 활용하세요.",
    },
    {
      icon: "Clock",
      title: "평생 수강",
      description: "한 번 구매하면 평생 언제든지 강의를 다시 들을 수 있습니다.",
    },
  ];

  const stats = [
    { number: "10,000+", label: "수강생" },
    { number: "200+", label: "전문 강의" },
    { number: "50+", label: "전문 강사" },
    { number: "98%", label: "만족도" },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <HeroSection />

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4 korean-text">
              왜 <span className="text-gradient">EduHub Pro</span>를 선택해야 할까요?
            </h2>
            <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto korean-text">
              최고의 학습 경험을 제공하기 위해 끊임없이 노력하고 있습니다.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                className="card-elevated p-8 text-center group"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="relative mx-auto w-16 h-16 mb-6">
                  <div className="absolute inset-0 bg-hero-gradient rounded-2xl blur-sm opacity-75 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="relative bg-hero-gradient p-4 rounded-2xl">
                    <ApperIcon name={feature.icon} size={32} className="text-white" />
                  </div>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3 korean-text">
                  {feature.title}
</h3>
                <p className="text-gray-600 korean-text leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Recommended Courses Section */}
      <RecommendationCarousel
        title="추천 강의"
        items={recommendedCourses}
        isLoading={recommendationsLoading}
        itemType="course"
        className="bg-white"
        itemsPerView={{ mobile: 1, tablet: 2, desktop: 3 }}
      />

      {/* Stats Section */}
      <section className="py-20 bg-stone-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4 korean-text">
              숫자로 보는 <span className="text-gradient">EduHub Pro</span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                className="text-center"
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="text-4xl sm:text-5xl font-bold text-gradient mb-2">
                  {stat.number}
                </div>
                <div className="text-lg text-gray-600 korean-text">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Courses Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4 korean-text">
              인기 강의 <span className="text-gradient">둘러보기</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto korean-text">
              가장 많은 수강생들이 선택한 인기 강의들을 만나보세요.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <CourseGrid limit={6} showFilters={false} />
          </motion.div>

          <motion.div 
            className="text-center mt-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
          >
<Button variant="gradient" size="large" className="touch-manipulation min-h-[48px]">
              <ApperIcon name="ArrowRight" size={20} className="mr-2" />
              모든 강의 보기
            </Button>
          </motion.div>
        </div>
      </section>

{/* CTA Section */}
      <section className="py-20 bg-hero-gradient relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.05%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%222%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-30"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            className="max-w-4xl mx-auto space-y-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight korean-text">
              지금 시작하여 새로운 기술을
              <br />
              마스터해보세요
            </h2>
            <p className="text-xl text-white/90 korean-text">
              7일 무료 체험으로 모든 강의를 자유롭게 경험해보세요.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
              <Button
                variant="secondary"
                size="large"
                className="w-full sm:w-auto bg-white text-primary-800 hover:bg-gray-50 shadow-xl"
              >
                <ApperIcon name="Play" size={20} className="mr-2" />
                무료 체험 시작
              </Button>
              <Button
                variant="outline"
                size="large"
                className="w-full sm:w-auto border-white text-white hover:bg-white hover:text-primary-800 backdrop-blur-sm"
              >
                <ApperIcon name="MessageCircle" size={20} className="mr-2" />
                상담 받기
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;