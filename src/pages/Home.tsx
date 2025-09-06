import { useState, useMemo } from "react";
import Card from "../components/Card";
import SelectButton, { type Option } from "../components/SelectButton";
import { COLORS } from "./ProductDetails";

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
  offerTypes: [
    { id: 1, name: "Kirayə" },
    { id: 2, name: "Satış" },
  ]
};

// Interface to match your filters
interface HomeFilters {
  category: Option | null;
  size: Option | null;
  gender: Option | null;
  color: Option | null;
  offerType: Option | null;
  minPrice: number | "";
  maxPrice: number | "";
}

const Home = () => {
  const products = [
    {
      id: "1",
      category: { id: 1, name: "Don" },
      gender: { id: 1, name: "Qadın" },
      offerType: { id: 1, name: "Kirayə" },
      condition: { id: 1, name: "FIRST_HAND" },
      colors: [{ id: 1, name: "Qara", hex: COLORS.find(c => c.name === "Qara")?.hex || "#000000" }],
      sizes: ["S", "M"],
      price: 45,
      images: ["https://i.pinimg.com/736x/0c/4f/c6/0c4fc62d6d205d2ab33620bf4e590a15.jpg", "https://mauiofficial.com/img/p/4/2/6/0/4260.jpg"], // File array would be empty for demo
      rentDuration: 7,
      productCode: "P-001",
      name: "Aysu",
      surname: "Ismayilzade",
      email: "aysu@example.com",
      phone: "0511234567",
      status: "APPROVED"
    },
    {
      id: "2",
      category: { id: 2, name: "Kostyum" },
      gender: { id: 2, name: "Kişi" },
      offerType: { id: 1, name: "Kirayə" },
      condition: { id: 2, name: "SECOND_HAND" },
      colors: [
        { id: 5, name: "Ağ", hex: COLORS.find(c => c.name === "Ağ")?.hex || "#FFFFFF" },
        { id: 2, name: "Mavi", hex: COLORS.find(c => c.name === "Mavi")?.hex || "#0000FF" }
      ],
      sizes: ["M", "L", "XL"],
      price: 85,
      images: ["https://i.pinimg.com/736x/0c/4f/c6/0c4fc62d6d205d2ab33620bf4e590a15.jpg", "https://mauiofficial.com/img/p/4/2/6/0/4260.jpg"],
      rentDuration: 5,
      productCode: "P-002",
      name: "Ali",
      surname: "Hüseynov",
      email: "ali@example.com",
      phone: "0511234568",
      status: "APPROVED"
    },
    {
      id: "3",
      category: { id: 1, name: "Don" },
      gender: { id: 1, name: "Qadın" },
      offerType: { id: 2, name: "Satış" },
      condition: { id: 1, name: "FIRST_HAND" },
      colors: [
        { id: 5, name: "Ağ", hex: COLORS.find(c => c.name === "Ağ")?.hex || "#FFFFFF" },
        { id: 2, name: "Mavi", hex: COLORS.find(c => c.name === "Mavi")?.hex || "#0000FF" }
      ],
      sizes: ["XS", "S", "M"],
      price: 120,
      images: ["https://i.pinimg.com/736x/0c/4f/c6/0c4fc62d6d205d2ab33620bf4e590a15.jpg", "https://mauiofficial.com/img/p/4/2/6/0/4260.jpg"],
      rentDuration: 1, // Not used for sale but kept for structure
      productCode: "P-003",
      name: "Leyla",
      surname: "Quliyeva",
      email: "leyla@example.com",
      phone: "0511234569",
      status: "APPROVED"
    },
    {
      id: "4",
      category: { id: 1, name: "Don" },
      gender: { id: 2, name: "Kişi" },
      offerType: { id: 2, name: "Satış" },
      condition: { id: 2, name: "SECOND_HAND" },
      colors: [
        { id: 5, name: "Ağ", hex: COLORS.find(c => c.name === "Ağ")?.hex || "#FFFFFF" },
        { id: 2, name: "Mavi", hex: COLORS.find(c => c.name === "Mavi")?.hex || "#0000FF" }
      ],
      sizes: ["L", "XL", "XXL"],
      price: 55,
      images: ["https://i.pinimg.com/736x/0c/4f/c6/0c4fc62d6d205d2ab33620bf4e590a15.jpg", "https://mauiofficial.com/img/p/4/2/6/0/4260.jpg"],
      rentDuration: 1,
      productCode: "P-004",
      name: "Nermin",
      surname: "Memmedova",
      email: "nermin@example.com",
      phone: "0511234570",
      status: "APPROVED"
    },
    {
      id: "5",
      category: { id: 1, name: "Don" },
      gender: { id: 3, name: "Uşaq" },
      offerType: { id: 1, name: "Kirayə" },
      condition: { id: 1, name: "FIRST_HAND" },
      colors: [
        { id: 5, name: "Ağ", hex: COLORS.find(c => c.name === "Ağ")?.hex || "#FFFFFF" },
        { id: 2, name: "Mavi", hex: COLORS.find(c => c.name === "Mavi")?.hex || "#0000FF" }
      ],
      sizes: ["S", "M"],
      price: 25,
      images: ["https://i.pinimg.com/736x/0c/4f/c6/0c4fc62d6d205d2ab33620bf4e590a15.jpg", "https://mauiofficial.com/img/p/4/2/6/0/4260.jpg"],
      rentDuration: 3,
      productCode: "P-005",
      name: "Emil",
      surname: "Ceferov",
      email: "emil@example.com",
      phone: "0511234571",
      status: "APPROVED"
    },
    {
      id: "6",
      category: { id: 2, name: "Kostyum" },
      gender: { id: 1, name: "Qadın" },
      offerType: { id: 1, name: "Kirayə" },
      condition: { id: 1, name: "FIRST_HAND" },
      colors: [
        { id: 5, name: "Ağ", hex: COLORS.find(c => c.name === "Ağ")?.hex || "#FFFFFF" },
        { id: 2, name: "Mavi", hex: COLORS.find(c => c.name === "Mavi")?.hex || "#0000FF" }
      ],
      sizes: ["M", "L"],
      price: 95,
      images: ["https://i.pinimg.com/736x/0c/4f/c6/0c4fc62d6d205d2ab33620bf4e590a15.jpg", "https://mauiofficial.com/img/p/4/2/6/0/4260.jpg"],
      rentDuration: 10,
      productCode: "P-006",
      name: "Günay",
      surname: "Rzayeva",
      email: "gunay@example.com",
      phone: "0511234572",
      status: "APPROVED"
    },
    {
      id: "7",
      category: { id: 1, name: "Don" },
      gender: { id: 2, name: "Kişi" },
      offerType: { id: 2, name: "Satış" },
      condition: { id: 2, name: "SECOND_HAND" },
      colors: [
        { id: 5, name: "Ağ", hex: COLORS.find(c => c.name === "Ağ")?.hex || "#FFFFFF" },
        { id: 2, name: "Mavi", hex: COLORS.find(c => c.name === "Mavi")?.hex || "#0000FF" }
      ],
      sizes: ["XL", "XXL"],
      price: 75,
      images: ["https://i.pinimg.com/736x/0c/4f/c6/0c4fc62d6d205d2ab33620bf4e590a15.jpg", "https://mauiofficial.com/img/p/4/2/6/0/4260.jpg"],
      rentDuration: 1,
      productCode: "P-007",
      name: "Orxan",
      surname: "Veliyev",
      email: "orxan@example.com",
      phone: "0511234573",
      status: "APPROVED"
    },
    {
      id: "8",
      category: { id: 1, name: "Don" },
      gender: { id: 1, name: "Qadın" },
      offerType: { id: 1, name: "Kirayə" },
      condition: { id: 1, name: "FIRST_HAND" },
      colors: [
        { id: 5, name: "Ağ", hex: COLORS.find(c => c.name === "Ağ")?.hex || "#FFFFFF" },
        { id: 2, name: "Mavi", hex: COLORS.find(c => c.name === "Mavi")?.hex || "#0000FF" }
      ],
      sizes: ["S", "M", "L"],
      price: 38,
      images: ["https://i.pinimg.com/736x/0c/4f/c6/0c4fc62d6d205d2ab33620bf4e590a15.jpg", "https://mauiofficial.com/img/p/4/2/6/0/4260.jpg"],
      rentDuration: 7,
      productCode: "P-008",
      name: "Sevinc",
      surname: "Eliyeva",
      email: "sevinc@example.com",
      phone: "0511234574",
      status: "APPROVED"
    }
  ];

  const [filters, setFilters] = useState<HomeFilters>({
    category: null,
    size: null,
    gender: null,
    color: null,
    offerType: null,
    minPrice: "",
    maxPrice: "",
  });

  const handleChange = (field: keyof HomeFilters, value: HomeFilters[keyof HomeFilters]) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
  };

  const filteredProducts = useMemo(() => {
    if (!products || products.length === 0) return [];

    return products.filter((item) => {
      const categoryMatch = !filters.category || item.category.name === filters.category.name;
      const genderMatch = !filters.gender || item.gender.name === filters.gender.name;
      const sizeMatch = !filters.size || item.sizes.includes(filters.size.name);
      const offerMatch = !filters.offerType || item.offerType.name === filters.offerType.name;
      const colorMatch =
        !filters.color || item.colors.some((c) => c.name === filters.color?.name);
      const minPriceMatch = filters.minPrice === "" || item.price >= filters.minPrice;
      const maxPriceMatch = filters.maxPrice === "" || item.price <= filters.maxPrice;

      return categoryMatch && genderMatch && sizeMatch && offerMatch && colorMatch && minPriceMatch && maxPriceMatch;
    });
  }, [products, filters]);

  return (
    <div className="min-h-screen flex flex-col pb-10">
      <h2 className="text-center text-2xl font-bold my-10 text-[#8b5cf6]">
        Kirayə və Satış Üçün Geyimlər
      </h2>

      {/* Filters */}
      <div className="mb-8 bg-white p-6 rounded-xl shadow-md">
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-5 lg:grid-cols-7 gap-4">
          <SelectButton
            label="Status"
            selected={filters.offerType}
            setSelected={(v) => handleChange("offerType", v)}
            options={options.offerTypes}
          />
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
          <div className="col-span-2 md:col-span-5 lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="flex flex-col">
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
                className="p-2 border-2 border-gray-200 rounded-lg focus:border-purple-500 w-full"
              />
            </div>

            <div className="flex flex-col">
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
                className="p-2 border-2 border-gray-200 rounded-lg focus:border-purple-500 w-full"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((item) => (
            <Card
              key={item.id}
              clothes={{ ...item, id: Number(item.id) }}
            />
          ))
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
