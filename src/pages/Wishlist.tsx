import { useWishlist } from "react-use-wishlist";
import WishlistCard from "../components/WishlistCard";
import { Link } from "react-router-dom";
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';

const Wishlist = () => {
  const { items } = useWishlist();

  const favItems = items.filter(
    (item, index, self) => index === self.findIndex((t) => t.id === item.id)
  );

  return (
    <div className="min-h-screen flex flex-col py-10">
      <p className="mb-4 text-[#4A5565] text-[14px] flex items-center">
        <Link to="/" className="hover:text-black">Əsas</Link>
        <ChevronLeftIcon className="translate-y-[1px]" />
        Sevimlilər
      </p>

      {favItems.length === 0 ? (
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
          {favItems.map((item) => (
            <WishlistCard key={item.id} item={item} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Wishlist;