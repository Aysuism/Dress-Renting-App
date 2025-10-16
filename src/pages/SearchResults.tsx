import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Card from "../components/Card";
import { useGetProductsQuery } from "../tools/product";

const SearchResults = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const { data: products = [] } = useGetProductsQuery([]);
  const [filteredProducts, setFilteredProducts] = useState<any[]>([]);

  // In SearchResults.tsx
  useEffect(() => {
    let temp = [...products];
    const gender = searchParams.get('gender');
    const subcategoryId = searchParams.get('subcategory');

    if (subcategoryId) {
      temp = temp.filter(p => p.subcategoryId === Number(subcategoryId));
    } else if (gender) {
      temp = temp.filter(p => p.gender === gender);
    }

    setFilteredProducts(temp);
  }, [location.search, products]);

  const categoryName = searchParams.get('categoryName');
  const subcategoryName = searchParams.get('subcategoryName');

  return (
    <div className="flex flex-col py-10">
      <h1 className="text-2xl font-bold mb-6">
        {subcategoryName ? `"${subcategoryName}" məhsulları` : `"${categoryName}" kateqoriyası`}
      </h1>

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

export default SearchResults;