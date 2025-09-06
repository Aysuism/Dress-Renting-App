import React, { useState, useMemo } from "react";
import MenuIcon from "@mui/icons-material/Menu";
import { Link } from "react-router-dom";
import { useWishlist } from "react-use-wishlist";

export interface HeaderProps {
  showSection: (section: string) => void;
}

const Header: React.FC<HeaderProps> = ({ showSection }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { items } = useWishlist();

  const favoriteCount = useMemo(() => {
    const ids = new Set(items.map((i) => String(i.id)));
    return ids.size;
  }, [items]);

  const handleNav = (section: string) => {
    showSection(section);
    setSidebarOpen(false);
  };

  return (
    <header className="bg-gradient-to-r from-indigo-100 via-pink-100 to-sky-100 px-10 py-5">
      <div className="container mx-auto flex justify-between items-center">
        <Link
          to="/"
          className="text-2xl font-bold bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent"
        >
          👗 Kirayə Geyim
        </Link>

        {/* Desktop */}
        <div className="hidden md:flex gap-4">
          <Link
            to="/"
            className="px-6 py-2 rounded-full font-bold text-sm bg-gradient-to-r from-pink-400 to-purple-400 text-white hover:-translate-y-1 hover:shadow-lg transition-all duration-300"
            onClick={() => handleNav("clothes")}
          >
            Geyimlər
          </Link>
          <Link
            to="/wishlist"
            className="px-6 py-2 rounded-full font-bold text-sm bg-gradient-to-r from-purple-300 to-purple-500 text-white hover:-translate-y-1 hover:shadow-lg transition-all duration-300"
            onClick={() => handleNav("favorites")}
          >
            Sevimlilər (<span>{favoriteCount}</span>)
          </Link>
          <Link
            to="/add-cloth"
            className="px-6 py-2 rounded-full font-bold text-sm bg-gradient-to-r from-purple-400 to-pink-600 text-white hover:-translate-y-1 hover:shadow-lg transition-all duration-300"
            onClick={() => handleNav("add-clothes")}
          >
            Geyim Əlavə Et
          </Link>
          <Link
            to="/admin"
            className="px-6 py-2 rounded-full font-bold text-sm bg-gradient-to-r from-purple-400 to-pink-600 text-white hover:-translate-y-1 hover:shadow-lg transition-all duration-300"
            onClick={() => handleNav("admin")}
          >
            Admin
          </Link>
        </div>

        {/* Mobile button */}
        <div className="md:hidden">
          <div className="p-1 rounded-md shadow-md">
            <MenuIcon onClick={() => setSidebarOpen(!sidebarOpen)} />
          </div>
        </div>
      </div>

      {/* Mobile sidebar */}
      <div
        className={`fixed top-0 left-0 w-64 h-full z-50 p-6 flex flex-col gap-4 md:hidden bg-gradient-to-b from-purple-400 via-pink-400 to-pink-200 shadow-lg transform transition-transform duration-300 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        style={{ pointerEvents: sidebarOpen ? "auto" : "none" }}
      >
        <Link
          to="/"
          className="text-left font-bold text-white"
          onClick={() => handleNav("home")}
        >
          Ana Səhifə
        </Link>
        <Link
          to="/clothes"
          className="text-left font-bold text-white"
          onClick={() => handleNav("clothes")}
        >
          Geyimlər
        </Link>
        <Link
          to="/wishlist"
          className="text-left font-bold text-white"
          onClick={() => handleNav("favorites")}
        >
          Sevimlilər (<span>{favoriteCount}</span>)
        </Link>
        <Link
          to="/add-cloth"
          className="text-left font-bold text-white"
          onClick={() => handleNav("add-clothes")}
        >
          Geyim Əlavə Et
        </Link>
        <Link
          to="/admin"
          className="text-left font-bold text-white"
          onClick={() => handleNav("admin")}
        >
          Admin
        </Link>
      </div>
    </header>
  );
};

export default Header;
