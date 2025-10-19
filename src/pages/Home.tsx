import { useState } from "react";
import Card from "../components/Card";
import SelectButton from "../components/SelectButton";
import { colorOptions } from "./AddCloth";
import { useGetCategoriesQuery } from "../tools/categories";
import { useGetSubcategoriesQuery } from "../tools/subCategory";
import { useFilterProductsQuery, useGetByOfferTypeQuery } from "../tools/homeFilter";
import type { Option } from "../tools/types";
import { useGetProductsQuery } from "../tools/product";

const sizeOptionsList: Option[] = [
  { id: "1", name: "XS", value: "XS" },
  { id: "2", name: "S", value: "S" },
  { id: "3", name: "M", value: "M" },
  { id: "4", name: "L", value: "L" },
  { id: "5", name: "XL", value: "XL" },
  { id: "6", name: "XXL", value: "XXL" },
];

export const genderOptions: Option[] = [
  { id: "1", name: "Qadın", value: "WOMAN" },
  { id: "2", name: "Kişi", value: "MAN" },
  { id: "3", name: "Uşaq", value: "KID" },
];

const Home = () => {
  const [selectedGender, setSelectedGender] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>("");
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  const { data: products = [] } = useGetProductsQuery([]);
  const { data: categories = [] } = useGetCategoriesQuery([]);
  const { data: subcategories = [] } = useGetSubcategoriesQuery([]);
  const { data: offerProducts = [] } = useGetByOfferTypeQuery({
    offerType: "SALE",
    productCondition: "SECOND_HAND",
  });

  const categoryOptions: Option[] = categories.map((cat: any) => ({
    id: String(cat.id),
    name: cat.name,
    value: String(cat.id),
  }));

  const filteredSubcategories: Option[] = selectedCategory
    ? subcategories
      .filter((sub: any) => String(sub.category.id) === selectedCategory)
      .map((sub: any) => ({
        id: String(sub.id),
        name: sub.name,
        value: String(sub.id),
      }))
    : subcategories.map((sub: any) => ({
      id: String(sub.id),
      name: sub.name,
      value: String(sub.id),
    }));


  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategory(categoryId);
    setSelectedSubcategory("");
  };

  const { data: filteredProducts = [], isLoading } = useFilterProductsQuery(
    {
      gender: selectedGender,
      categoryId: selectedCategory ? Number(selectedCategory) : undefined,
      subcategoryId: selectedSubcategory ? Number(selectedSubcategory) : undefined,
      color: selectedColor,
      size: selectedSize,
      minPrice: minPrice ? Number(minPrice) : undefined,
      maxPrice: maxPrice ? Number(maxPrice) : undefined,
    },
    {
      skip:
        !selectedGender &&
        !selectedCategory &&
        !selectedSubcategory &&
        !selectedColor &&
        !selectedSize &&
        !minPrice &&
        !maxPrice,
    }
  );

  const displayProducts = selectedGender || selectedCategory || selectedSubcategory || selectedColor || selectedSize || minPrice || maxPrice ? filteredProducts : products;

  return (
    <div className="flex flex-col py-10">
      {/* Filters */}

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-2 p-3">
        {/* Gender */}
        <SelectButton
          options={genderOptions}
          selected={selectedGender}
          setSelected={setSelectedGender}
          default="Cins"
        />

        {/* Category */}
        <SelectButton
          options={categoryOptions}
          selected={selectedCategory}
          setSelected={handleCategoryChange}
          default="Kateqoriya"
        />

        {/* Subcategory */}
        <SelectButton
          options={filteredSubcategories}
          selected={selectedSubcategory}
          setSelected={setSelectedSubcategory}
          default="Alt kateqoriya"
        />

        {/* Color */}
        <SelectButton
          options={colorOptions}
          selected={selectedColor}
          setSelected={setSelectedColor}
          default="Rəng"
        />

        {/* Size */}
        <SelectButton
          options={sizeOptionsList}
          selected={selectedSize}
          setSelected={setSelectedSize}
          default="Ölçü"
        />

        {/* Price Inputs */}
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
        ) : displayProducts?.length > 0 ? (
          displayProducts.map((item: any) => (
            <Card key={item.productCode} clothes={item} />
          ))
        ) : (
          <div className="col-span-full text-center text-gray-500 text-lg py-20">
            Heç bir məhsul tapılmadı 😕
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;