import React, { useState, useRef, useEffect } from 'react';
import { cn } from '@/utils/cn';
import ApperIcon from '@/components/ApperIcon';

const NavDropdown = ({ label, children, className }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleKeyDown = (event) => {
    if (event.key === 'Escape') {
      setIsOpen(false);
    }
  };

  return (
    <div 
      ref={dropdownRef}
      className={cn("relative", className)}
      onKeyDown={handleKeyDown}
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "nav-link flex items-center space-x-1 focus:outline-none",
          isOpen && "text-primary-800"
        )}
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <span>{label}</span>
        <ApperIcon 
          name="ChevronDown" 
          size={16} 
          className={cn(
            "transition-transform duration-200",
            isOpen && "rotate-180"
          )}
        />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-lg shadow-elevated border border-gray-200 py-2 z-50">
          {React.Children.map(children, (child, index) => (
            <div key={index} onClick={() => setIsOpen(false)}>
              {child}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default NavDropdown;