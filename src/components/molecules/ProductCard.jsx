import React from 'react';
import { Link } from 'react-router-dom';
import { cn } from '@/utils/cn';
import Badge from '@/components/atoms/Badge';
import Button from '@/components/atoms/Button';
import ApperIcon from '@/components/ApperIcon';

const ProductCard = ({ product, className, ...props }) => {
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

  return (
<div
      className={cn(
        "card-elevated group cursor-pointer overflow-hidden touch-manipulation active:scale-[0.98] transition-all duration-300",
        className
      )}
      {...props}
    >
      <Link to={`/store/${product.Id}`} className="block">
        {/* Product Image */}
        <div className="relative aspect-[4/3] overflow-hidden">
<img
            src={product.images[0]}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
          
          {/* Discount Badge */}
          {product.originalPrice && (
            <div className="absolute top-2 left-2 md:top-3 md:left-3">
              <Badge variant="destructive" className="text-xs">
                {Math.round((1 - product.price / product.originalPrice) * 100)}% 할인
              </Badge>
            </div>
          )}
          
          {/* Stock Status */}
          {!product.isInStock && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <Badge variant="secondary" className="text-sm">
                품절
              </Badge>
            </div>
          )}
          
          {/* Category Badge */}
          <div className="absolute top-2 right-2 md:top-3 md:right-3">
            <span className={cn(
              "inline-flex items-center px-2 py-1 rounded-full text-xs font-medium backdrop-blur-sm",
              getCategoryColor(product.category)
            )}>
              {product.category}
            </span>
          </div>
        </div>

        {/* Product Info */}
        <div className="p-6 space-y-4">
          {/* Title */}
          <h3 className="font-semibold text-lg text-gray-900 line-clamp-2 group-hover:text-primary-800 transition-colors duration-200">
            {product.name}
          </h3>

          {/* Rating */}
          {product.rating && (
            <div className="flex items-center space-x-2">
              <div className="flex items-center space-x-1">
                <ApperIcon name="Star" size={16} className="text-yellow-400 fill-current" />
                <span className="text-sm font-medium text-gray-700">
                  {product.rating}
                </span>
              </div>
              <span className="text-sm text-gray-500">
                ({product.reviewCount}개 리뷰)
              </span>
            </div>
          )}

          {/* Description */}
          <p className="text-sm text-gray-600 line-clamp-2 korean-text">
            {product.description}
          </p>

          {/* Price */}
          <div className="space-y-1">
            <div className="flex items-baseline space-x-2">
              <span className="text-2xl font-bold text-gray-900">
                {formatPrice(product.price)}원
              </span>
              {product.originalPrice && (
                <span className="text-sm text-gray-500 line-through">
                  {formatPrice(product.originalPrice)}원
                </span>
              )}
            </div>
          </div>

          {/* Features */}
          {product.features && product.features.length > 0 && (
            <div className="space-y-2">
              <div className="flex flex-wrap gap-1">
                {product.features.slice(0, 2).map((feature, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-md"
                  >
                    {feature}
                  </span>
                ))}
                {product.features.length > 2 && (
                  <span className="inline-flex items-center px-2 py-1 bg-gray-100 text-gray-500 text-xs rounded-md">
                    +{product.features.length - 2}개 더
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Stock Info */}
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-1">
              <ApperIcon 
                name={product.isInStock ? "Check" : "X"} 
                size={16} 
                className={product.isInStock ? "text-green-600" : "text-red-600"} 
              />
              <span className={product.isInStock ? "text-green-600" : "text-red-600"}>
                {product.isInStock ? `재고 ${product.stock}개` : "품절"}
              </span>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default ProductCard;