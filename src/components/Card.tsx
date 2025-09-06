import React from "react";
import { Link } from "react-router-dom";
import { useWishlist } from "react-use-wishlist";
import slugify from "slugify";

export interface Clothes {
  id: number;
  name: string;
  surname: string;
  email: string;
  phone: string;
  category: { id: number; name: string };
  gender: { id: number; name: string };
  offerType: { id: number; name: string };
  condition: { id: number; name: string };
  colors: { id: number; name: string; hex: string }[];
  sizes: string[];
  price: number;
  rentDuration: number;
  productCode: string;
  images: string[];
  status: string;
}

interface CardProps {
  clothes: Clothes;
}

const Card: React.FC<CardProps> = ({ clothes }) => {
  const { addWishlistItem, removeWishlistItem, inWishlist } = useWishlist();

  const wishlistItem = {
    id: clothes.id.toString(),
    name: clothes.name,
    price: clothes.price,
    image: clothes.images[0] || "",
    category: clothes.category.name,
    colors: [...clothes.colors],
    sizes: [...clothes.sizes],
    rentDuration: clothes.rentDuration,
    offerType: clothes.offerType.name,
  };


  const toggleWishlist = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (inWishlist(clothes.id.toString())) {
      removeWishlistItem(clothes.id.toString());
    } else {
      addWishlistItem(wishlistItem);
    }
  };

  return (
    <Link to={`/${slugify(String(clothes.id), { lower: true })}`}
      className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all cursor-pointer">
      <div className="relative h-52 bg-gray-200 flex items-center justify-center">
        <img
          src={clothes.images[0] || ""}
          alt={clothes.name}
          className="object-cover w-full h-full"
        />

        <button
          className={`absolute top-2 right-2 p-2 bg-white rounded-full text-xl ${inWishlist(clothes.id.toString()) ? "text-red-500" : "text-gray-300"
            }`}
          onClick={toggleWishlist}
        >
          {inWishlist(clothes.id.toString()) ? "❤️" : "🤍"}
        </button>
      </div>

      <div className="p-4">
        {/* <div className="text-gray-700 font-semibold">
          {clothes.name} {clothes.surname}
        </div> */}
        <div className="text-purple-500 font-bold">{clothes.price} AZN/gün</div>
        <div className="text-gray-500 text-sm mt-1">
          <span>Ölçü: {clothes.sizes.join(", ")}</span>
          <span className="ml-3">Cins: {clothes.gender.name}</span>
        </div>
        <div className="text-gray-400 text-sm mt-1">
          Kateqoriya: {clothes.category.name} | Rəng: {clothes.colors.map(c => c.name).join(", ")}
        </div>
        <div className="text-gray-400 text-sm mt-1">
          Kod: {clothes.productCode} | Müddət: {clothes.rentDuration} gün
        </div>
        <div className="text-gray-400 text-sm mt-1">
          Email: {clothes.email} | Telefon: {clothes.phone}
        </div>
        <div className="text-gray-400 text-sm mt-1">
          Təklif: {clothes.offerType.name} | Vəziyyət: {clothes.condition.name} | Status: {clothes.status}
        </div>
      </div>
    </Link>
  );
};

export default Card;