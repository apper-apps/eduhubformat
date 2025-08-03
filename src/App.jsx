import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { Provider } from "react-redux";
import { store } from "@/store/store";
import "@/index.css";
import Layout from "@/components/organisms/Layout";
import HomePage from "@/components/pages/HomePage";
import CoursesPage from "@/components/pages/CoursesPage";
import ReviewsPage from "@/components/pages/ReviewsPage";
import ProductDetailPage from "@/components/pages/ProductDetailPage";
import StorePage from "@/components/pages/StorePage";
import CourseDetailPage from "@/components/pages/CourseDetailPage";
import MemberDashboard from "@/components/pages/MemberDashboard";
function App() {
  return (
<Provider store={store}>
      <BrowserRouter>
        <div className="min-h-screen bg-stone-50">
<Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<HomePage />} />
              <Route path="courses" element={<CoursesPage />} />
              <Route path="courses/:id" element={<CourseDetailPage />} />
              <Route path="store" element={<StorePage />} />
              <Route path="store/:id" element={<ProductDetailPage />} />
              <Route path="reviews" element={<ReviewsPage />} />
              <Route path="dashboard" element={<MemberDashboard />} />
            </Route>
          </Routes>
        
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          style={{ zIndex: 9999 }}
        />
</div>
      </BrowserRouter>
    </Provider>
  );
}

export default App;