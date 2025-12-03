import React, { useState, useEffect, useMemo, useCallback } from "react";
import MenuIcon from "@mui/icons-material/Menu";
import SearchIcon from "@mui/icons-material/Search";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/img/logo.webp";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import Swal from "sweetalert2";
import Fuse from "fuse.js";
import { useGetCategoriesQuery } from "../tools/categories";
// import { useGetSubcategoriesQuery } from "../tools/subCategory";
import { jwtDecode } from "jwt-decode";
import { useGetProductsQuery } from "../tools/product";
import { genderOptions } from "../pages/AddCloth";
import { colorOptions } from "../pages/AddCloth";

export interface HeaderProps {
  showSection: (section: string) => void;
}

interface SearchItem {
  id: string;
  name: string;
  type: 'category' | 'subcategory' | 'gender' | 'color' | 'product';
  categoryId?: string;
  categoryName?: string;
  productCode?: string;
}

const Header: React.FC<HeaderProps> = ({ showSection }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [keyword, setKeyword] = useState("");
  const [showResults, setShowResults] = useState(false);
  const navigate = useNavigate();

  const { data: categories = [] } = useGetCategoriesQuery([]);
  // const { data: subcategories = [] } = useGetSubcategoriesQuery([]);
  const { data: products = [] } = useGetProductsQuery([]);

  // ------------------ User/Admin ------------------
  const checkUser = useCallback(() => {
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("loggedInUser");

    const isTokenValid = (token: string) => {
      try {
        const decoded: { exp: number; role?: string } = jwtDecode(token);
        return decoded.exp > Date.now() / 1000;
      } catch {
        return false;
      }
    };

    if (!token || !isTokenValid(token)) {
      localStorage.removeItem("token");
      localStorage.removeItem("loggedInUser");
      setIsAdmin(false);
      return;
    }

    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        setIsAdmin(user.role === "ADMIN");
      } catch {
        setIsAdmin(false);
      }
    } else {
      setIsAdmin(false);
    }
  }, []);

  useEffect(() => {
    checkUser();

    const handleUserEvent = () => checkUser();

    window.addEventListener("userLoggedIn", handleUserEvent);
    window.addEventListener("storage", handleUserEvent);
    window.addEventListener("userLoggedOut", handleUserEvent);

    return () => {
      window.removeEventListener("userLoggedIn", handleUserEvent);
      window.removeEventListener("storage", handleUserEvent);
      window.removeEventListener("userLoggedOut", handleUserEvent);
    };
  }, [checkUser]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("loggedInUser");
    setIsAdmin(false);
    Swal.fire("Logged out", "You have been logged out.", "success");
    window.dispatchEvent(new Event("userLoggedOut"));
    navigate("/");
  };

  const handleNav = (section: string) => {
    showSection(section);
    setSidebarOpen(false);
  };

  // ---------------- SEARCH ----------------
  const searchItems: SearchItem[] = useMemo(() => {
    if (!categories?.length && !products?.length) return [];

    const categoryItems: SearchItem[] = categories.map((cat: any) => ({
      id: String(cat.id),
      name: cat.name,
      type: 'category' as const
    }));

    // const subcategoryItems: SearchItem[] = subcategories.map((sub: any) => ({
    //   id: String(sub.id),
    //   name: sub.name,
    //   type: 'subcategory' as const,
    //   categoryId: String(sub.category?.id),
    //   categoryName: sub.category?.name
    // }));

    const productItems: SearchItem[] = products.map((product: any) => ({
      id: String(product.id || product.productCode),
      name: `${product.productCode} - ${product.userName} ${product.userSurname}`,
      type: 'product' as const,
      productCode: product.productCode
    }));

    const genderItems: SearchItem[] = genderOptions.map((gender: any) => ({
      id: String(gender.id),
      name: gender.name,
      type: 'gender' as const,
    }))

    const colorItems: SearchItem[] = colorOptions.map((color) => ({
      id: String(color.id),
      name: color.name,
      type: 'color' as const
    }))

    return [...categoryItems, ...productItems, ...genderItems, ...colorItems];
  }, [categories, products, genderOptions, colorOptions]);

  const fuse = useMemo(() => {
    if (!searchItems.length) return null;
    return new Fuse(searchItems, {
      keys: ['name', 'productCode'],
      threshold: 0.3,
      includeScore: true,
    });
  }, [searchItems]);

  const filteredResults = useMemo(() => {
    if (!keyword.trim() || !fuse) return [];
    const results = fuse.search(keyword);
    return results.map(result => result.item);
  }, [fuse, keyword]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setKeyword(value);
    setShowResults(value.length > 0);
  };
  const handleResultClick = (item: SearchItem) => {
    setKeyword("");
    setShowResults(false);

    if (item.type === 'product') {
      navigate(`/searching-result?productCode=${item.productCode}`);
      return;
    }

    const queryParams = new URLSearchParams();

    if (item.type === 'gender') {
      queryParams.append('gender', item.name);
    }

    if (item.type === 'color') {
      // Find the original color option to get the English value
      const colorOption = colorOptions.find(color =>
        color.name === item.name || color.id === item.id
      );
      // Use color.value (English) for search, fallback to name if not found
      queryParams.append('color', colorOption?.value || item.name);
    }

    if (item.type === 'category') {
      queryParams.append('categoryName', item.name);
    } 
    // else if (item.type === 'subcategory') {
    //   if (item.categoryName) {
    //     queryParams.append('categoryName', item.categoryName);
    //   }
    //   queryParams.append('subcategoryName', item.name);
    // }

    navigate(`/searching-result?${queryParams.toString()}`);
  };

  return (
    <header className="p-[18px] sm:px-6 py-4 bg-white sticky top-0 z-50">
      <div className="container mx-auto flex justify-between items-center gap-6">
        {/* Logo */}
        <Link to="/">
          <img src={logo} alt="we-share-logo" className="w-full h-[50px] object-contain" />
        </Link>

        {/* Desktop search */}
        <div className="relative mx-4 hidden md:block">
          <div className="relative">
            <input
              type="text"
              placeholder="Axtarış..."
              className="w-full lg:w-[444px] px-10 py-2 pl-10 border border-gray-400 rounded-lg outline-none focus:ring-1"
              value={keyword}
              onChange={handleSearch}
              onFocus={() => setShowResults(true)}
              onBlur={() => {
                setTimeout(() => setShowResults(false), 200);
              }}
            />
            <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>

          {/* Search results */}
          {showResults && filteredResults.length > 0 && (
            <ul className="absolute top-full left-0 right-0 mt-1 bg-white border rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto divide-y divide-gray-200">
              {filteredResults.map((item: SearchItem) => (
                <li
                  key={`${item.type}-${item.id}`}
                  className="cursor-pointer px-4 py-2 hover:bg-gray-100"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => handleResultClick(item)}
                >
                  <div className="flex justify-between items-center">
                    <span>{item.name}</span>
                    <span className="text-xs text-gray-500 capitalize">
                      {item.type === 'category' ? 'Kateqoriya' :
                        // item.type === 'subcategory' ? 'Alt Kateqoriya' :
                          'Məhsul Kodu'}
                    </span>
                  </div>
                  {item.categoryName && (
                    <div className="text-xs text-gray-400 mt-1">
                      {item.categoryName}
                    </div>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-4">
          <Link
            to="/wishlist"
            className="hover:-translate-y-1 transition-all duration-300"
            onClick={() => handleNav("favorites")}
          >
            <FavoriteBorderOutlinedIcon />
          </Link>
          <Link
            to="/add-cloth"
            className="px-3 py-2 rounded-lg font-medium text-[16px] bg-black text-white border-2 hover:-translate-y-1 hover:bg-white hover:text-black hover:shadow-lg transition-all duration-300"
            onClick={() => handleNav("add-clothes")}
          >
            Məhsul Əlavə Et
          </Link>

          {isAdmin && (
            <>
              <Link
                to="/admin-panel"
                className="px-3 py-2 rounded-lg font-medium text-[16px] bg-black text-white border-2 hover:-translate-y-1 hover:bg-white hover:text-black hover:shadow-lg transition-all duration-300"
                onClick={() => handleNav("admin-panel")}
              >
                Admin
              </Link>
              <button
                onClick={handleLogout}
                className="px-3 py-2 rounded-lg font-medium text-[16px] bg-red-500 text-white border-2 hover:-translate-y-1 hover:bg-white hover:text-red-500 hover:shadow-lg transition-all duration-300"
              >
                Logout
              </button>
            </>
          )}
        </div>

        {/* Mobile button */}
        <div className="md:hidden">
          <div className="p-1 rounded-md shadow-md cursor-pointer">
            <MenuIcon onClick={() => setSidebarOpen(!sidebarOpen)} />
          </div>
        </div>
      </div>

      {/* Mobile sidebar */}
      <div
        className={`fixed top-0 left-0 w-full h-full z-50 p-6 flex flex-col gap-4 md:hidden bg-[#f9fafb] text-black shadow-lg transform transition-transform duration-300 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        style={{ pointerEvents: sidebarOpen ? "auto" : "none" }}
      >
        {/* Close button */}
        <button
          onClick={() => setSidebarOpen(false)}
          className="text-gray-500 flex justify-end hover:text-gray-700"
          aria-label="Close menu"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Logo */}
        <Link to="/" className="flex justify-center pb-4" onClick={() => setSidebarOpen(false)}>
          <div className="w-1/2 max-w-[200px] aspect-[200/60] relative">
            <img src={logo} alt="second-hand-logo" className="absolute inset-0 w-full h-full object-contain" />
          </div>
        </Link>


        {/* Mobile search */}
        <div className="relative">
          <div className="flex items-center border border-gray-400 text-gray-400 rounded-lg px-2 py-2 focus-within:ring-1 transition-all">
            <SearchIcon className="mr-2" />
            <input
              type="text"
              value={keyword}
              onChange={handleSearch}
              onFocus={() => setShowResults(true)}
              onBlur={() => {
                setTimeout(() => setShowResults(false), 200);
              }}
              placeholder="Secondhand-də axtar"
              className="flex-1 bg-transparent outline-none text-sm"
            />
          </div>

          {showResults && filteredResults.length > 0 && (
            <ul className="absolute top-full left-0 right-0 mt-1 bg-white border rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto divide-y divide-gray-200">
              {filteredResults.map((item: SearchItem) => (
                <li
                  key={`${item.type}-${item.id}`}
                  className="cursor-pointer px-4 py-2 hover:bg-gray-100"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => handleResultClick(item)}
                >
                  <div className="flex justify-between items-center">
                    <span>{item.name}</span>
                    <span className="text-xs text-gray-500 capitalize">
                      {item.type === 'category' ? 'Kateqoriya' :
                        // item.type === 'subcategory' ? 'Alt Kateqoriya' :
                          'Məhsul Kodu'}
                    </span>
                  </div>
                  {item.categoryName && (
                    <div className="text-xs text-gray-400 mt-1">
                      {item.categoryName}
                    </div>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>

        <Link
          to="/wishlist"
          className="text-center border rounded-lg py-[6px] hover:bg-black hover:text-white transition-all duration-500"
          onClick={() => handleNav("favorites")}
        >
          <FavoriteBorderOutlinedIcon /> Sevimlilər
        </Link>
        <Link
          to="/add-cloth"
          className="text-center border rounded-lg py-[6px] bg-black text-white hover:bg-white hover:text-black transition-all duration-500"
          onClick={() => handleNav("add-clothes")}
        >
          Məhsul Əlavə Et
        </Link>

        {isAdmin && (
          <>
            <Link
              to="/admin-panel"
              className="text-center border border-black bg-black text-white rounded-lg py-[6px] hover:bg-white hover:text-black transition-all duration-500"
              onClick={() => handleNav("admin-panel")}
            >
              Admin
            </Link>
            <button
              onClick={handleLogout}
              className="w-full text-center border rounded-lg py-[6px] text-red-500 border-red-500 hover:bg-red-500 hover:text-white transition-all duration-500"
            >
              Logout
            </button>
          </>
        )}
      </div>
    </header>
  );
};

export default Header;