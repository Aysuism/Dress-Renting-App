import React from "react";
import { useWishlist } from "react-use-wishlist";
import type { Item } from "react-use-wishlist";
import listIcon from "../assets/img/product-details-icon.webp";
import { Link } from "react-router";
import slugify from "slugify";
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderOutlinedIcon from '@mui/icons-material/FavoriteBorderOutlined';

interface ColorOption {
    id: number;
    name: string;
    hex: string;
}

interface WishlistData extends Item {
    category: string;
    colors: ColorOption[];
    sizes: string[];
    rentDuration: number;
    offerType: string;
    image: string;
}

interface WishlistCardProps {
    wishListData: WishlistData;
}

const note = "Qeyd: Məhsul yalnız həftə içi mövcuddur, şəhər daxili çatdırılma ilə.";

const WishlistCard: React.FC<WishlistCardProps> = ({ wishListData }) => {
    const { removeWishlistItem, inWishlist } = useWishlist();
    console.log(wishListData);

    const toggleWishlist = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        e.stopPropagation();
        if (inWishlist(wishListData.id.toString())) {
            removeWishlistItem(wishListData.id.toString());
        }
    };

    return (
        <Link
            to={`/${slugify(String(wishListData.id), { lower: true })}`}
            className="bg-white rounded-2xl border border-[#D1D5DC] cursor-pointer p-4"
        >
            {/* Image */}
            <div className="relative w-full h-[231px]">
                <img
                    src={wishListData.image}
                    alt={wishListData.category}
                    className="object-contain w-full h-full rounded-2xl"
                />

                <button
                    className={`absolute top-2 right-2 p-2 text-xl cursor-pointer ${inWishlist(wishListData.id.toString())
                        ? "text-red-500"
                        : "text-gray-300"
                        }`}
                    onClick={toggleWishlist}
                >
                    {inWishlist(wishListData.id.toString()) ? (
                        <FavoriteIcon className="text-black" />
                    ) : (
                        <FavoriteBorderOutlinedIcon className="text-black" />
                    )}
                </button>
            </div>

            <div className="mt-4 grid gap-2 text-[16px]">
                {/* Name & Price */}
                <div className="grid grid-cols-2 items-center">
                    <p className="font-[500]">{wishListData.name}</p>
                    <div className="font-[600] text-right">
                        {wishListData.price} AZN 
                    </div>
                </div>

                {/* Category & Offer Type */}
                <div className="grid grid-cols-2">
                    <span>Kateqoriya: {wishListData.category}</span>
                    <span className="text-right">İstifadə forması: {wishListData.offerType}</span>
                </div>

                {/* Size & Color */}
                <div className="grid grid-cols-2">
                    <span>Ölçü: {wishListData.sizes?.length ? wishListData.sizes.join(", ") : "Yoxdur"}</span>
                    <span className="flex items-center justify-end gap-2">
                        Rəng:
                        {wishListData.colors?.map((c) => (
                            <span
                                key={c.id}
                                className="w-5 h-5 rounded-full border border-gray-300"
                                style={{ backgroundColor: c.hex }}
                                title={c.name}
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

export default WishlistCard;
