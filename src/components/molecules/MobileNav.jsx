import React from "react";
import { cn } from "@/utils/cn";
import NavLink from "@/components/molecules/NavLink";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";

const MobileNav = ({ isOpen, onClose }) => {
  const navItems = [
    { label: "홈", path: "/" },
    { label: "강의", path: "/courses" },
    { label: "스토어", path: "/store" },
    { label: "이용후기", path: "/reviews" },
  ];

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div 
        className="mobile-nav-overlay"
        onClick={onClose}
      />
      
      {/* Mobile Menu */}
      <div className={cn(
        "mobile-nav-menu",
        isOpen ? "mobile-nav-enter-active" : "mobile-nav-exit-active"
      )}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gradient">메뉴</h2>
            <Button
              variant="ghost"
              size="small"
              onClick={onClose}
              className="p-2"
            >
              <ApperIcon name="X" size={20} />
            </Button>
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 px-6 py-8">
            <ul className="space-y-6">
              {navItems.map((item) => (
                <li key={item.path}>
                  <NavLink
                    to={item.path}
                    onClick={onClose}
                    className="block text-lg font-semibold py-3 px-4 rounded-lg hover:bg-primary-50 transition-colors duration-200"
                  >
                    {item.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>

          {/* Footer */}
          <div className="p-6 border-t border-gray-200">
            <Button variant="gradient" className="w-full">
              무료 체험 시작하기
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default MobileNav;