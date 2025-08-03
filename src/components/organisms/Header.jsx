import React, { useState } from "react";
import { cn } from "@/utils/cn";
import Logo from "@/components/atoms/Logo";
import NavLink from "@/components/molecules/NavLink";
import Button from "@/components/atoms/Button";
import MobileNav from "@/components/molecules/MobileNav";
import ApperIcon from "@/components/ApperIcon";

const Header = ({ className }) => {
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  const navItems = [
    { label: "홈", path: "/" },
    { label: "강의", path: "/courses" },
    { label: "스토어", path: "/store" },
    { label: "이용후기", path: "/reviews" },
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
            </nav>

            {/* Desktop CTA */}
            <div className="hidden md:flex items-center space-x-4">
              <Button variant="ghost" size="small">
                로그인
              </Button>
              <Button variant="gradient" size="small">
                무료 체험
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <Button
                variant="ghost"
                size="small"
                onClick={toggleMobileNav}
                className="p-2"
              >
                <ApperIcon name="Menu" size={24} />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Navigation */}
      <MobileNav isOpen={isMobileNavOpen} onClose={closeMobileNav} />
    </>
  );
};

export default Header;