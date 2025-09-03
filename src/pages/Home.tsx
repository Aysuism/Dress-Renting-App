import { useState, useMemo } from "react";
import Card, { type Clothes } from "../components/Card";
import SelectButton, { type Option } from "../components/SelectButton";
import { useGetClothesQuery } from "../tools/product";

//-----------------Filter Options----------------------
export const options = {
  categories: [
    { id: 1, name: "Don" },
    { id: 2, name: "Kostyum" },
  ],
  size: [
    { id: 1, name: "S" },
    { id: 2, name: "M" },
    { id: 3, name: "L" },
    { id: 4, name: "XL" },
    { id: 5, name: "XXL" },
  ],
  genders: [
    { id: 1, name: "Qadın" },
    { id: 2, name: "Kişi" },
    { id: 3, name: "Uşaq" },
  ],
  colors: [
    { id: 1, name: "Qırmızı" },
    { id: 2, name: "Mavi" },
    { id: 3, name: "Yaşıl" },
    { id: 4, name: "Qara" },
    { id: 5, name: "Ağ" },
    { id: 6, name: "Çəhrayı" },
    { id: 7, name: "Bənövşəyi" },
  ],
};

const Home = () => {
  // Add default filter parameters like in your Check component
  const { data: products } = useGetClothesQuery({
    offerType: "RENT",
    productCondition: "FIRST_HAND"
  }) as { data: Clothes[] | undefined };
  
  console.log(products);

  const [filters, setFilters] = useState({
    category: null as Option | null,
    size: null as Option | null,
    gender: null as Option | null,
    color: null as Option | null,
    minPrice: "" as number | "",
    maxPrice: "" as number | "",
  });

  const handleChange = (field: keyof typeof filters, value: any) =>
    setFilters((prev) => ({ ...prev, [field]: value }));

  const filteredProducts = useMemo(() => {
    if (!products) return [];

    return products.filter((item: Clothes) => {
      // Parse JSON fields if they exist and are strings
      try {
        const category = typeof item.category === 'string' 
          ? JSON.parse(item.category)?.name 
          : item.category?.name;
        
        const gender = typeof item.gender === 'string' 
          ? JSON.parse(item.gender)?.name 
          : item.gender?.name;
        
        const colors = typeof item.color === 'string' 
          ? JSON.parse(item.color)?.name 
          : item.color?.name;
        
        const sizes = typeof item.size === 'string' 
          ? JSON.parse(item.size) 
          : item.size;

        return (
          (!filters.category || category === filters.category.name) &&
          (!filters.size || sizes?.includes(filters.size.name)) &&
          (!filters.gender || gender === filters.gender.name) &&
          (!filters.color || colors?.includes(filters.color.name)) &&
          (filters.minPrice === "" || item.price >= filters.minPrice) &&
          (filters.maxPrice === "" || item.price <= filters.maxPrice)
        );
      } catch (error) {
        console.error("Error parsing product data:", error);
        return false;
      }
    });
  }, [products, filters]);

  return (
    <div className="min-h-screen flex flex-col">
      <h2 className="text-center text-2xl font-bold my-10 text-[#8b5cf6]">
        Kirayə Üçün Geyimlər
      </h2>

      {/* Filters */}
      <div className="mb-8 bg-white p-6 rounded-xl shadow-md">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          <SelectButton
            label="Kateqoriya"
            selected={filters.category}
            setSelected={(v) => handleChange("category", v)}
            options={options.categories}
          />
          <SelectButton
            label="Ölçü"
            selected={filters.size}
            setSelected={(v) => handleChange("size", v)}
            options={options.size}
          />
          <SelectButton
            label="Cins"
            selected={filters.gender}
            setSelected={(v) => handleChange("gender", v)}
            options={options.genders}
          />
          <SelectButton
            label="Rəng"
            selected={filters.color}
            setSelected={(v) => handleChange("color", v)}
            options={options.colors}
          />

          <div className="flex flex-col md:col-span-2 lg:col-span-1">
            <label className="font-bold mb-1 text-gray-600">Min Qiymət</label>
            <input
              type="number"
              placeholder="0"
              value={filters.minPrice}
              onChange={(e) =>
                handleChange(
                  "minPrice",
                  e.target.value === "" ? "" : Number(e.target.value)
                )
              }
              className="p-2 border-2 border-gray-200 rounded-lg focus:border-purple-500"
            />
          </div>

          <div className="flex flex-col md:col-span-2 lg:col-span-1">
            <label className="font-bold mb-1 text-gray-600">Maks Qiymət</label>
            <input
              type="number"
              placeholder="1000"
              value={filters.maxPrice}
              onChange={(e) =>
                handleChange(
                  "maxPrice",
                  e.target.value === "" ? "" : Number(e.target.value)
                )
              }
              className="p-2 border-2 border-gray-200 rounded-lg focus:border-purple-500"
            />
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((item: Clothes) => (
            <Card
              key={item.id}
              clothes={item}
            />
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