import React from "react";
import { NavLink as RouterNavLink, useLocation } from "react-router-dom";
import { cn } from "@/utils/cn";

const NavLink = ({ to, children, className, ...props }) => {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <RouterNavLink
      to={to}
      className={({ isActive }) =>
        cn(
          "nav-link relative px-3 py-2 text-base font-medium transition-all duration-200",
          isActive && "active",
          className
        )
      }
      {...props}
    >
      {children}
    </RouterNavLink>
  );
};

export default NavLink;