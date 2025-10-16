import { useState, useEffect } from "react";
import Card from "../components/Card";
import SelectButton from "../components/SelectButton";
import { useGetProductsQuery } from "../tools/product";

// Manual gender options
const genders = [
  { id: "0", name: "Cins", value: "" },
  { id: "1", name: "Kişi", value: "MAN" },
  { id: "2", name: "Qadın", value: "WOMAN" },
  { id: "3", name: "Uşaq", value: "KID" },
];

// Map gender values to categoryIds for subcategories
const genderToCategoryMap: { [key: string]: string } = {
  "MAN": "1",
  "WOMAN": "2",
  "KID": "3"
};

// Manual subcategories mapped to gender id
const subcategories = [
  { id: 0, name: "Kateqoriya", value: "" },
  { id: 1, name: "Gəlinlik", categoryId: "1" },
  { id: 3, name: "Don", categoryId: "1" },
  { id: 4, name: "Köynək", categoryId: "1" },
  { id: 5, name: "Bluz", categoryId: "1" },
  { id: 6, name: "Şalvar", categoryId: "1" },
  { id: 7, name: "Kostyum", categoryId: "2" },
  { id: 8, name: "Ayaqqabı", categoryId: "2" },
  { id: 9, name: "Aksesuar", categoryId: "2" },
  { id: 2, name: "Ziyafət geyimi", categoryId: "1" },
  { id: 11, name: "Uşaqlar üçün don", categoryId: "3" },
  { id: 13, name: "Uşaqlar üçün ayaqqabı", categoryId: "3" },
  { id: 14, name: "Uşaqlar üçün aksesuar", categoryId: "3" },
  { id: 12, name: "Uşaqlar üçün kostyum", categoryId: "3" },
];

// Static options for filters
const sizes = [
  { id: "0", name: "Ölçü", value: "" },
  { id: "1", name: "XS", value: "XS" },
  { id: "2", name: "S", value: "S" },
  { id: "3", name: "M", value: "M" },
  { id: "4", name: "L", value: "L" },
  { id: "5", name: "XL", value: "XL" },
  { id: "6", name: "XXL", value: "XXL" },
];

const colors = [
  { id: "0", name: "Rəng", value: "" },
  { id: "1", name: "Qırmızı", value: "RED" },
  { id: "2", name: "Yaşıl", value: "GREEN" },
  { id: "3", name: "Mavi", value: "BLUE" },
  { id: "4", name: "Sarı", value: "YELLOW" },
  { id: "5", name: "Qara", value: "BLACK" },
  { id: "6", name: "Ağ", value: "WHITE" },
  { id: "7", name: "Narıncı", value: "ORANGE" },
  { id: "8", name: "Bənövşəyi", value: "PURPLE" },
  { id: "9", name: "Çəhrayı", value: "PINK" },
  { id: "10", name: "Qəhvəyi", value: "BROWN" },
  { id: "11", name: "Boz", value: "GRAY" },
  { id: "12", name: "Bej", value: "BEIGE" },
];

const offerTypes = [
  { id: "0", name: "İstifadə forması", value: "" },
  { id: "1", name: "İcarə", value: "RENT" },
  { id: "2", name: "Satış", value: "SALE" },
];

const productConditions = [
  { id: "0", name: "Vəziyyət", value: "" },
  { id: "1", name: "Birinci əl", value: "FIRST_HAND" },
  { id: "2", name: "İkinci əl", value: "SECOND_HAND" },
];

const Home = () => {
  const { data: products = [] } = useGetProductsQuery([]);

  const [filters, setFilters] = useState({
    gender: "",
    subcategoryId: "",
    size: "",
    color: "",
    offerType: "",
    condition: "",
    minPrice: "",
    maxPrice: "",
  });

  const [filteredProducts, setFilteredProducts] = useState<any[]>([]);

  const handleChange = (field: string, value: string | number) => {
    setFilters((prev) => ({
      ...prev,
      [field]: value,
      ...(field === "gender" ? { subcategoryId: "" } : {}),
    }));
  };

  const filteredSubcategories = [
    { id: "0", name: "Kateqoriya", value: "" },
    ...subcategories
      .filter((sc) => {
        if (!filters.gender) return true; // Show all if no gender selected
        const mappedCategoryId = genderToCategoryMap[filters.gender];
        return sc.categoryId === mappedCategoryId;
      })
      .map((sc) => ({
        id: sc.id.toString(),
        name: sc.name,
        value: sc.id.toString()
      })),
  ];

  useEffect(() => {
    let temp = [...products];

    if (filters.gender) {
      temp = temp.filter((p) => p.gender === filters.gender);
    }

    if (filters.subcategoryId) {
      temp = temp.filter((p) => p.subcategoryId === Number(filters.subcategoryId));
    }
  if (filters.size) {
    temp = temp.filter((p) =>
      p.colorAndSizes.some((cs: any) => {
        // Split the size string by commas and check if the selected size exists
        const availableSizes = cs.size.split(',').map((s: string) => s.trim());
        return availableSizes.includes(filters.size);
      })
    );
  }

    if (filters.color) {
      temp = temp.filter((p) =>
        p.colorAndSizes.some((cs: any) => cs.color === filters.color)
      );
    }

    // If both size and color are selected, we should match objects with BOTH
    if (filters.size && filters.color) {
      temp = temp.filter((p) =>
        p.colorAndSizes.some(
          (cs: any) => cs.size === filters.size && cs.color === filters.color
        )
      );
    }

    if (filters.offerType) {
      temp = temp.filter((p) =>
        p.offers.some((o: any) => o.offerType === filters.offerType)
      );
    }

    if (filters.condition) {
      temp = temp.filter((p) =>
        p.offers.some((o: any) => o.productCondition === filters.condition)
      );
    }

    if (filters.minPrice !== "") temp = temp.filter((p) => p.price >= Number(filters.minPrice));
    if (filters.maxPrice !== "") temp = temp.filter((p) => p.price <= Number(filters.maxPrice));

    setFilteredProducts(temp);
  }, [filters, products]);


  return (
    <div className="flex flex-col py-10">
      {/* Filters */}
      {/* <div className="mb-8 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
        <SelectButton
          selected={filters.gender}
          setSelected={(v) => handleChange("gender", v)}
          options={genders}
        />

        <SelectButton
          selected={filters.subcategoryId}
          setSelected={(v) => handleChange("subcategoryId", v)}
          options={filteredSubcategories}
        />

        <SelectButton
          selected={filters.size}
          setSelected={(v) => handleChange("size", v)}
          options={sizes}
        />

        <SelectButton
          selected={filters.color}
          setSelected={(v) => handleChange("color", v)}
          options={colors}
        />

        <SelectButton
          selected={filters.offerType}
          setSelected={(v) => handleChange("offerType", v)}
          options={offerTypes}
        />

        <SelectButton
          selected={filters.condition}
          setSelected={(v) => handleChange("condition", v)}
          options={productConditions}
        />

        <input
          type="number"
          placeholder="Min Qiymət"
          value={filters.minPrice}
          onChange={(e) =>
            handleChange("minPrice", e.target.value === "" ? "" : Number(e.target.value))
          }
          className="p-2 bg-white border border-gray-300 rounded-lg"
        />

        <input
          type="number"
          placeholder="Maks Qiymət"
          value={filters.maxPrice}
          onChange={(e) =>
            handleChange("maxPrice", e.target.value === "" ? "" : Number(e.target.value))
          }
          className="p-2 bg-white border border-gray-300 rounded-lg"
        />
      </div> */}

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((item) => <Card key={item.productCode} clothes={item} />)
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