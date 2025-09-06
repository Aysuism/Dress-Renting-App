import React from "react";
import { useWishlist } from "react-use-wishlist";
import type { Item } from "react-use-wishlist";
import DeleteIcon from "@mui/icons-material/Delete";

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

const WishlistCard: React.FC<WishlistCardProps> = ({ wishListData }) => {
    const { removeWishlistItem } = useWishlist();
    console.log(wishListData);

    const handleRemove = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation();
        removeWishlistItem(wishListData.id);
    };

    return (
        <div className="w-full bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-lg p-6 mb-6 flex flex-col md:flex-row items-start hover:shadow-2xl hover:-translate-y-1 transform transition-all duration-500 group">
            {/* Image */}
            <div className="md:w-1/4 mb-4 md:mb-0 flex justify-center">
                <img
                    src={wishListData.image}
                    alt={wishListData.category}
                    className="w-full h-52 object-cover rounded-xl border border-gray-200 shadow-sm transition-transform duration-500 group-hover:scale-105"
                />
            </div>

            {/* Info */}
            <div className="md:w-3/4 md:px-6 flex flex-col justify-between w-full">
                <div className="flex justify-between items-start">
                    {/* Name */}
                    <h3 className="text-2xl font-bold text-gray-900 hover:text-purple-600 transition-colors duration-300">
                        {wishListData.name}
                    </h3>

                    {/* Price */}
                    <div className="text-2xl font-extrabold text-purple-600">
                        ${wishListData.price}
                    </div>

                    {/* Delete Button */}
                    <button
                        onClick={handleRemove}
                        className="ml-4 p-2 text-red-500 hover:bg-red-100 rounded-full transition-colors duration-300 flex items-center justify-center shadow hover:shadow-md"
                        aria-label="Sil"
                    >
                        <DeleteIcon />
                    </button>
                </div>

                <div className="mt-4 space-y-2 text-gray-600">
                    <p>
                        <span className="font-semibold">Kateqoriya:</span> {wishListData.category}
                    </p>
                    <div className="flex items-center gap-2">
                        <span className="font-semibold">Rəng:</span>
                        {wishListData.colors?.map((c: any) => (
                            <div
                                key={c.id}
                                className="w-6 h-6 rounded-full border border-gray-300"
                                style={{ backgroundColor: c.hex }}
                                title={c.name}
                            ></div>
                        ))}
                    </div>

                    <p>
                        <span className="font-semibold">Ölçü:</span>{" "}
                        {wishListData.sizes?.length ? wishListData.sizes.join(", ") : "Yoxdur"}
                    </p>

                    <p>
                        <span className="font-semibold">Müddət:</span> {wishListData.rentDuration} gün
                    </p>
                    <p>
                        <span className="font-semibold">Təklif:</span> {wishListData.offerType}
                    </p>
                </div>
            </div>
        </div>

    );
};

export default WishlistCard