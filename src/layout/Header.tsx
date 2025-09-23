import React, { useState, useEffect, useRef } from "react";
import MenuIcon from "@mui/icons-material/Menu";
import SearchIcon from "@mui/icons-material/Search";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/img/logo.webp";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import Swal from "sweetalert2";
import { categoriesByGender, optionLabels, products } from "../pages/Home";
import slugify from "slugify";
import Fuse from "fuse.js";

export interface HeaderProps {
  showSection: (section: string) => void;
}

const Header: React.FC<HeaderProps> = ({ showSection }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [keyword, setKeyword] = useState("");
  const [showResults, setShowResults] = useState(false);
  const navigate = useNavigate();
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const checkUser = () => {
      const storedUser = localStorage.getItem("loggedInUser");
      if (storedUser) {
        try {
          const user = JSON.parse(storedUser);
          setIsAdmin(user.role === "ADMIN");
        } catch (err) {
          console.error("Error parsing loggedInUser:", err);
        }
      } else {
        setIsAdmin(false);
      }
    };

    checkUser();
    window.addEventListener("userLoggedIn", checkUser);

    return () => {
      window.removeEventListener("userLoggedIn", checkUser);
    };
  }, []);

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

  const fuseData = products.map(p => ({
    ...p,
    searchText: [
      // EN
      p.category.name,
      p.gender,
      ...p.colorAndSizes.map(c => c.color),
      // AZ
      optionLabels[p.gender], // AZ gender
      categoriesByGender[p.gender].includes(optionLabels[p.category.name])
        ? optionLabels[p.category.name]
        : p.category.name,   // AZ category if exists, fallback EN
      ...p.colorAndSizes.map(c => optionLabels[c.color]) // AZ colors
    ].join(" ").toLowerCase()
  }));

  const fuse = new Fuse(fuseData, {
    keys: ["searchText"],
    threshold: 0.4
  });

  const filteredProducts = keyword
    ? fuse.search(keyword.toLowerCase()).map(res => res.item)
    : [];

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setKeyword(e.target.value.toLowerCase());
    setShowResults(e.target.value.length > 0);
  };

  const handleSearchFocus = () => {
    if (keyword.length > 0) {
      setShowResults(true);
    }
  };

  const handleResultClick = () => {
    setKeyword("");
    setShowResults(false);
  };

  return (
    <header className="px-6 py-4 bg-white sticky top-0 z-50">
      <div className="container mx-auto flex justify-between items-center gap-6">
        {/* Logo */}
        <Link to="/" className="shrink-0">
          <img
            src={logo}
            alt="second-hand-logo"
            className="w-[100px] h-[50px] lg:w-auto"
          />
        </Link>

        {/* Desktop search */}
        <div className="relative mx-4 hidden md:block" ref={searchRef}>

          <div className="relative">
            <input
              type="text"
              placeholder="Secondhand-də axtar"
              className="w-full lg:w-[444px] px-10 py-2 pl-10 border border-gray-400 rounded-lg outline-none focus:ring-1"
              value={keyword}
              onChange={handleSearch}
              onFocus={handleSearchFocus}
            />
            <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>

          {/* Search results*/}
          {showResults && filteredProducts.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white border rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto">
              <ul className="divide-y divide-gray-200">
                {filteredProducts.map((item) => (
                  <li key={item.id}>
                    <Link
                      to={`/${slugify(String(item.id), { lower: true })}`}
                      onClick={handleResultClick}
                      className="block px-4 py-3 hover:bg-gray-100 transition"
                    >
                      <div className="font-medium">
                        {optionLabels[item.category.name] || item.category.name}
                      </div>
                      <div className="text-sm text-gray-600">
                        {optionLabels[item.gender] || item.gender} -{" "}
                        {item.colorAndSizes
                          .map((cs) => optionLabels[cs.color] || cs.color)
                          .join(", ")}
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
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
      <div className={`fixed top-0 left-0 w-full h-full z-50 p-6 flex flex-col gap-4 md:hidden bg-[#f9fafb] text-black shadow-lg transform transition-transform duration-300 
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}
        style={{ pointerEvents: sidebarOpen ? "auto" : "none" }}
        ref={sidebarRef}
      >
        {/* Close button */}
        <button
          onClick={() => setSidebarOpen(false)}
          className="text-gray-500 flex justify-end hover:text-gray-700"
          aria-label="Close menu"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Logo */}
        <Link to="/" className="flex justify-center pb-4" onClick={() => setSidebarOpen(false)}>
          <img src={logo} alt="second-hand-logo" className="h-[60px] object-contain" />
        </Link>

        {/* Mobile search */}
        <div className="relative" ref={searchRef}>
          <div className="flex items-center border border-gray-400 text-gray-400 rounded-lg px-2 py-2 focus-within:ring-1 transition-all">
            <SearchIcon className="mr-2" />
            <input
              type="text"
              value={keyword}
              onChange={handleSearch}
              onFocus={handleSearchFocus}
              placeholder="Secondhand-də axtar"
              className="flex-1 bg-transparent outline-none text-sm"
            />
          </div>

          {/* Mobile search results dropdown */}
          {showResults && filteredProducts.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white border rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto">
              <ul className="divide-y divide-gray-200">
                {filteredProducts.map((item) => (
                  <li key={item.id}>
                    <Link
                      to={`/${slugify(String(item.id), { lower: true })}`}
                      onClick={() => {
                        handleResultClick();
                        setSidebarOpen(false);
                      }}
                      className="block px-4 py-3 hover:bg-gray-100 transition"
                    >
                      <div className="font-medium">
                        {optionLabels[item.category.name] || item.category.name}
                      </div>
                      <div className="text-sm text-gray-600">
                        {optionLabels[item.gender] || item.gender} -{" "}
                        {item.colorAndSizes
                          .map((cs) => optionLabels[cs.color] || cs.color)
                          .join(", ")}
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <Link to="/" className="text-center border rounded-lg py-[6px] border-gray-400 text-gray-400 hover:border-black hover:text-black transition-all duration-500" onClick={() => handleNav("home")}>
          Ana Səhifə
        </Link>
        <Link to="/wishlist" className="text-center border rounded-lg py-[6px] hover:bg-black hover:text-white transition-all duration-500" onClick={() => handleNav("favorites")}>
          <FavoriteBorderOutlinedIcon /> Sevimlilər
        </Link>
        <Link to="/add-cloth" className="text-center border rounded-lg py-[6px] bg-black text-white hover:bg-white hover:text-black transition-all duration-500" onClick={() => handleNav("add-clothes")}>
          Məhsul Əlavə Et
        </Link>

        {isAdmin && (
          <>
            <Link to="/admin-panel" className="text-center border border-black bg-black text-white rounded-lg py-[6px] hover:bg-white hover:text-black transition-all duration-500" onClick={() => handleNav("admin-panel")}>
              Admin
            </Link>
            <button onClick={handleLogout} className="w-full text-center border rounded-lg py-[6px] text-red-500 border-red-500 hover:bg-red-500 hover:text-white transition-all duration-500">
              Logout
            </button>
          </>
        )}
      </div>
    </header>
  );
};

export default Header;