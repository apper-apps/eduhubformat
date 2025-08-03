import React, { useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
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
const [slidesPerView, setSlidesPerView] = useState(itemsPerView.desktop);

  // Update items to show based on screen size
const getSlidesPerView = () => {
    if (typeof window === 'undefined') return itemsPerView.desktop;
    return window.innerWidth >= 1024 ? itemsPerView.desktop : 
           window.innerWidth >= 768 ? itemsPerView.tablet : itemsPerView.mobile;
  };

  useEffect(() => {
    const updateSlidesPerView = () => {
      setSlidesPerView(getSlidesPerView());
    };

    updateSlidesPerView();
    window.addEventListener('resize', updateSlidesPerView);
    return () => window.removeEventListener('resize', updateSlidesPerView);
  }, [itemsPerView]);

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
        </div>

        {/* Content */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: slidesPerView }).map((_, index) => (
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
          <div className="related-section">
            <Swiper
              className="related-slider"
              modules={[Navigation, Pagination]}
              slidesPerView={getSlidesPerView()}
              spaceBetween={24}
              navigation={{
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev',
              }}
              pagination={{
                el: '.swiper-pagination',
                clickable: true,
              }}
              loop={false}
              watchOverflow={true}
              breakpoints={{
                320: {
                  slidesPerView: itemsPerView.mobile,
                  spaceBetween: 16,
                },
                768: {
                  slidesPerView: itemsPerView.tablet,
                  spaceBetween: 20,
                },
                1024: {
                  slidesPerView: itemsPerView.desktop,
                  spaceBetween: 24,
                },
              }}
            >
              {items.map((item) => (
                <SwiperSlide key={item.Id}>
                  {itemType === 'course' ? (
                    <CourseCard course={item} />
                  ) : (
                    <ProductCard product={item} />
                  )}
                </SwiperSlide>
              ))}
              
              {showNavigation && items.length > slidesPerView && (
                <>
                  <div className="swiper-button-prev !w-10 !h-10 !mt-0 !top-1/2 !-translate-y-1/2 !left-2 !bg-white !rounded-full !shadow-lg after:!text-sm after:!font-bold after:!text-gray-600 hover:!bg-primary-50 hover:after:!text-primary-600"></div>
                  <div className="swiper-button-next !w-10 !h-10 !mt-0 !top-1/2 !-translate-y-1/2 !right-2 !bg-white !rounded-full !shadow-lg after:!text-sm after:!font-bold after:!text-gray-600 hover:!bg-primary-50 hover:after:!text-primary-600"></div>
                </>
              )}
              
              {items.length > slidesPerView && (
                <div className="swiper-pagination !bottom-0 !relative !mt-6 [&_.swiper-pagination-bullet]:!w-2 [&_.swiper-pagination-bullet]:!h-2 [&_.swiper-pagination-bullet]:!bg-gray-300 [&_.swiper-pagination-bullet-active]:!bg-primary-600 [&_.swiper-pagination-bullet-active]:!w-8"></div>
              )}
            </Swiper>
          </div>
        )}
      </div>
    </section>
  );
};

export default RecommendationCarousel;