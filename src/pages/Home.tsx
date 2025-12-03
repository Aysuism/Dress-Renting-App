import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import Card from "../components/Card";
import SelectButton from "../components/SelectButton";
import { colorOptions, conditionOptions, genderOptions, offerTypeOptions, sizeOptions } from "./AddCloth";
import { useGetCategoriesQuery } from "../tools/categories";
import { useFilterProductsQuery } from "../tools/homeFilter";
import type { Option } from "../tools/types";
import { useGetProductsQuery } from "../tools/product";
import Pagination from "../components/Pagination";
import { useGetSubcategoriesQuery } from "../tools/subCategory";
import { useGetBrandsQuery } from "../tools/brands";

const Home = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  // Read initial filter values from URL
  const [selectedSubcategory, setSelectedSubcategory] = useState(searchParams.get("subcategory") || "");
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get("category") || "");
  const [selectedBrand, setSelectedBrand] = useState(searchParams.get("brand") || "");
  const [selectedGender, setSelectedGender] = useState(searchParams.get("gender") || "");
  const [selectedColor, setSelectedColor] = useState(searchParams.get("color") || "");
  const [selectedSize, setSelectedSize] = useState(searchParams.get("size") || "");
  const [selectedProductCondition, setSelectedProductCondition] = useState(searchParams.get("condition") || "");
  const [selectedOffertype, setSelectedOffertype] = useState(searchParams.get("offertype") || "");
  const [minPrice, setMinPrice] = useState(searchParams.get("minPrice") || "");
  const [maxPrice, setMaxPrice] = useState(searchParams.get("maxPrice") || "");

  const { data: products = [] } = useGetProductsQuery([]);
  const { data: categories = [] } = useGetCategoriesQuery([]);
  const { data: subcategories = [] } = useGetSubcategoriesQuery([]);
  const { data: brands = [] } = useGetBrandsQuery([]);

  useEffect(() => {
    const params: Record<string, string> = {};
    if (selectedCategory) params.category = selectedCategory;
    if (selectedSubcategory) params.subcategory = selectedSubcategory;
    if (selectedGender) params.gender = selectedGender;
    if (selectedColor) params.color = selectedColor;
    if (selectedSize) params.size = selectedSize;
    if (selectedBrand) params.brand = selectedBrand;
    if (selectedProductCondition) params.condition = selectedProductCondition;
    if (selectedOffertype) params.offertype = selectedOffertype;
    if (minPrice) params.minPrice = minPrice;
    if (maxPrice) params.maxPrice = maxPrice;

    setSearchParams(params);
  }, [selectedCategory, selectedSubcategory, selectedGender, selectedColor, selectedSize, selectedBrand, selectedProductCondition, selectedOffertype, minPrice, maxPrice, setSearchParams]);

  useEffect(() => {
    setSelectedCategory("");
    setSelectedSize("");
  }, [selectedGender]);

  useEffect(() => {
    setSelectedSize("");
  }, [selectedCategory]);

  const { data: filteredProducts = [], isLoading } = useFilterProductsQuery(
    {
      categoryId: selectedCategory ? Number(selectedCategory) : undefined,
      subCategoryId: selectedSubcategory ? Number(selectedSubcategory) : undefined,
      brandId: selectedBrand ? Number(selectedBrand) : undefined,
      gender: selectedGender,
      color: selectedColor,
      sizes: selectedSize ? [selectedSize] : [],
      offerType: selectedOffertype,
      productCondition: selectedProductCondition,
      minPrice: minPrice ? Number(minPrice) : undefined,
      maxPrice: maxPrice ? Number(maxPrice) : undefined,
    },
    {
      skip:
        !selectedCategory &&
        !selectedSubcategory &&
        !selectedGender &&
        !selectedColor &&
        !selectedSize &&
        !selectedOffertype &&
        !selectedProductCondition &&
        !minPrice &&
        !maxPrice,
    }
  );

  let displayProducts = selectedCategory || selectedSubcategory || selectedGender || selectedColor || selectedSize || selectedOffertype || selectedProductCondition || minPrice || maxPrice
    ? filteredProducts
    : products;

  // ---------------- CATEGORY OPTIONS ----------------
  const categoryOptions: Option[] = categories.map((cat: any) => ({
    id: String(cat.id),
    name: cat.name,
    value: String(cat.id),
  }));

  // ---------------- SUBCATEGORY OPTIONS ----------------
  const subcategoryOptions: Option[] = subcategories
    .filter((sub: any) => {
      const matchCategory = selectedCategory
        ? String(sub.category.id) === selectedCategory
        : true;

      const matchGender = selectedGender
        ? sub.genders?.includes(selectedGender)
        : true;

      return matchCategory && matchGender;
    })
    .map((sub: any) => ({
      id: String(sub.id),
      name: sub.name,
      value: String(sub.id),
    }));

  // ---------------- SELECTED SUBCATEGORY DATA ----------------
  const selectedSubcategoryData = subcategories.find(
    (c: any) => String(c.id) === selectedSubcategory
  );

  // ---------------- SELECTED CATEGORY DATA ----------------
  const selectedCategoryData = categories.find(
    (c: any) => String(c.id) === selectedCategory
  );

  const dynamicSizeOptions: Option[] = (() => {
    // Determine category name from either selectedCategory or subcategory
    const categoryName = selectedSubcategoryData?.category?.name || selectedCategoryData?.name;

    if (!categoryName) return [];

    // ACCESSORIES → no size
    if (categoryName === "Aksesuar") return [];

    // SHOES → return sizes where category = "Ayaqqabı"
    if (categoryName === "Ayaqqabı") {
      return sizeOptions
        .filter((s: any) => s.category === "Ayaqqabı")
        .map((s: any) => ({ id: s.id, name: s.name, value: s.value }));
    }

    // OTHER CLOTHING → sizes without category
    return sizeOptions
      .filter((s: any) => !s.category)
      .map((s: any) => ({ id: s.id, name: s.name, value: s.value }));
  })();

  //-----------------Pagination
  const [currentPage, setCurrentPage] = useState<number>(1);
  const cardsPerPage = 12;
  const indexOfLast = currentPage * cardsPerPage;
  const indexOfFirst = indexOfLast - cardsPerPage;
  const sortedProducts = [...displayProducts].sort((a, b) =>
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  const currentProducts = sortedProducts.slice(indexOfFirst, indexOfLast);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="flex flex-col py-10">
      {/* Filters */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-2 py-3">
        <SelectButton options={genderOptions} selected={selectedGender} setSelected={setSelectedGender} default="Cins" />
        <SelectButton options={categoryOptions} selected={selectedCategory} setSelected={setSelectedCategory} default="Kateqoriya" />
        <SelectButton options={subcategoryOptions} selected={selectedSubcategory} setSelected={setSelectedSubcategory} default="Alt kateqoriya" />
        <SelectButton options={brands.map((b: any) => ({
          id: String(b.id),
          name: b.name,
          value: String(b.id),
        }))} selected={selectedBrand} setSelected={setSelectedBrand} default="Brend" />
        <SelectButton options={colorOptions} selected={selectedColor} setSelected={setSelectedColor} default="Rəng" />
        <SelectButton options={dynamicSizeOptions} selected={selectedSize} setSelected={setSelectedSize} default="Ölçü" />
        <SelectButton options={conditionOptions} selected={selectedProductCondition} setSelected={setSelectedProductCondition} default="Məhsul vəziyyəti" />
        <SelectButton options={offerTypeOptions} selected={selectedOffertype} setSelected={setSelectedOffertype} default="İstifadə forması" />

        <input
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          className="w-full h-[50px] flex justify-between items-center px-4 py-2.5 border border-gray-300 rounded-lg bg-white text-gray-700 text-sm font-medium"
          placeholder="Min Price"
          value={minPrice}
          onChange={(e) => setMinPrice(e.target.value.replace(/\D/g, ''))}
        />
        <input
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          className="w-full h-[50px] flex justify-between items-center px-4 py-2.5 border border-gray-300 rounded-lg bg-white text-gray-700 text-sm font-medium"
          placeholder="Max Price"
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value.replace(/\D/g, ''))}
        />
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          <div className="col-span-full text-center text-gray-500 text-lg py-20">
            Loading...
          </div>
        ) : currentProducts?.length > 0 ? (
          [...currentProducts].map((item: any) => <Card key={item.productCode} clothes={item} />)
        ) : (
          <div className="col-span-full text-center text-gray-500 text-lg py-20">
            Heç bir məhsul tapılmadı 😕
          </div>
        )}
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-center w-full mt-8">
        <Pagination
          currentPage={currentPage}
          totalPages={Math.ceil(displayProducts.length / cardsPerPage)}
          onPageChange={handlePageChange}
        />
      </div>
    </div>
  );
};

export default Home;