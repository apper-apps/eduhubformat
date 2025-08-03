import React from "react";
import { motion } from "framer-motion";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";

const StorePage = () => {
  const comingSoonFeatures = [
    {
      icon: "ShoppingBag",
      title: "전자책 & 강의 자료",
      description: "강의와 함께 볼 수 있는 전문 서적과 실습 자료를 만나보세요.",
    },
    {
      icon: "Headphones",
      title: "오디오북 컬렉션",
      description: "이동 중에도 학습할 수 있는 고품질 오디오북 라이브러리입니다.",
    },
    {
      icon: "Monitor",
      title: "소프트웨어 & 도구",
      description: "학습에 필요한 전문 소프트웨어와 개발 도구를 특가로 제공합니다.",
    },
    {
      icon: "Award",
      title: "자격증 준비 키트",
      description: "각종 자격증 시험 준비를 위한 완벽한 학습 패키지입니다.",
    },
  ];

  return (
    <div className="min-h-screen bg-stone-50">
      {/* Page Header */}
      <section className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <motion.div
            className="text-center space-y-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 korean-text">
              EduHub <span className="text-gradient">스토어</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto korean-text">
              학습에 필요한 모든 것을 한 곳에서 만나보세요.
              전자책, 소프트웨어, 학습 도구까지 특별한 가격으로 제공합니다.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Coming Soon Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="inline-flex items-center space-x-2 bg-primary-50 rounded-full px-6 py-3 mb-6">
              <ApperIcon name="Clock" size={20} className="text-primary-600" />
              <span className="text-primary-800 font-semibold">곧 출시 예정</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4 korean-text">
              더 나은 학습 경험을 위한 <br />
              <span className="text-gradient">스토어</span>를 준비 중입니다
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto korean-text">
              학습자 여러분의 성공을 돕기 위해 엄선된 제품들을 준비하고 있습니다.
            </p>
          </motion.div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            {comingSoonFeatures.map((feature, index) => (
              <motion.div
                key={feature.title}
                className="card-elevated p-8 group"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 + index * 0.1 }}
              >
                <div className="flex items-start space-x-6">
                  <div className="relative flex-shrink-0">
                    <div className="absolute inset-0 bg-hero-gradient rounded-2xl blur-sm opacity-75 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div className="relative bg-hero-gradient p-4 rounded-2xl">
                      <ApperIcon name={feature.icon} size={32} className="text-white" />
                    </div>
                  </div>
                  <div className="space-y-3">
                    <h3 className="text-xl font-bold text-gray-900 korean-text">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 korean-text leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* CTA Section */}
          <motion.div
            className="bg-hero-gradient rounded-2xl p-8 lg:p-12 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
          >
            <div className="max-w-2xl mx-auto space-y-6">
              <h2 className="text-3xl font-bold text-white korean-text">
                출시 알림을 받아보세요
              </h2>
              <p className="text-xl text-white/90 korean-text">
                스토어 오픈 소식과 특별 할인 혜택을 가장 먼저 받아보세요.
              </p>
              <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4 max-w-md mx-auto">
                <input
                  type="email"
                  placeholder="이메일 주소를 입력하세요"
                  className="w-full px-4 py-3 rounded-lg border-0 focus:outline-none focus:ring-2 focus:ring-white/50 text-gray-900"
                />
                <button className="w-full sm:w-auto bg-white text-primary-800 font-semibold px-6 py-3 rounded-lg hover:bg-gray-50 transition-colors duration-200 whitespace-nowrap">
                  알림 신청
                </button>
              </div>
              <p className="text-sm text-white/70">
                스팸 메일은 절대 보내지 않습니다. 언제든지 구독을 취소할 수 있습니다.
              </p>
            </div>
          </motion.div>

          {/* Back to Courses */}
          <motion.div
            className="text-center mt-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.0 }}
          >
            <p className="text-gray-600 mb-6 korean-text">
              지금은 다양한 온라인 강의를 둘러보세요
            </p>
            <Button variant="outline" size="large">
              <ApperIcon name="ArrowLeft" size={20} className="mr-2" />
              강의 둘러보기
            </Button>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default StorePage;