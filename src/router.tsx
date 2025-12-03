import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import AddCloth from "./pages/AddCloth";
import Header from "./layout/Header";
import Wishlist from "./pages/Wishlist";
import ProductDetails from "./pages/ProductDetails";
import preloader from "./assets/img/preloader.gif";
import { useEffect, useState } from "react";
import AdminPanel from "./pages/auth/AdminPanel";
import AdminLogin from "./pages/auth/AdminLogin";
import AdminAccess from "./pages/auth/AdminAccess";
import ProtectedRoute from "./pages/auth/ProtectedRoute";
import NotFound from "./pages/NotFound";
import CategoryManagement from "./pages/auth/CategoryManagement";
import SubcategoryManagement from "./pages/auth/SubcategoryManagement";
import ProductManagement from "./pages/auth/ProductManagement";
import SearchResults from "./pages/SearchResults";
import BrandManagement from "./pages/auth/BrandManagement";

const Router = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <BrowserRouter>
      <Header showSection={() => { }} />

      {loading ? (
        <div className="flex items-center justify-center">
          <img src={preloader} alt="loading..." className="w-full h-[90vh] bg-white object-contain" />
        </div>
      ) : (
        <div className="app-container px-[18px] md:px-[36px]">
          <Routes>
            <Route path="/admin-access/:secret" element={<AdminAccess />} />
            <Route path="/admin-login" element={<AdminLogin />} />
            <Route
              path="/admin-panel"
              element={
                <ProtectedRoute adminOnly={true}>
                  <AdminPanel />
                </ProtectedRoute>
              }
            >
              <Route index element={<ProductManagement />} />
              <Route path="product-management" element={<ProductManagement />} />
              <Route path="category-management" element={<CategoryManagement />} />
              <Route path="subcategory-management" element={<SubcategoryManagement />} />
              <Route path="brand-management" element={<BrandManagement />} />
            </Route>

            <Route path="/" element={<Home />} />
            <Route path="/:urlid" element={<ProductDetails />} />
            <Route path="/wishlist" element={<Wishlist />} />
            <Route path="/add-cloth" element={<AddCloth />} />
            <Route path="/searching-result" element={<SearchResults />} />
            {/* <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} /> */}
            <Route path="/not-found" element={<NotFound />} />
            <Route path="/*" element={<NotFound />} />
          </Routes>
        </div>
      )}
    </BrowserRouter>
  );
};

export default Router;