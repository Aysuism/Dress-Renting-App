import React from "react";
import { Link } from "react-router-dom";
import { useWishlist } from "react-use-wishlist";
import slugify from "slugify";

export interface Clothes {
  id: number;
  name: string;
  surname: string;
  email: string;
  phone: number;
  category: string;
  color: string;
  price: number;
  gender: string;
  size: string;
  images: string[];
}

interface CardProps {
  clothes: Clothes;
}

const Card: React.FC<CardProps> = ({ clothes}) => {
  const { addWishlistItem, removeWishlistItem, inWishlist } = useWishlist();

  const wishlistItem = {
    id: clothes.id.toString(),
    name: `${clothes.name} ${clothes.surname}`,
    price: clothes.price,
    image: clothes.images[0] || "",
    category: clothes.category,
    color: clothes.color,
    images: clothes.images,
  };

  const toggleWishlist = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    if (inWishlist(clothes.id.toString())) {
      removeWishlistItem(clothes.id.toString());
    } else {
      addWishlistItem(wishlistItem);
    }
  };

  // Function to parse the size string (handles both JSON arrays and comma-separated strings)
  const parseSizes = (sizeString: string): string => {
    if (!sizeString) return "–";
    
    try {
      // Try to parse as JSON array first
      const parsed = JSON.parse(sizeString);
      if (Array.isArray(parsed)) {
        return parsed.join(", ");
      }
    } catch (e) {
      // If not JSON, treat as comma-separated string
      return sizeString;
    }
    
    return sizeString;
  };

  return (
    <Link to={`/${slugify(String(clothes.id), { lower: true })}`}
      className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all cursor-pointer"
    >
      <div className="relative h-52 bg-gray-200 flex items-center justify-center">
        {clothes.images[0] ? (
          <img
            src={clothes.images[0]}
            alt={`${clothes.name} ${clothes.surname}`}
            className="object-cover w-full h-full"
          />
        ) : (
          <span className="text-gray-400">Şəkil yoxdur</span>
        )}

        <button
          className={`absolute top-2 right-2 p-2 bg-white rounded-full text-xl ${
            inWishlist(clothes.id.toString()) ? "text-red-500" : "text-gray-300"
          }`}
          onClick={toggleWishlist}
        >
          {inWishlist(clothes.id.toString()) ? "❤️" : "🤍"}
        </button>
      </div>

      <div className="p-4">
        <div className="text-gray-700 font-semibold">
          {clothes.name} {clothes.surname}
        </div>
        <div className="text-purple-500 font-bold">{clothes.price} AZN/gün</div>
        <div className="text-gray-500 text-sm mt-1">
          <span>
            Ölçü: {parseSizes(clothes.size)}
          </span>
          <span className="ml-3">Cins: {clothes.gender || "–"}</span>
        </div>
        <div className="text-gray-400 text-sm mt-1">
          Email: {clothes.email} | Telefon: {clothes.phone}
        </div>
        <div className="text-gray-400 text-sm mt-1">
          Kateqoriya: {clothes.category} | Rəng: {clothes.color}
        </div>
      </div>
    </Link>
  );
};

export default Card;


// import React from "react";
// import { Link } from "react-router-dom";
// import { useWishlist } from "react-use-wishlist";
// import slugify from "slugify";

// export interface Clothes {
//   id: number;
//   subcategoryId: number;
//   gender: string;
//   price: number;
//   colorAndSizes: { color: string; size: string; quantity: number }[];
//   images: string[];
// }

// interface CardProps {
//   clothes: Clothes;
// }

// const Card: React.FC<CardProps> = ({ clothes }) => {
//   const { addWishlistItem, removeWishlistItem, inWishlist } = useWishlist();

//   const wishlistItem = {
//     id: clothes.id.toString(),
//     price: clothes.price,
//     image: clothes.images[0] || "",
//     colorAndSizes: clothes.colorAndSizes,
//     images: clothes.images,
//     gender: clothes.gender
//   };

//   const toggleWishlist = (e: React.MouseEvent<HTMLButtonElement>) => {
//     e.stopPropagation();
//     if (inWishlist(clothes.id.toString())) {
//       removeWishlistItem(clothes.id.toString());
//     } else {
//       addWishlistItem(wishlistItem);
//     }
//   };

//   // Collect unique sizes
//   const sizes = Array.from(new Set(clothes.colorAndSizes.map(c => c.size))).join(", ");

//   // Collect unique colors
//   const colors = Array.from(new Set(clothes.colorAndSizes.map(c => c.color))).join(", ");

//   return (
//     <Link
//       to={`/${slugify(String(clothes.id), { lower: true })}`}
//       className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all cursor-pointer"
//     >
//       <div className="relative h-52 bg-gray-200 flex items-center justify-center">
//         {clothes.images[0] ? (
//           <img
//             src={clothes.images[0]}
//             alt={`Cloth ${clothes.id}`}
//             className="object-cover w-full h-full"
//           />
//         ) : (
//           <span className="text-gray-400">Şəkil yoxdur</span>
//         )}

//         <button
//           className={`absolute top-2 right-2 p-2 bg-white rounded-full text-xl ${
//             inWishlist(clothes.id.toString()) ? "text-red-500" : "text-gray-300"
//           }`}
//           onClick={toggleWishlist}
//         >
//           {inWishlist(clothes.id.toString()) ? "❤️" : "🤍"}
//         </button>
//       </div>

//       <div className="p-4">
//         <div className="text-gray-700 font-semibold">Məhsul #{clothes.id}</div>
//         <div className="text-purple-500 font-bold">{clothes.price} AZN/gün</div>
//         <div className="text-gray-500 text-sm mt-1">
//           <span>Ölçü: {sizes || "–"}</span>
//           <span className="ml-3">Cins: {clothes.gender || "–"}</span>
//         </div>
//         <div className="text-gray-400 text-sm mt-1">
//           Rəng: {colors || "–"}
//         </div>
//       </div>
//     </Link>
//   );
// };

// export default Card;
