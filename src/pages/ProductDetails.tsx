import { Link, Navigate, useParams } from "react-router";
import { useState } from "react";
import slugify from "slugify";
import type { Product } from "../tools/types";
import img from "../assets/img/jacket.jpg";
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import mailIcon from "../assets/img/mail-icon.webp"
import phoneLightIcon from "../assets/img/phone-light-icon.webp"
import phoneDarkIcon from "../assets/img/phone-dark-icon.webp"

const localProducts: Product[] = [
    {
        id: 1,
        productCode: "P-001",
        category: { id: 11, name: "Don" },
        subcategoryId: 11,
        price: 75,
        gender: "WOMAN",
        user: {
            id: 101,
            name: "Aysu",
            surname: "Ismayilzade",
            email: "aysu@example.com",
            phone: "+994511234567",
            userRole: "USER",
        },
        colorAndSizes: [
            {
                id: 201,
                color: "BLACK",
                photoCount: 2,
                stock: 5,
                imageUrls: [img, "https://picsum.photos/300/400?random=1"],
                sizeStockMap: { S: 2, M: 2, L: 1 },
            },
            {
                id: 202,
                color: "WHITE",
                photoCount: 1,
                stock: 3,
                imageUrls: ["https://picsum.photos/300/400?random=3"],
                sizeStockMap: { M: 2, XL: 1 },
            },
        ],
        createdAt: "2025-09-11T12:00:00Z",
        offers: [
            { id: 302, offerTypes: "SALE", price: 120, productCondition: "FIRST_HAND" },
        ],
        status: "ACTIVE",
    },
    {
        id: 2,
        productCode: "P-002",
        category: { id: 12, name: "Kostyum" },
        subcategoryId: 12,
        price: 60,
        gender: "MAN",
        user: {
            id: 102,
            name: "Ali",
            surname: "Hüseynov",
            email: "ali@example.com",
            phone: "+994501112233",
            userRole: "USER",
        },
        colorAndSizes: [
            {
                id: 203,
                color: "BLUE",
                photoCount: 1,
                stock: 4,
                imageUrls: ["https://picsum.photos/300/400?random=4"],
                sizeStockMap: { M: 2, L: 2 },
            },
        ],
        createdAt: "2025-09-09T09:00:00Z",
        offers: [
            { id: 303, offerTypes: "RENT", price: 20, rentDuration: 5, productCondition: "SECOND_HAND" },
        ],
        status: "ACTIVE",
    },
];

const ProductDetails: React.FC = () => {
    const { urlid } = useParams<{ urlid: string }>();
    const [_selectedSize, setSelectedSize] = useState<string | null>(null);
    const [selectedImage, setSelectedImage] = useState(0);

    const product = localProducts.find(p => slugify(String(p.id), { lower: true }) === urlid);

    if (!product) return <Navigate to="/not-found" replace />;

    const mainColorSize = product.colorAndSizes[0];
    const images = mainColorSize?.imageUrls || [];
    const colors = product.colorAndSizes.map(item => item.color);
    const sizeStockMap = mainColorSize?.sizeStockMap || {};
    const offer = product.offers[0];
    const allSizes = ["XS", "S", "M", "L", "XL", "XXL"];

    return (
        <div className="py-10 max-w-6xl ">
            <p className="mb-4 text-[#4A5565] text-[14px] flex items-center">
                <Link to="/" className="hover:text-black">Əsas</Link>
                <ChevronLeftIcon className="translate-y-[1px]" />
                Məhsul Detalı
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Images */}
                <div>
                    <div className="mb-4 border border-gray-400 rounded-lg overflow-hidden">
                        <img
                            src={images[selectedImage] || img}
                            alt={product.user.name}
                            className="w-full h-[400px] object-cover"
                        />
                    </div>

                    <div className="grid grid-cols-4 gap-2">
                        {images.map((img, idx) => (
                            <button
                                key={idx}
                                onClick={() => setSelectedImage(idx)}
                                className={`rounded-md overflow-hidden ${selectedImage === idx ? 'border border-gray-300' : ''}`}
                            >
                                <img src={img} alt={`Thumbnail ${idx}`} className="w-full h-16 object-cover" />
                            </button>
                        ))}
                    </div>
                </div>

                {/* Product Info */}
                <div className="space-y-6">
                    <div className="flex justify-between items-center">
                        <h1 className="text-2xl font-semibold">{product.category.name}</h1>
                        <div className="flex items-baseline mt-2">
                            <span className="text-2xl font-semibold">{product.price} AZN</span>
                            {offer?.offerTypes === "RENT" && <span className="ml-1 text-2xl font-semibold">/ {product.offers[0]?.rentDuration || 0} gün</span>}
                        </div>
                    </div>


                    {/* Colors */}
                    <div className="flex">
                        <p className="text-[20px] font-medium mr-3">Rəng:</p>
                        <div className="flex gap-2">
                            {colors.map((color, idx) => (
                                <div
                                    key={idx}
                                    className="w-8 h-8 rounded-full border border-gray-300"
                                    style={{ backgroundColor: color.toLowerCase() }}
                                    title={color}
                                ></div>
                            ))}
                        </div>
                    </div>

                    {/* Sizes */}
                    <div className="flex flex-wrap gap-2 my-10">
                        {allSizes.map((size) => {
                            const inStock = sizeStockMap[size] > 0;
                            return (
                                <button key={size} disabled={!inStock} onClick={() => setSelectedSize(size)} className={`w-[72px] h-[42px] rounded-md font-medium
                                            ${inStock ? "bg-black text-white" : "bg-[#E5E7EB] text-[#4A5565]"}`} >
                                    {size}
                                </button>
                            );
                        })}
                    </div>

                    {/* Product Note */}
                    <div>
                        <span className="font-semibold">Qeyd</span>
                        <p className="mt-2">Bu pencək gündəlik geyim və ya xüsusi tədbirlər üçün ideal seçimdir. Keyfiyyətli materialdan hazırlandığı üçün həm rahat, həm də davamlıdır. Məhsul yalnız həftə içi mövcuddur və şəhər daxili çatdırılma ilə təhvil verilir.</p>
                    </div>

                    {/* Offers */}
                    <div className="flex gap-3 items-center">
                        <span className="font-semibold">İstifadə forması:</span>
                        <div className="flex gap-2">
                            {["RENT", "SALE"].map((type) => {
                                const exists = product.offers.some((o) => o.offerTypes === type);
                                return (
                                    <div
                                        key={type}
                                        className={`w-[72px] h-[42px] flex items-center justify-center rounded-md font-medium
                                                  ${exists ? "bg-black text-white" : "bg-[#E5E7EB] text-[#4A5565]"}`}
                                    >
                                        {type === "RENT" ? "İcarə" : "Satış"}
                                    </div>
                                );
                            })}
                        </div>
                    </div>


                    {/* Contact Info */}
                    <div className="bg-white p-4 rounded-lg border border-gray-300">
                        <p className="mb-1 font-semibold">{product.user.name} {product.user.surname}</p>
                        <a href={`mailto:${product.user.email}`} className="mb-3 flex gap-2"><img src={mailIcon} alt="mail-icon" className="w-[18px] h-[14px] translate-y-[7px]" />{product.user.email}</a>
                        <a href={`tel:${product.user.phone}`} className="group flex items-center justify-center gap-3 h-[48px] bg-black text-white p-3 rounded-lg border-2 hover:bg-white hover:text-black transition-all duration-300">
                            <img src={phoneLightIcon} alt="phoneIcon" className="w-5 h-5 block group-hover:hidden" />
                            <img src={phoneDarkIcon} alt="phoneIcon" className="w-5 h-5 hidden group-hover:block" />
                            {product.user.phone}
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetails;