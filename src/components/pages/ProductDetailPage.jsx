import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import { checkSubscriptionStatus, subscribeToRestockNotification, unsubscribeFromRestockNotification } from "@/services/api/notificationService";
import { formatPrice } from "@/services/api/orderService";
import { getProductById } from "@/services/api/productService";
import { getFrequentlyBoughtTogether } from "@/services/api/recommendationService";
import ApperIcon from "@/components/ApperIcon";
import RecommendationCarousel from "@/components/organisms/RecommendationCarousel";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Badge from "@/components/atoms/Badge";
import Button from "@/components/atoms/Button";
import { addToCart } from "@/store/cartSlice";
import { cn } from "@/utils/cn";

// Product social sharing functions
const shareProductToFacebook = (product) => {
  const url = encodeURIComponent(window.location.href);
  const text = encodeURIComponent(`${product.name} - ${product.description}`);
  window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}&quote=${text}`, '_blank', 'width=600,height=400');
};

const shareProductToTwitter = (product) => {
  const url = encodeURIComponent(window.location.href);
  const text = encodeURIComponent(`${product.name} 추천! ${formatPrice(product.price)}원`);
  window.open(`https://twitter.com/intent/tweet?url=${url}&text=${text}`, '_blank', 'width=600,height=400');
};

const shareProductToKakao = (product) => {
  if (window.Kakao) {
    window.Kakao.Share.sendDefault({
      objectType: 'commerce',
      content: {
        title: product.name,
        imageUrl: product.images?.[0] || '/placeholder-product.jpg',
        link: {
          webUrl: window.location.href,
          mobileWebUrl: window.location.href,
        },
      },
      commerce: {
        regularPrice: product.price,
        currencyUnit: '원',
      },
    });
  } else {
    copyProductLink(product);
  }
};

const copyProductLink = async (product) => {
  try {
    await navigator.clipboard.writeText(window.location.href);
    toast.success('상품 링크가 클립보드에 복사되었습니다!');
  } catch (err) {
    const textArea = document.createElement('textarea');
    textArea.value = window.location.href;
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand('copy');
    document.body.removeChild(textArea);
toast.success('상품 링크가 클립보드에 복사되었습니다!');
  }
};

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
const [selectedImage, setSelectedImage] = useState(0);
  const [selectedVariants, setSelectedVariants] = useState({});
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [frequentlyBought, setFrequentlyBought] = useState([]);
  const [recommendationsLoading, setRecommendationsLoading] = useState(true);
// Notification states
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [customerEmail, setCustomerEmail] = useState('');
  const [showEmailInput, setShowEmailInput] = useState(false);
  const [notificationLoading, setNotificationLoading] = useState(false);

  useEffect(() => {
    loadProduct();
    loadRecommendations();
  }, [id]);

  const loadProduct = async () => {
    try {
      setLoading(true);
      setError(null);
      const productData = await getProductById(id);
      setProduct(productData);
      
      // Initialize selected variants
      if (productData.variants) {
        const initialVariants = {};
        if (productData.variants.colors) {
          initialVariants.color = productData.variants.colors[0];
        }
        if (productData.variants.sizes) {
          initialVariants.size = productData.variants.sizes[0];
        }
        if (productData.variants.switches) {
          initialVariants.switch = productData.variants.switches[0];
        }
        setSelectedVariants(initialVariants);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const loadRecommendations = async () => {
    try {
      setRecommendationsLoading(true);
      const frequentlyBoughtData = await getFrequentlyBoughtTogether(id);
      setFrequentlyBought(frequentlyBoughtData);
    } catch (err) {
      console.error('Failed to load recommendations:', err);
    } finally {
      setRecommendationsLoading(false);
    }
  };
const handleRestockNotification = async () => {
    if (!customerEmail) {
      setShowEmailInput(true);
      return;
    }

    setNotificationLoading(true);
    try {
      if (isSubscribed) {
        await unsubscribeFromRestockNotification(id, customerEmail);
        setIsSubscribed(false);
        toast.success('재입고 알림 신청이 취소되었습니다.');
      } else {
        await subscribeToRestockNotification(id, customerEmail);
        setIsSubscribed(true);
        toast.success('재입고 알림 신청이 완료되었습니다. 상품이 재입고되면 이메일로 알려드릴게요!');
      }
      setShowEmailInput(false);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setNotificationLoading(false);
    }
  };

  const checkNotificationStatus = async () => {
    if (!customerEmail) return;
    
    try {
      const { isSubscribed: subscribed } = await checkSubscriptionStatus(id, customerEmail);
      setIsSubscribed(subscribed);
    } catch (error) {
      console.error('Failed to check notification status:', error);
    }
  };

  // Check notification status when email changes
  useEffect(() => {
    if (customerEmail && customerEmail.includes('@')) {
      checkNotificationStatus();
    }
}, [customerEmail, id]);
  const getCategoryColor = (category) => {
    switch (category) {
      case '교재':
        return 'bg-blue-100 text-blue-800';
      case '굿즈':
        return 'bg-purple-100 text-purple-800';
      case '기타':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleVariantChange = (type, value) => {
    setSelectedVariants(prev => ({
      ...prev,
      [type]: value
    }));
  };

const handleAddToCart = () => {
    if (!product.isInStock) {
      toast.error('죄송합니다. 현재 품절된 상품입니다.');
      return;
    }

    dispatch(addToCart({
      productId: product.Id,
      name: product.name,
      price: product.price,
      quantity,
      variants: selectedVariants,
      image: product.images[0]
    }));
  };

  const handleBuyNow = () => {
    if (!product.isInStock) {
      toast.error('죄송합니다. 현재 품절된 상품입니다.');
      return;
    }

    const orderItem = {
      productId: product.Id,
      name: product.name,
      price: product.price,
      quantity,
      variants: selectedVariants,
      image: product.images[0]
    };

    // Here you would typically navigate to checkout
    toast.success('주문 페이지로 이동합니다.');
    // navigate('/checkout', { state: { items: [orderItem] } });
  };

  if (loading) return <Loading />;
  if (error) return <Error message={error} />;
  if (!product) return <Error message="상품을 찾을 수 없습니다." />;

  return (
    <div className="min-h-screen bg-stone-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex items-center space-x-2 text-sm">
            <Link to="/" className="text-gray-500 hover:text-primary-800">
              홈
            </Link>
            <ApperIcon name="ChevronRight" size={16} className="text-gray-400" />
            <Link to="/store" className="text-gray-500 hover:text-primary-800">
              스토어
            </Link>
            <ApperIcon name="ChevronRight" size={16} className="text-gray-400" />
            <span className="text-gray-900">{product.name}</span>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Product Images */}
<motion.div
            className="space-y-4"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Main Image with Touch Gestures */}
            <div 
              className="relative aspect-square overflow-hidden rounded-lg bg-gray-100 cursor-pointer"
              onTouchStart={(e) => {
                setTouchEnd(0);
                setTouchStart(e.targetTouches[0].clientX);
              }}
              onTouchMove={(e) => {
                setTouchEnd(e.targetTouches[0].clientX);
              }}
              onTouchEnd={() => {
                if (!touchStart || !touchEnd) return;
                const distance = touchStart - touchEnd;
                const isLeftSwipe = distance > 50;
                const isRightSwipe = distance < -50;

                if (isLeftSwipe && selectedImage < product.images.length - 1) {
                  setSelectedImage(prev => prev + 1);
                }
                if (isRightSwipe && selectedImage > 0) {
                  setSelectedImage(prev => prev - 1);
                }
              }}
              onDoubleClick={() => setIsZoomed(!isZoomed)}
            >
              <img
                src={product.images[selectedImage]}
                alt={product.name}
                className={cn(
                  "w-full h-full object-cover transition-transform duration-300",
                  isZoomed ? "scale-150" : "scale-100"
                )}
              />
              
              {/* Navigation Arrows for Desktop */}
              {product.images.length > 1 && (
                <>
                  <button
                    onClick={() => setSelectedImage(prev => Math.max(0, prev - 1))}
                    className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 hidden md:flex items-center justify-center"
                    disabled={selectedImage === 0}
                  >
                    <ApperIcon name="ChevronLeft" size={20} />
                  </button>
                  <button
                    onClick={() => setSelectedImage(prev => Math.min(product.images.length - 1, prev + 1))}
                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 hidden md:flex items-center justify-center"
                    disabled={selectedImage === product.images.length - 1}
                  >
                    <ApperIcon name="ChevronRight" size={20} />
                  </button>
                </>
              )}

              {/* Image Counter */}
              <div className="absolute bottom-2 right-2 bg-black/50 text-white px-2 py-1 rounded text-sm">
                {selectedImage + 1} / {product.images.length}
              </div>

              {/* Zoom Indicator */}
              <div className="absolute top-2 right-2 bg-black/50 text-white p-1 rounded text-xs md:hidden">
                탭하여 확대
              </div>
            </div>

            {/* Thumbnail Images - Horizontal Scroll on Mobile */}
            {product.images.length > 1 && (
              <div className="flex space-x-2 overflow-x-auto scrollbar-hide pb-2">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={cn(
                      "flex-shrink-0 w-16 h-16 md:w-20 md:h-20 rounded-lg overflow-hidden border-2 transition-all duration-200 touch-manipulation",
                      selectedImage === index
                        ? "border-primary-800 scale-110"
                        : "border-gray-200 hover:border-gray-300"
                    )}
                  >
                    <img
                      src={image}
                      alt={`${product.name} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}

            {/* Swipe Indicators for Mobile */}
            {product.images.length > 1 && (
              <div className="flex justify-center space-x-1 md:hidden">
                {product.images.map((_, index) => (
                  <div
                    key={index}
                    className={cn(
                      "w-2 h-2 rounded-full transition-all duration-200",
                      selectedImage === index
                        ? "bg-primary-600 w-6"
                        : "bg-gray-300"
                    )}
                  />
                ))}
              </div>
            )}
          </motion.div>

          {/* Product Details */}
          <motion.div
            className="space-y-6"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {/* Category & Stock */}
            <div className="flex items-center justify-between">
              <span className={cn(
                "inline-flex items-center px-3 py-1 rounded-full text-sm font-medium",
                getCategoryColor(product.category)
              )}>
                {product.category}
              </span>
              
              <div className="flex items-center space-x-2">
                <ApperIcon 
                  name={product.isInStock ? "Check" : "X"} 
                  size={16} 
                  className={product.isInStock ? "text-green-600" : "text-red-600"} 
                />
                <span className={cn(
                  "text-sm font-medium",
                  product.isInStock ? "text-green-600" : "text-red-600"
                )}>
                  {product.isInStock ? `재고 ${product.stock}개` : "품절"}
                </span>
              </div>
            </div>

            {/* Product Name */}
            <h1 className="text-3xl font-bold text-gray-900 korean-text">
              {product.name}
            </h1>

            {/* Rating */}
            {product.rating && (
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <ApperIcon
                      key={i}
                      name="Star"
                      size={20}
                      className={cn(
                        i < Math.floor(product.rating)
                          ? "text-yellow-400 fill-current"
                          : "text-gray-300"
                      )}
                    />
                  ))}
                  <span className="text-lg font-medium text-gray-700 ml-2">
                    {product.rating}
                  </span>
                </div>
                <span className="text-gray-500">
                  ({product.reviewCount}개 리뷰)
                </span>
              </div>
            )}

            {/* Price */}
            <div className="space-y-2">
              <div className="flex items-baseline space-x-3">
                <span className="text-4xl font-bold text-gray-900">
                  {formatPrice(product.price)}원
                </span>
                {product.originalPrice && (
                  <>
                    <span className="text-xl text-gray-500 line-through">
                      {formatPrice(product.originalPrice)}원
                    </span>
                    <Badge variant="destructive">
                      {Math.round((1 - product.price / product.originalPrice) * 100)}% 할인
                    </Badge>
                  </>
                )}
              </div>
            </div>

            {/* Description */}
            <p className="text-lg text-gray-600 korean-text leading-relaxed">
              {product.description}
            </p>

            {/* Variants */}
            {product.variants && (
              <div className="space-y-4">
                {product.variants.colors && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      색상
                    </label>
                    <div className="flex space-x-2">
{product.variants.colors.map((color) => (
                        <button
                          key={color}
                          onClick={() => handleVariantChange('color', color)}
                          className={cn(
                            "px-4 py-3 border rounded-lg text-sm font-medium transition-all duration-200 touch-manipulation min-h-[44px]",
                            selectedVariants.color === color
                              ? "border-primary-800 bg-primary-50 text-primary-800"
                              : "border-gray-300 hover:border-gray-400 active:bg-gray-50"
                          )}
                        >
                          {color}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

{product.variants.sizes && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      사이즈
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {product.variants.sizes.map((size) => (
                        <button
                          key={size}
                          onClick={() => handleVariantChange('size', size)}
                          className={cn(
                            "px-4 py-3 border rounded-lg text-sm font-medium transition-all duration-200 touch-manipulation min-h-[44px]",
                            selectedVariants.size === size
                              ? "border-primary-800 bg-primary-50 text-primary-800"
                              : "border-gray-300 hover:border-gray-400 active:bg-gray-50"
                          )}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

{product.variants.switches && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      스위치
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {product.variants.switches.map((switchType) => (
                        <button
                          key={switchType}
                          onClick={() => handleVariantChange('switch', switchType)}
                          className={cn(
                            "px-4 py-3 border rounded-lg text-sm font-medium transition-all duration-200 touch-manipulation min-h-[44px]",
                            selectedVariants.switch === switchType
                              ? "border-primary-800 bg-primary-50 text-primary-800"
                              : "border-gray-300 hover:border-gray-400 active:bg-gray-50"
                          )}
                        >
                          {switchType}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Quantity */}
<div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                수량
              </label>
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-3 border border-gray-300 rounded-lg hover:bg-gray-50 touch-manipulation min-h-[44px] min-w-[44px] flex items-center justify-center"
                  disabled={quantity <= 1}
                >
                  <ApperIcon name="Minus" size={16} />
                </button>
                <span className="text-lg font-medium w-12 text-center">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  className="p-3 border border-gray-300 rounded-lg hover:bg-gray-50 touch-manipulation min-h-[44px] min-w-[44px] flex items-center justify-center"
                  disabled={quantity >= product.stock || !product.isInStock}
                >
                  <ApperIcon name="Plus" size={16} />
                </button>
              </div>
            </div>

{/* Action Buttons */}
            <div className="space-y-3">
              {product.isInStock ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <Button
                    onClick={handleAddToCart}
                    variant="outline"
                    size="large"
                    className="flex items-center justify-center space-x-2 touch-manipulation min-h-[48px]"
                  >
                    <ApperIcon name="ShoppingCart" size={20} />
                    <span>장바구니 담기</span>
                  </Button>
                  <Button
                    onClick={handleBuyNow}
                    variant="primary"
                    size="large"
                    className="flex items-center justify-center space-x-2 touch-manipulation min-h-[48px]"
                  >
                    <ApperIcon name="CreditCard" size={20} />
                    <span>바로구매</span>
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  {/* Out of Stock Message */}
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
                    <div className="flex items-center justify-center space-x-2 mb-2">
                      <ApperIcon name="X" size={20} className="text-red-600" />
                      <span className="text-red-600 font-medium">현재 품절된 상품입니다</span>
                    </div>
                    <p className="text-sm text-gray-600">재입고 알림을 신청하시면 상품이 재입고될 때 이메일로 알려드립니다.</p>
                  </div>

                  {/* Email Input for Notification */}
                  {showEmailInput && (
                    <div className="space-y-2">
                      <input
                        type="email"
                        placeholder="알림받을 이메일 주소를 입력해주세요"
                        value={customerEmail}
                        onChange={(e) => setCustomerEmail(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      />
                    </div>
                  )}

                  {/* Restock Notification Button */}
                  <Button
                    onClick={handleRestockNotification}
                    variant={isSubscribed ? "outline" : "primary"}
                    size="large"
                    disabled={notificationLoading}
                    className="w-full flex items-center justify-center space-x-2 touch-manipulation min-h-[48px]"
                  >
                    {notificationLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-current"></div>
                        <span>처리중...</span>
                      </>
                    ) : (
                      <>
                        <ApperIcon name={isSubscribed ? "BellOff" : "Bell"} size={20} />
                        <span>
                          {isSubscribed ? "재입고 알림 취소" : "재입고 알림 신청"}
                        </span>
                      </>
                    )}
                  </Button>

                  {isSubscribed && customerEmail && (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-center">
                      <div className="flex items-center justify-center space-x-2">
                        <ApperIcon name="CheckCircle" size={16} className="text-green-600" />
                        <span className="text-sm text-green-700">
                          {customerEmail}로 재입고 알림이 설정되었습니다
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              )}
              
              {/* Review Button for Purchased Products */}
              <Button
                variant="outline"
                size="large"
                className="w-full flex items-center justify-center space-x-2 mt-3 touch-manipulation min-h-[48px]"
                onClick={() => {
                  // Navigate to review form with product context
                  window.location.href = `/review/create?type=product&itemId=${product.Id}&title=${encodeURIComponent(product.name)}`;
                }}
              >
                <ApperIcon name="Star" size={20} />
                <span>후기 작성</span>
              </Button>
              
              {product.isInStock && (
                <div className="text-center">
                  <span className="text-sm text-gray-500">
                    총 주문금액: <span className="font-bold text-lg text-gray-900">
                      {formatPrice(product.price * quantity)}원
                    </span>
                  </span>
                </div>
              )}
</div>
              
            {/* Social Sharing */}
            <div className="mt-4 pt-4 border-t border-gray-200">
              <h4 className="text-sm font-medium text-gray-700 mb-3">이 상품 공유하기</h4>
              <div className="flex items-center justify-center space-x-4">
                <button
                  onClick={() => shareProductToFacebook(product)}
                  className="flex items-center space-x-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 text-sm"
                >
                  <ApperIcon name="Facebook" size={16} />
                  <span>페이스북</span>
                </button>
                <button
                  onClick={() => shareProductToTwitter(product)}
                  className="flex items-center space-x-2 px-3 py-2 bg-sky-500 text-white rounded-lg hover:bg-sky-600 transition-colors duration-200 text-sm"
                >
                  <ApperIcon name="Twitter" size={16} />
                  <span>트위터</span>
                </button>
                <button
                  onClick={() => shareProductToKakao(product)}
                  className="flex items-center space-x-2 px-3 py-2 bg-yellow-400 text-gray-900 rounded-lg hover:bg-yellow-500 transition-colors duration-200 text-sm"
                >
                  <ApperIcon name="MessageCircle" size={16} />
                  <span>카카오톡</span>
                </button>
                <button
                  onClick={() => copyProductLink(product)}
                  className="flex items-center space-x-2 px-3 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors duration-200 text-sm"
                >
                  <ApperIcon name="Copy" size={16} />
                  <span>링크복사</span>
                </button>
              </div>
            </div>

            {/* Features */}
            {product.features && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  주요 특징
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {product.features.map((feature, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <ApperIcon name="Check" size={16} className="text-green-600" />
                      <span className="text-sm text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        </div>
        {/* Specifications */}
        {product.specifications && (
          <motion.div
            className="mt-12 bg-white rounded-lg p-6 shadow-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-6">상세 정보</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(product.specifications).map(([key, value]) => (
<div key={key} className="flex justify-between py-2 border-b border-gray-100">
                  <span className="font-medium text-gray-700">{key}</span>
                  <span className="text-gray-900">{value}</span>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Frequently Bought Together Section */}
        <RecommendationCarousel
          title="이 강의와 함께 구매한 상품"
          items={frequentlyBought}
          isLoading={recommendationsLoading}
          itemType="product"
          className="bg-gray-50"
          itemsPerView={{ mobile: 1, tablet: 2, desktop: 4 }}
        />

{/* Back to Store */}
        <motion.div
          className="mt-8 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <Link to="/store">
            <Button variant="outline" size="large">
              <ApperIcon name="ArrowLeft" size={20} className="mr-2" />
              스토어로 돌아가기
            </Button>
          </Link>
        </motion.div>
      </div>

      {/* Mobile Sticky Checkout Bar */}
{/* Mobile Sticky Checkout Bar */}
      <motion.div
        className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-t border-gray-200 shadow-elevated z-50 lg:hidden"
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.8 }}
        style={{ paddingBottom: 'max(env(safe-area-inset-bottom), 16px)' }}
      >
        {/* Compact Product Info Row */}
        <div className="px-4 py-2 border-b border-gray-100">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
              <img
                src={product.images[selectedImage]}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-medium text-gray-900 truncate">
                {product.name}
              </h3>
              <div className="flex items-center space-x-2">
                <span className="text-base font-bold text-primary-800">
                  {formatPrice(product.price * quantity)}원
                </span>
                {quantity > 1 && (
                  <span className="text-xs text-gray-500">
                    ({quantity}개)
                  </span>
                )}
              </div>
            </div>
            
            {/* Compact Quantity Controls */}
            <div className="flex items-center space-x-1 bg-gray-50 rounded-lg p-1">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="p-2 rounded-md hover:bg-gray-100 touch-manipulation min-h-[36px] min-w-[36px] flex items-center justify-center"
                disabled={quantity <= 1}
              >
                <ApperIcon name="Minus" size={14} />
              </button>
              <span className="text-sm font-medium w-8 text-center">
                {quantity}
              </span>
              <button
                onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                className="p-2 rounded-md hover:bg-gray-100 touch-manipulation min-h-[36px] min-w-[36px] flex items-center justify-center"
                disabled={quantity >= product.stock || !product.isInStock}
              >
                <ApperIcon name="Plus" size={14} />
              </button>
            </div>
          </div>
        </div>

{/* Action Buttons Row */}
        <div className="px-4 py-3">
          {product.isInStock ? (
            <div className="flex space-x-3">
              <Button
                onClick={handleAddToCart}
                variant="outline"
                className="flex-1 touch-manipulation min-h-[48px] flex items-center justify-center space-x-2"
              >
                <ApperIcon name="ShoppingCart" size={18} />
                <span className="hidden xs:inline">장바구니</span>
              </Button>
              <Button
                onClick={handleBuyNow}
                variant="primary"
                className="flex-2 touch-manipulation min-h-[48px] flex items-center justify-center space-x-2"
                style={{ flex: '2' }}
              >
                <ApperIcon name="CreditCard" size={18} />
                <span>바로구매</span>
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {/* Email Input for Mobile */}
              {showEmailInput && (
                <input
                  type="email"
                  placeholder="알림받을 이메일"
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              )}
              
              {/* Restock Notification Button */}
              <Button
                onClick={handleRestockNotification}
                variant={isSubscribed ? "outline" : "primary"}
                disabled={notificationLoading}
                className="w-full touch-manipulation min-h-[48px] flex items-center justify-center space-x-2"
              >
                {notificationLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
                    <span className="text-sm">처리중...</span>
                  </>
                ) : (
                  <>
                    <ApperIcon name={isSubscribed ? "BellOff" : "Bell"} size={16} />
                    <span className="text-sm">
                      {isSubscribed ? "알림 취소" : "재입고 알림"}
                    </span>
                  </>
                )}
              </Button>

              {/* Stock Status */}
              <div className="text-center">
                <span className="text-sm text-red-600 font-medium">품절</span>
              </div>
            </div>
          )}
        </div>
        
        {/* Safe Area Spacer */}
        <div style={{ height: 'env(safe-area-inset-bottom)' }} />
      </motion.div>
    </div>
  );
};

export default ProductDetailPage;