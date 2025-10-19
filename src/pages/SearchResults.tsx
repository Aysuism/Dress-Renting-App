import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Card from "../components/Card";
import { useGetCategoriesQuery } from "../tools/categories";
import { useGetSubcategoriesQuery } from "../tools/subCategory";
import { useFilterProductsQuery } from "../tools/homeFilter";

const SearchResults = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  
  const { data: categories = [] } = useGetCategoriesQuery([]);
  const { data: subcategories = [] } = useGetSubcategoriesQuery([]);

  const categoryName = searchParams.get('categoryName');
  const subcategoryName = searchParams.get('subcategoryName');
  const gender = searchParams.get('gender');

  const [categoryId, setCategoryId] = useState<string>("");
  const [subcategoryId, setSubcategoryId] = useState<string>("");
  const [genderValue, setGenderValue] = useState<string>("");

  useEffect(() => {
    if (categoryName) {
      const foundCategory = categories.find((cat: any) => 
        cat.name?.toLowerCase() === decodeURIComponent(categoryName).toLowerCase()
      );
      setCategoryId(foundCategory ? String(foundCategory.id) : "");
    }

    if (subcategoryName) {
      const foundSubcategory = subcategories.find((sub: any) => 
        sub.name?.toLowerCase() === decodeURIComponent(subcategoryName).toLowerCase()
      );
      setSubcategoryId(foundSubcategory ? String(foundSubcategory.id) : "");
    }

    if (gender) {
      const genderMap: { [key: string]: string } = {
        "MAN": "MAN",
        "WOMAN": "WOMAN", 
        "KID": "KID",
        "Kişi": "MAN",
        "Qadın": "WOMAN",
        "Uşaq": "KID"
      };
      setGenderValue(genderMap[gender] || "");
    }
  }, [categoryName, subcategoryName, gender, categories, subcategories]);

  const { data: filteredProducts = [], isLoading } = useFilterProductsQuery(
    {
      gender: genderValue,
      categoryId: categoryId ? Number(categoryId) : undefined,
      subcategoryId: subcategoryId ? Number(subcategoryId) : undefined,
    },
    {
      skip: !genderValue && !categoryId && !subcategoryId,
    }
  );

  return (
    <div className="flex flex-col py-10">
      <h1 className="text-2xl font-bold mb-6">
        {subcategoryName 
          ? `"${decodeURIComponent(subcategoryName)}" məhsulları` 
          : categoryName 
            ? `"${decodeURIComponent(categoryName)}" kateqoriyası`
            : "Axtarış nəticələri"
        }
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          <div className="col-span-full text-center text-gray-500 text-lg py-20">
            Loading...
          </div>
        ) : filteredProducts.length > 0 ? (
          filteredProducts.map((item: any) => <Card key={item.productCode} clothes={item} />)
        ) : (
          <div className="col-span-full text-center text-gray-500 text-lg py-20">
            Heç bir məhsul tapılmadı 😕
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchResults;