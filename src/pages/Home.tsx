import { useState, useMemo } from "react";
import Card from "../components/Card";
import SelectButton, { MultiSelectButton } from "../components/SelectButton";
import { type Option } from "../tools/types";
import { useGetProductsQuery } from "../tools/product";

//-----------------Filter Options----------------------
export const categoriesByGender: Record<string, string[]> = {
  WOMAN: [
    "Gəlinlik", "Ziyafət geyimi", "Don", "Köynək", "Bluz", "Şalvar", "Ətək",
    "Şort", "Gödəkcə", "Palto", "Ayaqqabı", "Çanta", "Aksesuar", "Digər",
  ],
  MAN: ["Kostyum", "Ayaqqabı", "Aksesuar", "Digər"],
  KID: ["Don", "Kostyum", "Ayaqqabı", "Aksesuar", "Digər"],
};

export const options = {
  sizes: [
    { id: 1, name: "S" }, { id: 2, name: "M" }, { id: 3, name: "L" },
    { id: 4, name: "XL" }, { id: 5, name: "XXL" },
  ],
  genders: [
    { id: 1, name: "WOMAN" }, { id: 2, name: "MAN" }, { id: 3, name: "KID" },
  ],
  colors: [
    { id: 1, name: "RED" }, { id: 2, name: "GREEN" }, { id: 3, name: "BLUE" },
    { id: 4, name: "YELLOW" }, { id: 5, name: "BLACK" }, { id: 6, name: "WHITE" },
    { id: 7, name: "ORANGE" }, { id: 8, name: "PURPLE" }, { id: 9, name: "PINK" },
  ],
  offerTypes: [
    { id: 1, name: "RENT" },
    { id: 2, name: "SALE" },
  ],
  conditions: [
    { id: 1, name: "FIRST_HAND" },
    { id: 2, name: "SECOND_HAND" },
  ]
};


export const optionLabels: Record<string, string> = {
  RENT: "İcarə",
  SALE: "Satış",
  WOMAN: "Qadın",
  MAN: "Kişi",
  KID: "Uşaq",
  RED: "Qırmızı",
  GREEN: "Yaşıl",
  BLUE: "Mavi",
  YELLOW: "Sarı",
  BLACK: "Qara",
  WHITE: "Ağ",
  ORANGE: "Narıncı",
  PURPLE: "Bənövşəyi",
  PINK: "Çəhrayı",
  FIRST_HAND: "Birinci əl",
  SECOND_HAND: "İkinci əl",
};

//-----------------Filter State----------------------
interface HomeFilters {
  gender: Option | null;
  category: Option | null;
  size: Option | null;
  color: Option[];
  offerTypes: Option | null;
  minPrice: number | "";
  maxPrice: number | "";
}

const Home = () => {
  const { data: products = [] } = useGetProductsQuery([]);
  console.log(products);
  
  const [filters, setFilters] = useState<HomeFilters>({
    gender: null,
    category: null,
    size: null,
    color: [],
    offerTypes: null,
    minPrice: "",
    maxPrice: "",
  });

  const handleChange = (field: keyof HomeFilters, value: HomeFilters[keyof HomeFilters]) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
    if (field === "gender") setFilters((prev) => ({ ...prev, category: null }));
  };

  const filteredProducts = useMemo(() => {
    return products
      .filter((p: any) => p.status === "ACTIVE")
      .filter((item: any) => {
        const genderMatch = !filters.gender || item.gender === filters.gender.value;
        const categoryMatch = !filters.category || item.category.name === filters.category.value;
        const sizeMatch = !filters.size || item.colorAndSizes.some((cs:any) => cs.sizeStockMap.hasOwnProperty(filters.size!.name));
        const offerMatch = !filters.offerTypes || item.offers.some((o:any) => o.offerTypes === filters.offerTypes!.value);
        const colorMatch = filters.color.length === 0 ||
          item.colorAndSizes.some((cs:any) =>
            filters.color.some(filterColor => cs.color === filterColor.value)
          );
        const minPriceMatch = filters.minPrice === "" || item.price >= filters.minPrice;
        const maxPriceMatch = filters.maxPrice === "" || item.price <= filters.maxPrice;

        return genderMatch && categoryMatch && sizeMatch && offerMatch && colorMatch && minPriceMatch && maxPriceMatch;
      });
  }, [products, filters]);

  return (
    <div className="flex flex-col py-10">
      {/* Filters */}
      <div className="mb-8 flex flex-col lg:flex-row gap-4">
        {/* Offer Type */}
        <SelectButton
          selected={filters.offerTypes}
          setSelected={(v) => handleChange("offerTypes", v)}
          options={[{ id: 0, name: "İstifadə forması" }, ...options.offerTypes.map(o => ({ id: o.id, name: optionLabels[o.name], value: o.name }))]}
        />

        {/* Gender */}
        <SelectButton
          selected={filters.gender}
          setSelected={(v) => handleChange("gender", v)}
          options={[{ id: 0, name: "Cins" }, ...options.genders.map(o => ({ id: o.id, name: optionLabels[o.name], value: o.name }))]}
        />

        {/* Category */}
        {filters.gender && (
          <SelectButton
            selected={filters.category}
            setSelected={v => handleChange("category", v)}
            options={[
              { id: 0, name: "Kateqoriya" },
              ...categoriesByGender[filters.gender.value as keyof typeof categoriesByGender].map((name, idx) => ({
                id: idx + 1,
                name,
                value: name,
              }))
            ]}
          />
        )}

        {/* Size */}
        <SelectButton
          selected={filters.size}
          setSelected={(v) => handleChange("size", v)}
          options={[{ id: 0, name: "Ölçü" }, ...options.sizes]}
        />

        {/* Color */}
        <MultiSelectButton
          selected={filters.color}
          setSelected={(v) => handleChange("color", v)}
          options={[{ id: 0, name: "Rəng" }, ...options.colors
            .map(o => ({
              id: o.id,
              name: optionLabels[o.name] || o.name,
              value: o.name
            }))
          ]}
        />

        {/* Price */}
        <div className="md:min-w-[400px] grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col">
            <input
              type="number"
              placeholder="Min Qiymət"
              value={filters.minPrice}
              onChange={(e) => handleChange("minPrice", e.target.value === "" ? "" : Number(e.target.value))}
              className="p-2 bg-white border-1 border-gray-300 rounded-lg"
            />
          </div>
          <div className="flex flex-col">
            <input
              type="number"
              placeholder="Maks Qiymət"
              value={filters.maxPrice}
              onChange={(e) => handleChange("maxPrice", e.target.value === "" ? "" : Number(e.target.value))}
              className="p-2 bg-white border-1 border-gray-300 rounded-lg"
            />
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((item:any) => <Card key={item.id} clothes={item} />)
        ) : (
          <div className="col-span-full text-center text-gray-500 text-lg py-20">
            {products.length === 0 ? "Heç bir məhsul yoxdur" : "Heç bir məhsul tapılmadı 😕"}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;