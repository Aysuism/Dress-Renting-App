// import { useGetFavoritesQuery } from "../tools/wishlist";
// import { useGetProductsQuery } from "../tools/product";
import { useWishlist } from "react-use-wishlist";
import Card from "../components/Card";
import { Link } from "react-router-dom";
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';

const Wishlist = () => {
  // const { data: favorites = [], isLoading: favoritesLoading } = useGetFavoritesQuery();
  // const { data: allProducts = [], isLoading: productsLoading } = useGetProductsQuery([]);
  const { items } = useWishlist();

  // const favoriteProducts = allProducts.filter((product: any) =>
  //   favorites.some((fav: any) => fav.productCode === product.productCode)
  // );

  const favItems = items.filter(
    (item, index, self) => index === self.findIndex((t) => t.id === item.id)
  );

  // const isLoading = favoritesLoading || productsLoading;

  return (
    <div className="min-h-screen flex flex-col py-10">
      <p className="mb-4 text-[#4A5565] text-[14px] flex items-center">
        <Link to="/" className="hover:text-black">Əsas</Link>
        <ChevronLeftIcon className="translate-y-[1px]" />
        Sevimlilər
      </p>

      {favItems.length === 0 ? (
        //  favoriteProducts.length === 0 ? (
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
          {/* {favoriteProducts.map((product: any) => (
            <Card key={product.productCode} clothes={product} />
          ))} */}
          {favItems.map((item) => (
            <Card key={item.id} clothes={item} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Wishlist;