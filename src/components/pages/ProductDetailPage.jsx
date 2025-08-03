import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import { cn } from '@/utils/cn';
import { getProductById } from '@/services/api/productService';
import { addToCart } from '@/store/cartSlice';
import Loading from '@/components/ui/Loading';
import Error from '@/components/ui/Error';
import Button from '@/components/atoms/Button';
import Badge from '@/components/atoms/Badge';
import ApperIcon from '@/components/ApperIcon';
const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedVariants, setSelectedVariants] = useState({});
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    loadProduct();
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

  const formatPrice = (price) => {
    return new Intl.NumberFormat('ko-KR').format(price);
  };

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
            {/* Main Image */}
            <div className="aspect-square overflow-hidden rounded-lg bg-gray-100">
              <img
                src={product.images[selectedImage]}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Thumbnail Images */}
            {product.images.length > 1 && (
              <div className="flex space-x-2">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={cn(
                      "w-16 h-16 rounded-lg overflow-hidden border-2 transition-all duration-200",
                      selectedImage === index
                        ? "border-primary-800"
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
                            "px-4 py-2 border rounded-lg text-sm font-medium transition-all duration-200",
                            selectedVariants.color === color
                              ? "border-primary-800 bg-primary-50 text-primary-800"
                              : "border-gray-300 hover:border-gray-400"
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
                            "px-4 py-2 border rounded-lg text-sm font-medium transition-all duration-200",
                            selectedVariants.size === size
                              ? "border-primary-800 bg-primary-50 text-primary-800"
                              : "border-gray-300 hover:border-gray-400"
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
                    <div className="flex space-x-2">
                      {product.variants.switches.map((switchType) => (
                        <button
                          key={switchType}
                          onClick={() => handleVariantChange('switch', switchType)}
                          className={cn(
                            "px-4 py-2 border rounded-lg text-sm font-medium transition-all duration-200",
                            selectedVariants.switch === switchType
                              ? "border-primary-800 bg-primary-50 text-primary-800"
                              : "border-gray-300 hover:border-gray-400"
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
                  className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                  disabled={quantity <= 1}
                >
                  <ApperIcon name="Minus" size={16} />
                </button>
                <span className="text-lg font-medium w-12 text-center">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                  disabled={quantity >= product.stock || !product.isInStock}
                >
                  <ApperIcon name="Plus" size={16} />
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Button
                  onClick={handleAddToCart}
                  variant="outline"
                  size="large"
                  disabled={!product.isInStock}
                  className="flex items-center justify-center space-x-2"
                >
                  <ApperIcon name="ShoppingCart" size={20} />
                  <span>장바구니 담기</span>
                </Button>
                <Button
                  onClick={handleBuyNow}
                  variant="primary"
                  size="large"
                  disabled={!product.isInStock}
                  className="flex items-center justify-center space-x-2"
                >
                  <ApperIcon name="CreditCard" size={20} />
                  <span>바로구매</span>
                </Button>
              </div>
              
              <div className="text-center">
                <span className="text-sm text-gray-500">
                  총 주문금액: <span className="font-bold text-lg text-gray-900">
                    {formatPrice(product.price * quantity)}원
                  </span>
                </span>
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
    </div>
  );
};

export default ProductDetailPage;