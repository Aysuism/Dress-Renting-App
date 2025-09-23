import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import AddCloth from "./pages/AddCloth";
import Header from "./layout/Header";
import Wishlist from "./pages/Wishlist";
import ProductDetails from "./pages/ProductDetails";
import preloader from "./assets/img/preloader.gif";
import { useEffect, useState } from "react";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AdminPanel from "./pages/auth/AdminPanel";
import AdminLogin from "./pages/auth/AdminLogin";
import AdminAccess from "./pages/auth/AdminAccess";
import ProtectedRoute from "./pages/auth/ProtectedRoute";
import NotFound from "./pages/NotFound";

const Router = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <BrowserRouter>
      <Header showSection={() => { }} />

      <div className="app-container px-[18px] md:px-[36px]">
        {loading ? (
          <div className="flex items-center justify-center">
            <img src={preloader} alt="loading..." className="w-full h-[90vh] object-contain"/>
          </div>
        ) : (
          <Routes>
            <Route path="/admin-access/:secret" element={<AdminAccess />} />
            <Route path="/admin-login" element={<AdminLogin />} />
            <Route path="/admin-panel" element={<ProtectedRoute adminOnly={true}> <AdminPanel /> </ProtectedRoute>} />

            <Route path="/" element={<Home />} />
            <Route path="/:urlid" element={<ProductDetails />} />
            <Route path="/wishlist" element={<Wishlist />} />
            <Route path="/add-cloth" element={<AddCloth />} />

            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />

            <Route path="/not-found" element={<NotFound />} />
            <Route path="/*" element={<NotFound />} />
          </Routes>
        )}
      </div>
    </BrowserRouter>
  );
};

export default Router;