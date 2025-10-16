import { useState } from "react";
import { useFilterProductsQuery, useGetByOfferTypeQuery } from "../tools/homeFilter";
import { useGetCategoriesQuery } from "../tools/categories";
import { useGetSubcategoriesQuery } from "../tools/subCategory";
import { colorOptions } from "./AddCloth";
import SelectButton from "../components/SelectButton";
import type { Option } from "../tools/types";

const sizeOptionsList: Option[] = [
  { id: "1", name: "XS", value: "XS" },
  { id: "2", name: "S", value: "S" },
  { id: "3", name: "M", value: "M" },
  { id: "4", name: "L", value: "L" },
  { id: "5", name: "XL", value: "XL" },
  { id: "6", name: "XXL", value: "XXL" },
];

const genderOptions: Option[] = [
  { id: "1", name: "WOMAN", value: "WOMAN" },
  { id: "2", name: "MAN", value: "MAN" },
  { id: "3", name: "KID", value: "KID" },
];

const Test = () => {
  const [selectedGender, setSelectedGender] = useState<Option | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<Option | null>(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState<Option | null>(null);
  const [selectedColor, setSelectedColor] = useState<Option | null>(null);
  const [selectedSize, setSelectedSize] = useState<Option | null>(null);
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  const { data: categories = [] } = useGetCategoriesQuery([]);
  const { data: subcategories = [] } = useGetSubcategoriesQuery([]);
  const { data: offerProducts = [], isLoading: loadingOffers } = useGetByOfferTypeQuery({
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
        .filter((sub: any) => String(sub.categoryId) === selectedCategory.id)
        .map((sub: any) => ({
          id: String(sub.id),
          name: sub.name,
          value: String(sub.id),
        }))
    : [];

  const handleCategoryChange = (category: Option | null) => {
    setSelectedCategory(category);
    setSelectedSubcategory(null);
  };

  const { data: filteredProducts = [], isLoading, error } = useFilterProductsQuery(
    {
      gender: selectedGender?.value,
      categoryId: selectedCategory ? Number(selectedCategory.value) : undefined,
      subcategoryId: selectedSubcategory ? Number(selectedSubcategory.value) : undefined,
      color: selectedColor?.value,
      size: selectedSize?.value,
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

  const displayProducts =
    selectedGender ||
    selectedCategory ||
    selectedSubcategory ||
    selectedColor ||
    selectedSize ||
    minPrice ||
    maxPrice
      ? filteredProducts
      : offerProducts;

  return (
    <div>
      <h3>Filter Products</h3>

      <div className="grid grid-cols-7 gap-3 p-3">
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
          type="number"
          className="form-control"
          placeholder="Min Price"
          value={minPrice}
          onChange={(e) => setMinPrice(e.target.value)}
        />
        <input
          type="number"
          className="form-control"
          placeholder="Max Price"
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value)}
        />
      </div>

      {/* Loading/Error */}
      {isLoading && <p>Loading filtered products...</p>}
      {loadingOffers && <p>Loading offers...</p>}
      {error && <p>Error fetching data.</p>}

      {/* Product List */}
      {!isLoading && displayProducts?.length > 0 ? (
        <ul className="list-group mt-3">
          {displayProducts.map((product: any, i: number) => (
            <li key={i} className="list-group-item">
              <strong>{product.productCode}</strong> — {product.description}
            </li>
          ))}
        </ul>
      ) : (
        !isLoading && <p>No products found.</p>
      )}
    </div>
  );
};

export default Test;