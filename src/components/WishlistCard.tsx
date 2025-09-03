import { useWishlist } from 'react-use-wishlist'
import type { Item } from 'react-use-wishlist'
import DeleteIcon from '@mui/icons-material/Delete';

interface WishlistData extends Item {
    category: string;
    color: string;
    image: string;
}

interface WishlistCardProps {
    wishListData: WishlistData;
}

const WishlistCard = ({ wishListData }: WishlistCardProps) => {
    const { removeWishlistItem } = useWishlist()

    return (
        <div className="w-full bg-white rounded-lg shadow-md p-4 mb-4 flex flex-col md:flex-row items-center">
            <div className="md:w-1/4 mb-4 md:mb-0 flex justify-center">
                <img
                    src={wishListData.image}
                    alt={wishListData.category}
                    className="w-full h-48 object-cover rounded-lg"
                />
            </div>
            <div className="md:w-1/2 md:px-6 text-center md:text-left">
                <h3 className="text-xl font-semibold text-gray-800">
                    {wishListData.name}
                </h3>
                <p className="text-gray-600 mt-2">Kateqoriya: {wishListData.category}</p>
                <div className="text-lg font-bold text-purple-600 mt-2">
                    $ {wishListData.price}
                </div>
            </div>
            <div className="md:w-1/4 flex justify-center md:justify-end">
                <button
                    className="p-2 text-red-500 hover:bg-red-50 rounded-full transition-colors"
                    onClick={() => { removeWishlistItem(wishListData.id) }}
                    aria-label='Sil'
                >
                    <DeleteIcon />
                </button>
            </div>
        </div>
    )
}

export default WishlistCard