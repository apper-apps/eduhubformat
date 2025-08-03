import React, { useState } from "react";
import NavItem from "@/components/molecules/NavItem";
import ApperIcon from "@/components/ApperIcon";
import NavLink from "@/components/molecules/NavLink";
import Button from "@/components/atoms/Button";
import { cn } from "@/utils/cn";
const MobileNav = ({ isOpen, onClose, navItems, user, isLoggedIn }) => {
  const [isCoursesDropdownOpen, setIsCoursesDropdownOpen] = useState(false);
  
  const defaultNavItems = [
    { label: "홈", path: "/" },
    { label: "이용후기", path: "/reviews" },
{ label: "대시보드", path: "/dashboard" },
  ];

  const finalNavItems = navItems || defaultNavItems;

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
<div 
        className="mobile-nav-overlay touch-manipulation"
        onClick={onClose}
        onTouchEnd={onClose}
      />
      
      {/* Mobile Menu */}
<div className={cn(
        "mobile-nav-menu",
        isOpen ? "mobile-nav-enter-active" : "mobile-nav-exit-active"
      )}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex justify-end p-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="touch-manipulation min-h-[44px] min-w-[44px] p-2"
            >
              <ApperIcon name="X" size={20} />
            </Button>
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 px-6 py-4">
            <div className="space-y-1">
              {finalNavItems.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className="block px-4 py-3 text-lg font-medium rounded-lg hover:bg-primary-50 active:bg-primary-100 transition-all duration-200 touch-manipulation min-h-[56px] flex items-center"
                  onClick={onClose}
                >
                  {item.label}
                </NavLink>
              ))}
              
              {/* 강의 Dropdown */}
              <div className="border-t border-gray-200 pt-2 mt-2">
                <button
                  onClick={() => setIsCoursesDropdownOpen(!isCoursesDropdownOpen)}
                  className="flex items-center justify-between w-full px-4 py-3 text-lg font-medium text-gray-700 hover:text-primary-800 rounded-lg hover:bg-primary-50 touch-manipulation min-h-[56px]"
                >
                  <span>강의</span>
                  <ApperIcon 
                    name="ChevronDown" 
                    size={20} 
                    className={cn(
                      "transition-transform duration-200",
                      isCoursesDropdownOpen && "rotate-180"
                    )}
                  />
                </button>
                
                {isCoursesDropdownOpen && (
                  <div className="pl-4 space-y-1">
                    <NavItem 
                      to="/courses" 
                      className="block py-2 px-4 text-base rounded-lg hover:bg-primary-50"
                    >
                      강의 목록
                    </NavItem>
                    <NavItem 
                      to="/courses/manage" 
                      visible={user?.role === 'admin'}
                      className="block py-2 px-4 text-base rounded-lg hover:bg-primary-50"
                    >
                      강의 관리
                    </NavItem>
                    <NavItem 
                      to="/my-courses" 
                      visible={isLoggedIn}
                      className="block py-2 px-4 text-base rounded-lg hover:bg-primary-50"
                    >
                      내 강의
                    </NavItem>
                  </div>
                )}
              </div>
            </div>
          </nav>

          {/* Footer */}
          <div className="p-6 border-t border-gray-200">
            <Button 
              variant="gradient" 
              className="w-full touch-manipulation min-h-[48px] text-lg font-semibold"
            >
              무료 체험 시작하기
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default MobileNav;