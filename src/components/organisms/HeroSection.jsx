import React from "react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/utils/cn";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";

const HeroSection = ({ className }) => {
  const navigate = useNavigate();

  const handleExploreClick = () => {
    navigate("/courses");
  };

  return (
    <section className={cn(
      "relative overflow-hidden bg-hero-gradient py-20 lg:py-28",
      className
    )}>
{/* Background Pattern */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=\"60\" height=\"60\" viewBox=\"0 0 60 60\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cg fill=\"none\" fill-rule=\"evenodd\"%3E%3Cg fill=\"%23ffffff\" fill-opacity=\"0.05\"%3E%3Ccircle cx=\"30\" cy=\"30\" r=\"2\"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-30"></div>
      {/* Floating Elements */}
      <div className="absolute top-20 left-10 w-20 h-20 bg-white/10 rounded-full animate-pulse hidden lg:block"></div>
      <div className="absolute bottom-20 right-10 w-16 h-16 bg-white/10 rounded-full animate-pulse delay-300 hidden lg:block"></div>
      <div className="absolute top-40 right-20 w-12 h-12 bg-white/10 rounded-full animate-pulse delay-500 hidden lg:block"></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
          {/* Badge */}
          <div className="inline-flex items-center space-x-2 bg-white/20 backdrop-blur-sm rounded-full px-6 py-2 text-white text-sm font-medium">
            <ApperIcon name="Sparkles" size={16} />
            <span>새로운 온라인 학습 경험</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight korean-text">
            <span className="block">당신의 꿈을 실현하는</span>
            <span className="block bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
              온라인 강의 플랫폼
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-xl sm:text-2xl text-white/90 max-w-3xl mx-auto leading-relaxed korean-text">
            전문가들이 직접 제작한 고품질 강의와 실무 중심의 커리큘럼으로
            <br className="hidden sm:block" />
            새로운 기술을 배우고 커리어를 발전시키세요.
          </p>

          {/* Stats */}
          <div className="flex flex-wrap justify-center items-center space-x-8 space-y-4 sm:space-y-0 text-white/90">
            <div className="flex items-center space-x-2">
              <ApperIcon name="Users" size={20} />
              <span className="text-lg font-semibold">10,000+ 수강생</span>
            </div>
            <div className="flex items-center space-x-2">
              <ApperIcon name="BookOpen" size={20} />
              <span className="text-lg font-semibold">200+ 강의</span>
            </div>
            <div className="flex items-center space-x-2">
              <ApperIcon name="Award" size={20} />
              <span className="text-lg font-semibold">98% 만족도</span>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6 pt-8">
            <Button
              variant="secondary"
              size="large"
              onClick={handleExploreClick}
              className="w-full sm:w-auto bg-white text-primary-800 hover:bg-gray-50 shadow-xl"
            >
              <ApperIcon name="Search" size={20} className="mr-2" />
              강의 둘러보기
            </Button>
            <Button
              variant="outline"
              size="large"
              className="w-full sm:w-auto border-white text-white hover:bg-white hover:text-primary-800 backdrop-blur-sm"
            >
              <ApperIcon name="Play" size={20} className="mr-2" />
              무료 체험하기
            </Button>
          </div>

          {/* Trust Indicators */}
          <div className="pt-12 text-white/70">
            <p className="text-sm mb-4">신뢰할 수 있는 파트너들</p>
            <div className="flex flex-wrap justify-center items-center space-x-8 opacity-60">
              <div className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2 text-sm font-medium">Google</div>
              <div className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2 text-sm font-medium">Microsoft</div>
              <div className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2 text-sm font-medium">Amazon</div>
              <div className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2 text-sm font-medium">Netflix</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;