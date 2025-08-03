import React from 'react';
import { NavLink as RouterNavLink } from 'react-router-dom';
import { cn } from '@/utils/cn';

const NavItem = ({ to, children, visible = true, className }) => {
  if (!visible) return null;

  return (
    <RouterNavLink
      to={to}
      className={({ isActive }) =>
        cn(
          "block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-primary-800 transition-colors duration-200 rounded-md mx-1",
          isActive && "bg-primary-50 text-primary-800 font-medium",
          className
        )
      }
    >
      {children}
    </RouterNavLink>
  );
};

export default NavItem;