import { useGetFavoritesQuery } from "../tools/wishlist";
import { useGetProductsQuery } from "../tools/product";
import Card from "../components/Card"; // Import the same Card component
import { Link } from "react-router-dom";
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';

const Wishlist = () => {
  const { data: favorites = [], isLoading: favoritesLoading } = useGetFavoritesQuery();
  const { data: allProducts = [], isLoading: productsLoading } = useGetProductsQuery([]);

  // Get favorite products by matching product codes
  const favoriteProducts = allProducts.filter((product: any) =>
    favorites.some((fav: any) => fav.productCode === product.productCode)
  );

  const isLoading = favoritesLoading || productsLoading;

  return (
    <div className="min-h-screen flex flex-col py-10">
      <p className="mb-4 text-[#4A5565] text-[14px] flex items-center">
        <Link to="/" className="hover:text-black">Əsas</Link>
        <ChevronLeftIcon className="translate-y-[1px]" />
        Sevimlilər
      </p>

      {isLoading ? (
        <div className="flex justify-center py-10">
          <div className="text-lg">Loading...</div>
        </div>
      ) : favoriteProducts.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-10">
          <img
            src="https://www.emp.co.uk/on/demandware.static/Sites-GLB-Site/-/default/dwd1d465d0/images/logos/empty-cart.gif"
            alt="no-item"
            className="mb-4"
          />
          <h1 className="text-lg font-semibold text-gray-700">
            İstək siyahınız boşdur!
          </h1>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {favoriteProducts.map((product: any) => (
            <Card key={product.productCode} clothes={product} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Wishlist;