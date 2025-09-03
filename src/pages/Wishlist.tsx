import { useWishlist } from "react-use-wishlist";
import WishlistCard from "../components/WishlistCard";
import type { Item } from 'react-use-wishlist'

interface WishlistData extends Item {
  category: string;
  color: string;
  image: string
}

const Wishlist = () => {
  const { items } = useWishlist();

  const favItems = items.filter((item, index, self) => 
    index === self.findIndex(t => t.id === item.id)
  );

  return (
    <div className="min-h-screen flex flex-col">
      <h2 className="text-center text-2xl font-bold my-10 text-[#8b5cf6]">
        Sevimli Geyimlər
      </h2>

      {favItems.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-10">
          <img
            src="/no_wish_list-removebg-preview.png"
            alt="no-item"
            className="w-48 h-48 object-contain mb-4"
          />
          <h1 className="text-lg font-semibold text-gray-700">
            Istək Siyahınız Boşdur!
          </h1>
        </div>
      ) : (
        <div className="flex flex-col gap-4 px-4 sm:px-6 md:px-10">
          {favItems.map((item) => {
            // Ensure item has all WishlistData properties
            const wishListData: WishlistData = {
              ...item,
              category: (item as WishlistData).category || "",
              color: (item as WishlistData).color || "",
              image: (item as WishlistData).image || "",
            };
            return (
              <WishlistCard key={item.id} wishListData={wishListData} />
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Wishlist;