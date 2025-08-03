import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { cn } from "@/utils/cn";
import { toggleCart } from "@/store/cartSlice";
import Logo from "@/components/atoms/Logo";
import NavLink from "@/components/molecules/NavLink";
import NavDropdown from "@/components/molecules/NavDropdown";
import NavItem from "@/components/molecules/NavItem";
import Button from "@/components/atoms/Button";
import MobileNav from "@/components/molecules/MobileNav";
import ApperIcon from "@/components/ApperIcon";
const Header = ({ className }) => {
  const dispatch = useDispatch();
const { totalQuantity } = useSelector(state => state.cart);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  
  // Mock user context - in real app this would come from auth context
  const user = { role: 'admin' }; // For demo purposes, set as admin
  const isLoggedIn = true; // Mock login status
  
const navItems = [
    { label: "홈", path: "/" },
    { label: "이용후기", path: "/reviews" },
    { label: "대시보드", path: "/dashboard" },
  ];

  const toggleMobileNav = () => {
    setIsMobileNavOpen(!isMobileNavOpen);
  };

  const closeMobileNav = () => {
    setIsMobileNavOpen(false);
  };

  return (
    <>
      <header className={cn(
        "sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-gray-200/50 shadow-sm",
        className
      )}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex-shrink-0">
              <Logo size="default" />
            </div>

            {/* Desktop Navigation */}
<nav className="hidden md:flex items-center space-x-8">
              {navItems.map((item) => (
                <NavLink key={item.path} to={item.path}>
                  {item.label}
                </NavLink>
              ))}
              <NavDropdown label="강의">
                <NavItem to="/courses">강의 목록</NavItem>
                <NavItem to="/courses/manage" visible={user.role === 'admin'}>강의 관리</NavItem>
                <NavItem to="/my-courses" visible={isLoggedIn}>내 강의</NavItem>
              </NavDropdown>
            </nav>

            {/* Desktop CTA */}
<div className="hidden md:flex items-center space-x-4">
              {/* Cart Icon */}
<button
                onClick={() => dispatch(toggleCart())}
                className="relative p-3 text-gray-700 hover:text-primary-800 transition-colors touch-manipulation min-h-[44px] min-w-[44px] flex items-center justify-center"
              >
                <ApperIcon name="ShoppingCart" size={20} />
                {totalQuantity > 0 && (
                  <span className="absolute -top-1 -right-1 bg-primary-800 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
                    {totalQuantity > 99 ? '99+' : totalQuantity}
                  </span>
                )}
              </button>
              
              <Button variant="ghost" size="small" className="touch-manipulation min-h-[44px]">
                로그인
              </Button>
              <Button variant="gradient" size="small" className="touch-manipulation min-h-[44px]">
                무료 체험
              </Button>
            </div>

            {/* Mobile Menu Button */}
<div className="md:hidden flex items-center space-x-2">
              {/* Mobile Cart Icon */}
              <button
                onClick={() => dispatch(toggleCart())}
                className="relative p-3 text-gray-700 hover:text-primary-800 active:text-primary-900 transition-colors touch-manipulation min-h-[44px] min-w-[44px] flex items-center justify-center"
              >
                <ApperIcon name="ShoppingCart" size={20} />
                {totalQuantity > 0 && (
                  <span className="absolute -top-1 -right-1 bg-primary-800 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium animate-pulse">
                    {totalQuantity > 9 ? '9+' : totalQuantity}
                  </span>
                )}
              </button>
              <Button
                variant="ghost"
                size="small"
                onClick={toggleMobileNav}
                className="p-3 touch-manipulation min-h-[44px] min-w-[44px] flex items-center justify-center active:scale-95"
              >
                <ApperIcon name="Menu" size={24} />
              </Button>
            </div>
          </div>
        </div>
      </header>

{/* Mobile Navigation */}
      <MobileNav 
        isOpen={isMobileNavOpen} 
        onClose={closeMobileNav}
        navItems={navItems}
        user={user}
        isLoggedIn={isLoggedIn}
      />
    </>
  );
};

export default Header;