import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/utils/cn';
import ApperIcon from '@/components/ApperIcon';
import CourseCard from '@/components/molecules/CourseCard';
import ProductCard from '@/components/molecules/ProductCard';
import Loading from '@/components/ui/Loading';

const RecommendationCarousel = ({ 
  title, 
  items = [], 
  isLoading = false, 
  error = null, 
  itemType = 'course', // 'course' or 'product'
  className = '',
  showNavigation = true,
  itemsPerView = { mobile: 1, tablet: 2, desktop: 3 }
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const carouselRef = useRef(null);
  const [itemsToShow, setItemsToShow] = useState(itemsPerView.desktop);

  // Update items to show based on screen size
  useEffect(() => {
    const updateItemsToShow = () => {
      if (window.innerWidth < 768) {
        setItemsToShow(itemsPerView.mobile);
      } else if (window.innerWidth < 1024) {
        setItemsToShow(itemsPerView.tablet);
      } else {
        setItemsToShow(itemsPerView.desktop);
      }
    };

    updateItemsToShow();
    window.addEventListener('resize', updateItemsToShow);
    return () => window.removeEventListener('resize', updateItemsToShow);
  }, [itemsPerView]);

  const maxIndex = Math.max(0, items.length - itemsToShow);

  const nextSlide = () => {
    setCurrentIndex(prev => Math.min(prev + 1, maxIndex));
  };

  const prevSlide = () => {
    setCurrentIndex(prev => Math.max(prev - 1, 0));
  };

  // Touch/Mouse drag handling
  const handleMouseDown = (e) => {
    setIsDragging(true);
    setStartX(e.pageX - carouselRef.current.offsetLeft);
    setScrollLeft(carouselRef.current.scrollLeft);
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - carouselRef.current.offsetLeft;
    const walk = (x - startX) * 2;
    carouselRef.current.scrollLeft = scrollLeft - walk;
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleTouchStart = (e) => {
    setIsDragging(true);
    setStartX(e.touches[0].pageX - carouselRef.current.offsetLeft);
    setScrollLeft(carouselRef.current.scrollLeft);
  };

  const handleTouchMove = (e) => {
    if (!isDragging) return;
    const x = e.touches[0].pageX - carouselRef.current.offsetLeft;
    const walk = (x - startX) * 2;
    carouselRef.current.scrollLeft = scrollLeft - walk;
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  if (error) {
    return (
      <section className={cn("py-8", className)}>
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">{title}</h2>
          <div className="text-center py-8">
            <ApperIcon name="AlertCircle" size={48} className="text-red-500 mx-auto mb-4" />
            <p className="text-gray-600">추천 항목을 불러오는데 실패했습니다.</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className={cn("py-8", className)}>
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
          {showNavigation && items.length > itemsToShow && (
            <div className="flex space-x-2">
              <button
                onClick={prevSlide}
                disabled={currentIndex === 0}
                className={cn(
                  "p-2 rounded-full border transition-all duration-200",
                  currentIndex === 0
                    ? "border-gray-200 text-gray-400 cursor-not-allowed"
                    : "border-gray-300 text-gray-600 hover:border-primary-500 hover:text-primary-600 hover:bg-primary-50"
                )}
              >
                <ApperIcon name="ChevronLeft" size={20} />
              </button>
              <button
                onClick={nextSlide}
                disabled={currentIndex >= maxIndex}
                className={cn(
                  "p-2 rounded-full border transition-all duration-200",
                  currentIndex >= maxIndex
                    ? "border-gray-200 text-gray-400 cursor-not-allowed"
                    : "border-gray-300 text-gray-600 hover:border-primary-500 hover:text-primary-600 hover:bg-primary-50"
                )}
              >
                <ApperIcon name="ChevronRight" size={20} />
              </button>
            </div>
          )}
        </div>

        {/* Content */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: itemsToShow }).map((_, index) => (
              <div key={index} className="card-elevated p-6">
                <div className="animate-pulse">
                  <div className="bg-gray-200 aspect-video rounded-lg mb-4"></div>
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-12">
            <ApperIcon name="Search" size={48} className="text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">추천할 항목이 없습니다.</p>
          </div>
        ) : (
          <div className="relative overflow-hidden">
            <motion.div
              ref={carouselRef}
              className={cn(
                "flex transition-transform duration-300 ease-out cursor-grab",
                isDragging && "cursor-grabbing"
              )}
              style={{
                transform: `translateX(-${currentIndex * (100 / itemsToShow)}%)`
              }}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
            >
              {items.map((item, index) => (
                <div
                  key={item.Id}
                  className={cn(
                    "flex-shrink-0 px-3",
                    `w-full md:w-1/2 lg:w-1/${itemsToShow}`
                  )}
                  style={{ width: `${100 / itemsToShow}%` }}
                >
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                  >
                    {itemType === 'course' ? (
                      <CourseCard course={item} />
                    ) : (
                      <ProductCard product={item} />
                    )}
                  </motion.div>
                </div>
              ))}
            </motion.div>

            {/* Dots indicator */}
            {items.length > itemsToShow && (
              <div className="flex justify-center mt-6 space-x-2">
                {Array.from({ length: maxIndex + 1 }).map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentIndex(index)}
                    className={cn(
                      "w-2 h-2 rounded-full transition-all duration-200",
                      currentIndex === index
                        ? "bg-primary-600 w-8"
                        : "bg-gray-300 hover:bg-gray-400"
                    )}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default RecommendationCarousel;