import React from "react";
import { Link } from "react-router-dom";
import slugify from "slugify";
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderOutlinedIcon from '@mui/icons-material/FavoriteBorderOutlined';
import listIcon from "../assets/img/product-details-icon.webp";
// import { useGetFavoritesQuery, useAddFavoriteMutation, useRemoveFavoriteMutation } from "../tools/wishlist";
import { useWishlist } from "react-use-wishlist";

const Card = ({ clothes }: any) => {
  // const { data: favorites = [] } = useGetFavoritesQuery();
  // const [addFavorite] = useAddFavoriteMutation();
  // const [removeFavorite] = useRemoveFavoriteMutation();
  const { addWishlistItem, removeWishlistItem, inWishlist } = useWishlist();
  const mainColor = clothes.colorAndSizes?.map((item: any) => item.color);

  const mainSizes = clothes.colorAndSizes?.map((item: any) => item.sizes.map((c:string)=>c)).join(", ");
  const mainColorImage = clothes.colorAndSizes?.[0]?.imageUrls?.[0] || clothes.image;

  const productId = clothes.productCode || clothes.id;

  const wishlistItem = {
    id: productId,
    price: clothes.price,
    image: mainColorImage,
    category: clothes.subCategoryName,
    colors: mainColor,
    size: mainSizes,
    description:clothes.description,
    offerType:clothes.offers?.[0].offerType,
  };

  const toggleWishlist = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();

    if (inWishlist(productId)) {
      removeWishlistItem(productId);
    } else {
      addWishlistItem(wishlistItem);
    }
  };


  return (
    <Link to={`/${slugify(String(clothes.productCode), { lower: true })}`}
      className="bg-white rounded-2xl border border-[#D1D5DC] cursor-pointer p-4">
      <div className="relative w-full h-[231px]">
        <img
          src={mainColorImage}
          alt="product-image"
          className="object-contain w-full h-full rounded-2xl"
        />

        <button className={`absolute top-2 right-2 w-[43px] h-[43px] text-xl cursor-pointer bg-white rounded-full
              ${inWishlist(clothes.productCode) ? "text-red-500" : "text-gray-300"}`}
          onClick={toggleWishlist}>
          {inWishlist(productId)
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
        <div className="flex justify-between gap-4">
          <p>Kateqoriya:
            <span className="text-gray-500 ms-1">
              {clothes.subCategoryName}
            </span>
          </p>
          <p>
            İstifadəsi:
            <span className="text-gray-500 ms-1">
              {clothes.offers?.[0].offerType === 'SALE' ? 'Satış' : 'İcarə'}
            </span>
          </p>
        </div>

        {/* Size & Color */}
        <div className="grid grid-cols-2">
          <p>Ölçü:
            <span className="text-gray-500 ms-1">
              {mainSizes}
            </span>
          </p>

          <p className="flex items-center justify-end gap-2">
            Rəng:
            {clothes.colorAndSizes?.map((item: any, idx: number) => (
              <span
                key={idx}
                className="w-5 h-5 rounded-full border border-gray-300"
                style={{ backgroundColor: item.color.toLowerCase() }}
              />
            ))}
          </p>
        </div>

        {/* Note */}
        <div className="grid grid-cols-[16px_1fr] items-start gap-3">
          <img
            src={listIcon}
            alt="details-icon"
            className="w-[16px] object-contain mt-1"
          />
          <p>{clothes.description?.slice(0, 40)}...</p>
        </div>
      </div>
    </Link>
  );
};

export default Card;