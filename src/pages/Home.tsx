import { useState, useMemo } from "react";
import Card from "../components/Card";
import SelectButton, { MultiSelectButton } from "../components/SelectButton";
import { type Product, type Option } from "../tools/types";
import img from "../assets/img/jacket.jpg";

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

export const products: Product[] = [
  {
    id: 1,
    productCode: "P-001",
    category: { id: 11, name: "Don" },
    subcategoryId: 11,
    price: 75,
    gender: "WOMAN",
    user: {
      id: 101,
      name: "Aysu",
      surname: "Ismayilzade",
      email: "aysu@example.com",
      phone: "+994511234567",
      userRole: "USER",
    },
    colorAndSizes: [
      {
        id: 201,
        color: "BLACK",
        photoCount: 2,
        stock: 5,
        imageUrls: [img],
        sizeStockMap: { S: 2, M: 2, L: 1 },
      },
    ],
    createdAt: "2025-09-11T12:00:00Z",
    offers: [
      { id: 302, offerTypes: "SALE", price: 120, productCondition: "FIRST_HAND" },
    ],
    status: "ACTIVE",
  },
  {
    id: 2,
    productCode: "P-002",
    category: { id: 12, name: "Kostyum" },
    subcategoryId: 12,
    price: 60,
    gender: "MAN",
    user: {
      id: 102,
      name: "Ali",
      surname: "Hüseynov",
      email: "ali@example.com",
      phone: "+994501112233",
      userRole: "USER",
    },
    colorAndSizes: [
      {
        id: 203,
        color: "BLUE",
        photoCount: 1,
        stock: 4,
        imageUrls: [img],
        sizeStockMap: { M: 2, L: 2 },
      },
    ],
    createdAt: "2025-09-09T09:00:00Z",
    offers: [
      { id: 303, offerTypes: "RENT", price: 20, rentDuration: 5, productCondition: "SECOND_HAND" },
    ],
    status: "ACTIVE",
  },
];

const Home = () => {
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
    if (field === "gender") setFilters((prev) => ({ ...prev, category: null })); // reset category on gender change
  };

  // Filter logic
  const filteredProducts = useMemo(() => {
    return products
      .filter(p => p.status === "ACTIVE")
      .filter(item => {
        const genderMatch = !filters.gender || item.gender === filters.gender.value;
        const categoryMatch = !filters.category || item.category.name === filters.category.value;
        const sizeMatch = !filters.size || item.colorAndSizes.some(cs => cs.sizeStockMap.hasOwnProperty(filters.size!.name));
        const offerMatch = !filters.offerTypes || item.offers.some(o => o.offerTypes === filters.offerTypes!.value);
        const colorMatch = filters.color.length === 0 ||
          item.colorAndSizes.some(cs =>
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
          options={[{ id: 0, name: "Rəng" },...options.colors
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
          filteredProducts.map((item) => <Card key={item.id} clothes={item} />)
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