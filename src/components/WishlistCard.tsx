import React from "react";
import { Link } from "react-router-dom";
import slugify from "slugify";
import FavoriteIcon from '@mui/icons-material/Favorite';
import listIcon from "../assets/img/product-details-icon.webp";
import { useWishlist } from "react-use-wishlist";

const WishlistCard = ({ item }: any) => {
    const { removeWishlistItem } = useWishlist();
    const productId = item.id;

    const toggleWishlist = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        e.stopPropagation();
        removeWishlistItem(productId);
    };
    console.log(item);

    return (
        <Link
            to={`/${slugify(String(productId), { lower: true })}`}
            className="bg-white rounded-2xl border border-[#D1D5DC] cursor-pointer p-4"
        >
            <div className="relative w-full h-[231px]">
                <img
                    src={item.image}
                    alt="product-image"
                    className="object-contain w-full h-full rounded-2xl"
                />

                <button
                    className="absolute top-2 right-2 w-[43px] h-[43px] text-xl cursor-pointer bg-white rounded-full text-red-500"
                    onClick={toggleWishlist}
                >
                    <FavoriteIcon className="text-black" />
                </button>
            </div>

            <div className="mt-4 grid gap-2 text-[16px]">
                {/* Name & Price */}
                <div className="font-[600] text-right">
                    <span>{item.price} AZN</span>
                </div>

                {/* Category & Offer Type */}
                <div className="flex justify-between gap-4">
                    <p>Kateqoriya:
                        <span className="text-gray-500 ms-1">
                            {item.category}
                        </span>
                    </p>
                    <p>
                        İstifadəsi:
                        <span className="text-gray-500 ms-1">
                            {item.offerType === 'SALE' ? 'Satış' : 'İcarə'}
                        </span>
                    </p>
                </div>

                {/* Size & Color */}
                <div className="grid grid-cols-2">
                    <p>Ölçü:
                        <span className="text-gray-500 ms-1">
                            {item.size}
                        </span>
                    </p>

                    <p className="flex items-center justify-end gap-2">
                        Rəng:
                        {item.colors.map((c: any, i: number) =>
                            <span
                                key={i}
                                className="w-5 h-5 rounded-full border border-gray-300"
                                style={{ backgroundColor: c?.toLowerCase() }}
                                title={c.color}
                            />
                        )}
                    </p>
                </div>

                {/* Note */}
                <div className="grid grid-cols-[16px_1fr] items-start gap-3">
                    <img
                        src={listIcon}
                        alt="details-icon"
                        className="w-[16px] object-contain mt-1"
                    />
                    <p>{item.description?.slice(0, 40)}...</p>
                </div>
            </div>
        </Link>
    );
};

export default WishlistCard;