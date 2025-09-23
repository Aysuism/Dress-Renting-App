import React from "react";
import { Link } from "react-router-dom";
import { useWishlist } from "react-use-wishlist";
import slugify from "slugify";
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderOutlinedIcon from '@mui/icons-material/FavoriteBorderOutlined';
import listIcon from "../assets/img/product-details-icon.webp";
import { type Product } from "../tools/types";

const note = "Qeyd: Məhsul yalnız həftə içi mövcuddur, şəhər daxili çatdırılma ilə.";

interface CardProps {
  clothes: Product;
}

// Map backend offer types to Azerbaijani
const offerTypeMap: Record<string, string> = {
  RENT: "Kirayə",
  SALE: "Satış",
};

const Card: React.FC<CardProps> = ({ clothes }) => {
  const { addWishlistItem, removeWishlistItem, inWishlist } = useWishlist();

  const mainColorSize = clothes.colorAndSizes[0];

  const wishlistItem = {
    id: clothes.id.toString(),
    name: clothes.user.name,
    price: clothes.price,
    image: mainColorSize?.imageUrls[0] || "",
    category: clothes.category.name,
    colors: clothes.colorAndSizes.map(cs => cs.color),
    sizes: Object.keys(mainColorSize?.sizeStockMap || {}),
    rentDuration: clothes.offers[0]?.rentDuration || 0,
    offerType: clothes.offers[0]?.offerTypes,
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
    <Link
      to={`/${slugify(String(clothes.id), { lower: true })}`}
      className="bg-white rounded-2xl border border-[#D1D5DC] cursor-pointer p-4"
    >
      <div className="relative w-full h-[231px]">
        <img
          src={mainColorSize?.imageUrls[0] || ""}
          alt={clothes.user.name}
          className="object-contain w-full h-full rounded-2xl"
        />

        <button
          className={`absolute top-2 right-2 p-2 text-xl cursor-pointer ${inWishlist(clothes.id.toString()) ? "text-red-500" : "text-gray-300"
            }`}
          onClick={toggleWishlist}
        >
          {inWishlist(clothes.id.toString())
            ? <FavoriteIcon className="text-black" />
            : <FavoriteBorderOutlinedIcon className="text-black" />}
        </button>
      </div>

      <div className="mt-4 grid gap-2 text-[16px]">
        {/* Name & Price */}
        <div className="font-[600] text-right">
          <span>{clothes.price} AZN</span>
        </div>

        {/* Category & Offer Type */}
        <div className="grid grid-cols-2">
          <span>Kateqoriya: {clothes.category.name}</span>
          <span className="text-right">
            İstifadə forması: {offerTypeMap[clothes.offers[0]?.offerTypes || ""] || "-"}
          </span>
        </div>


        {/* Size & Color */}
        <div className="grid grid-cols-2">
          <span>Ölçü: {Object.keys(mainColorSize?.sizeStockMap || {}).join(", ")}</span>
          <span className="flex items-center justify-end gap-2">
            Rəng:
            {clothes.colorAndSizes.map((item: any) => (
              <span
                key={item.id}
                className="w-5 h-5 rounded-full border border-gray-300"
                style={{ backgroundColor: item.color }}
              />
            ))}
          </span>
        </div>

        {/* Note */}
        <div className="grid grid-cols-[16px_1fr] items-start gap-3">
          <img
            src={listIcon}
            alt="details-icon"
            className="w-[16px] object-contain mt-1"
          />
          <p>{note.slice(0, 40)}...</p>
        </div>
      </div>
    </Link>
  );
};

export default Card;