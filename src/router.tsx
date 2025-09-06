import { BrowserRouter, Route, Routes } from "react-router-dom"
import Home from "./pages/Home"
import AddCloth from "./pages/AddCloth"
import Header from "./layout/Header"
import Wishlist from "./pages/Wishlist"
import ProductDetails from "./pages/ProductDetails"
import preloader from './assets/img/preloader.gif'
import { useEffect, useState } from "react"
import Login from "./pages/Login"
import Register from "./pages/Register"
import AdminPanel from "./pages/AdminPanel"

const Router = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center z-50 bg-gradient-to-br from-[#f5f3ff] via-[#fce7f3] to-[#f0f9ff]">
        <img src={preloader} alt="loading..." />
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Header showSection={() => { }}/>
      <div className="app-container px-4 md:px-20 ">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/:urlid" element={<ProductDetails />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/add-cloth" element={<AddCloth />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/admin" element={<AdminPanel />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default Router