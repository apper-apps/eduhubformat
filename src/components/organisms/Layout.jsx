import React from "react";
import { Outlet } from "react-router-dom";
import Header from "@/components/organisms/Header";
import CartSidebar from "@/components/organisms/CartSidebar";

const Layout = () => {
  return (
<div className="min-h-screen bg-stone-50">
      <Header />
      <main className="flex-1 pb-safe mobile-safe-padding">
        <Outlet />
      </main>
      <CartSidebar />
    </div>
  );
};

export default Layout;