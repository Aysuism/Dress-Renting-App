import { Link, Navigate, useParams } from "react-router";
import { useState } from "react";
import slugify from "slugify";
import img from "../assets/img/jacket.jpg";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import mailIcon from "../assets/img/mail-icon.webp";
import phoneLightIcon from "../assets/img/phone-light-icon.webp";
import phoneDarkIcon from "../assets/img/phone-dark-icon.webp";
import { useGetSubcategoriesQuery } from "../tools/subCategory";
import { useGetProductsQuery } from "../tools/product";
import type { ColorAndSize, Offer } from "../tools/homeFilter";

export interface Product {
    userName: string;
    userSurname: string;
    userEmail: string;
    userPhone: string;
    productCode: string;
    subcategory: {
        id: number;
        name: string;
        category: {
            id: number;
            name: string
        };
    };
    price: number;
    gender: "WOMAN" | "MAN" | "KID";
    description: string;
    colorAndSizes: ColorAndSize[];
    createdAt: string;
    offers: Offer[];
}

const ProductDetails = () => {
    const { urlid } = useParams<{ urlid: string }>();

    const [selectedColor, setSelectedColor] = useState<string | null>(null);
    const [selectedImage, setSelectedImage] = useState(0);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const { data: products = [], isLoading: isProductLoading } = useGetProductsQuery([]);
    const { data: subcategories = [], isLoading: isSubLoading } = useGetSubcategoriesQuery([]);

    if (isProductLoading || isSubLoading) return <div>Loading...</div>;

    const product: Product | undefined = products.find((p: any) =>
        slugify(String(p.productCode), { lower: true }) === slugify(String(urlid), { lower: true })
    );

    if (!product) return <Navigate to="/not-found" replace />;

    const subcategoryName = subcategories?.find((sc: any) => sc.id === product.subcategory.id)?.name;

    const colorAndSizes = product.colorAndSizes as any;
    const colors = Array.from(new Set(colorAndSizes.map((item: any) => item.color))) as string[];
    const activeColor = selectedColor || colors[0];

    const availableSizes = colorAndSizes
        .filter((cs: any) => cs.color === activeColor)
        .map((cs: any) => cs.sizes.map((item: any) => item.size));

    const images = colorAndSizes.find((cs: any) => cs.color === activeColor)?.imageUrls || [img] as string[];

    return (
        <div className="py-10 ">
            <p className="mb-4 text-[#4A5565] text-[14px] flex items-center">
                <Link to="/" className="hover:text-black">Əsas</Link>
                <ChevronLeftIcon className="translate-y-[1px]" />
                Məhsul Detalı
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Images */}
                <div>
                    <div className="mb-4 border border-gray-400 rounded-lg overflow-hidden"
                        onClick={() => setIsModalOpen(true)}>
                        <img
                            src={images[selectedImage]}
                            alt={activeColor as string}
                            className="w-full h-[400px] object-contain cursor-pointer transition-transform duration-200 hover:scale-105"
                        />
                    </div>

                    <div className="grid grid-cols-4 gap-2">
                        {images.map((imgSrc: any, idx: number) => (
                            <button key={idx} onClick={() => setSelectedImage(idx)}
                                className={`rounded-md overflow-hidden border cursor-pointer ${selectedImage === idx ? "border-black" : "border-gray-300"}`}>
                                <img src={imgSrc} alt={`Thumbnail ${idx}`} className="w-full h-16 object-contain" />
                            </button>
                        ))}
                    </div>

                    {isModalOpen && (
                        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50" onClick={() => setIsModalOpen(false)}>
                            <div className="relative w-[90%] max-h-[90vh] overflow-hidden" onClick={e => e.stopPropagation()}>
                                <button onClick={() => setIsModalOpen(false)}
                                    className="absolute top-3 right-3 text-white font-bold px-3 py-1 rounded-md cursor-pointer transform hover:scale-120 transition-transform duration-100">
                                    ✕
                                </button>
                                <img src={images[selectedImage] || img} alt="Full view" className="w-full h-auto max-h-[90vh] object-contain rounded-lg shadow-lg" />
                            </div>
                        </div>
                    )}
                </div>

                {/* Product Info */}
                <div className="space-y-6">
                    <div className="flex justify-between items-center">
                        <h1 className="text-2xl font-semibold">{subcategoryName}</h1>
                        <div className="flex items-baseline mt-2">
                            <span className="text-2xl font-semibold">{product.price} AZN</span>
                        </div>
                    </div>

                    {/* Colors */}
                    <div className="flex items-center">
                        <p className="font-medium mr-3">Rəng:</p>
                        <div className="flex gap-2">
                            {colors.map((color, idx) => (
                                <div key={idx} onClick={() => { setSelectedColor(color); setSelectedImage(0); }}
                                    className={`w-8 h-8 rounded-full border-2 cursor-pointer ${activeColor === color ? "border-black" : "border-gray-300"}`}
                                    style={{ backgroundColor: color.toLowerCase() }}
                                    title={color}></div>
                            ))}
                        </div>
                    </div>

                    <div className="flex items-center">
                        <p className="font-medium mr-3">Məhsul kodu:</p>

                        <span className="">{product.productCode}</span>
                    </div>

                    {/* Sizes */}
                    <div>
                        <p className="font-medium">Ölçü:</p>

                        <div className="flex flex-wrap gap-2 mt-4">
                            {["XS", "S", "M", "L", "XL", "XXL"].map(size => (
                                <div key={size}
                                    className={`w-[72px] h-[42px] rounded-md font-medium flex items-center justify-center ${availableSizes.includes(size) ? "bg-black text-white" : "bg-[#E5E7EB] text-[#4A5565]"}`}>
                                    {size}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Note */}
                    <div>
                        <span className="font-semibold">Qeyd</span>
                        <p className="mt-2">{product.description}</p>
                    </div>

                    {/* Contact Info */}
                    <div className="grid gap-3 bg-white p-4 rounded-lg border border-gray-300">
                        <p className="mb-1 font-semibold">{product.userName} {product.userSurname}</p>
                        <a href={`mailto:${product.userEmail}`} className="mb-3 flex gap-2">
                            <img src={mailIcon} alt="mail-icon" className="w-[18px] h-[14px] translate-y-[7px]" />
                            {product.userEmail}
                        </a>
                        <a href={`tel:${product.userPhone}`}
                            className="group flex items-center justify-center gap-3 h-[48px] bg-black text-white p-3 rounded-lg border-2 hover:bg-white hover:text-black transition-all duration-300">
                            <img src={phoneLightIcon} alt="phoneIcon" className="w-5 h-5 block group-hover:hidden" />
                            <img src={phoneDarkIcon} alt="phoneIcon" className="w-5 h-5 hidden group-hover:block" />
                            {product.userPhone}
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetails;