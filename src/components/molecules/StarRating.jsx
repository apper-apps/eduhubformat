import React, { useState } from 'react';
import { cn } from '@/utils/cn';
import ApperIcon from '@/components/ApperIcon';

const StarRating = ({ value = 0, onChange, readonly = false, size = 24, className }) => {
  const [hoverValue, setHoverValue] = useState(0);

  const handleStarClick = (rating) => {
    if (!readonly && onChange) {
      onChange(rating);
    }
  };

  const handleStarHover = (rating) => {
    if (!readonly) {
      setHoverValue(rating);
    }
  };

  const handleMouseLeave = () => {
    if (!readonly) {
      setHoverValue(0);
    }
  };

  const getStarColor = (starIndex) => {
    const currentValue = hoverValue || value;
    if (starIndex <= currentValue) {
      return 'text-yellow-400';
    }
    return 'text-gray-300';
  };

  return (
    <div 
      className={cn('flex items-center space-x-1', className)}
      onMouseLeave={handleMouseLeave}
    >
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          className={cn(
            'transition-colors duration-150',
            !readonly && 'hover:scale-110 transform',
            readonly && 'cursor-default'
          )}
          onClick={() => handleStarClick(star)}
          onMouseEnter={() => handleStarHover(star)}
          disabled={readonly}
        >
          <ApperIcon 
            name="Star" 
            size={size} 
            className={cn(
              'transition-colors duration-150',
              getStarColor(star),
              (hoverValue || value) >= star ? 'fill-current' : ''
            )}
          />
        </button>
      ))}
      {value > 0 && (
        <span className="ml-2 text-sm text-gray-600">
          ({value}/5)
        </span>
      )}
    </div>
  );
};

export default StarRating;