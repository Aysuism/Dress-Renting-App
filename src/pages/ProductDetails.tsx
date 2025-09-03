import { useParams } from "react-router";
import { useGetClothesQuery } from "../tools/product";
import type { Clothes } from "../components/Card";
import slugify from "slugify";
import { Swiper, SwiperSlide, type SwiperClass } from "swiper/react";
import { FreeMode, Thumbs } from "swiper/modules";
import { useState } from "react";
import PhoneIcon from '@mui/icons-material/Phone';

const parseJson = (jsonStr: string | undefined) => {
    if (!jsonStr) return { id: 0, name: "–" };
    try {
        return JSON.parse(jsonStr);
    } catch {
        return { id: 0, name: jsonStr };
    }
};

export const parseToArray = (value: any) => {
    if (Array.isArray(value)) return value;
    try {
        const parsed = JSON.parse(value);
        return Array.isArray(parsed) ? parsed : [parsed];
    } catch {
        return [];
    }
};

const ProductDetails: React.FC = () => {
    const { urlid } = useParams<{ urlid: string }>();
    const { data: products} = useGetClothesQuery() as { data: Clothes[] | undefined; isLoading: boolean };
    const [thumbsSwiper, setThumbsSwiper] = useState<SwiperClass | null>(null);

    const findProduct = products?.find(
        (p) => slugify(String(p.id), { lower: true }) === urlid
    );

    if (!findProduct) return <div className="alert alert-warning">Paltar tapılmadı</div>;

    const category = parseJson(findProduct.category);
    const gender = parseJson(findProduct.gender);
    const colors = parseToArray(findProduct.color);
    const sizes = parseToArray(findProduct.size);

    return (
        <div className="py-8 px-4">
            <div className="max-w-6xl mx-auto bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-200">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8">
                    {/* Images */}
                    <div className="space-y-4">
                        <div className="relative rounded-2xl overflow-hidden shadow-lg h-96 bg-gradient-to-br from-blue-50 to-purple-50">
                            <Swiper
                                loop={true}
                                spaceBetween={10}
                                thumbs={{ swiper: thumbsSwiper }}
                                modules={[FreeMode, Thumbs]}
                                className="h-full"
                            >
                                {findProduct.images.map((image, index) => (
                                    <SwiperSlide key={index}>
                                        <img
                                            src={image}
                                            alt={`${category.name} ${index + 1}`}
                                            className="w-full h-full object-cover"
                                        />
                                    </SwiperSlide>
                                ))}
                            </Swiper>
                        </div>

                        <Swiper
                            onSwiper={setThumbsSwiper}
                            loop={true}
                            spaceBetween={12}
                            slidesPerView={4}
                            freeMode
                            watchSlidesProgress
                            modules={[FreeMode, Thumbs]}
                            className="thumbnail-slider"
                        >
                            {findProduct.images.map((image, index) => (
                                <SwiperSlide key={index} className="cursor-pointer">
                                    <div className="rounded-xl overflow-hidden border-2 border-transparent transition-all duration-200 hover:border-purple-400 h-20">
                                        <img
                                            src={image}
                                            alt={`thumb ${index + 1}`}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                </SwiperSlide>
                            ))}
                        </Swiper>
                    </div>

                    {/* Product Info */}
                    <div className="flex flex-col space-y-6">
                        <div>
                            <div className="flex items-baseline mt-2">
                                <span className="text-3xl font-extrabold text-purple-500">{findProduct.price} AZN</span>
                                <span className="ml-1 text-sm text-gray-500">/gün</span>
                            </div>
                        </div>

                        {/* Category & Gender */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-gray-50 p-4 rounded-xl">
                                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Kateqoriya</p>
                                <p className="text-lg font-medium text-gray-900">{category.name}</p>
                            </div>
                            <div className="bg-gray-50 p-4 rounded-xl">
                                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Cins</p>
                                <p className="text-lg font-medium text-gray-900">{gender.name}</p>
                            </div>
                        </div>

                        {/* Colors */}
                        <div>
                            <p className="text-sm font-semibold text-gray-700 mb-3">Rəng seçimi</p>
                            <div className="flex gap-3">
                                {(Array.isArray(colors) ? colors : JSON.parse(colors)).map((hex: string, index: number) => (
                                    <button
                                        key={index}
                                        title={hex}
                                        className="w-10 h-10 rounded-full border-2 border-gray-300 transition-all"
                                        style={{ backgroundColor: hex }}
                                    />
                                ))}
                            </div>
                        </div>


                        {/* Sizes */}
                        <div>
                            <p className="text-sm font-semibold text-gray-700 mb-3">Ölçü seçimi</p>
                            <div className="flex flex-wrap gap-2">
                                {sizes.map((size: string) => (
                                    <button
                                        key={size}
                                        className="w-12 h-12 flex items-center justify-center rounded-lg font-semibold transition-all bg-purple-200 text-purple-700 border border-purple-400"
                                    >
                                        {size}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Contact Info */}
                        <div className="space-y-4 bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-2xl border border-blue-100">
                            <p className="text-sm font-semibold text-blue-700 mb-2 flex items-center">
                                <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                                </svg>
                                Əlaqə məlumatları
                            </p>
                            <p className="text-blue-900 font-medium mb-0">{findProduct.name} {findProduct.surname}</p>
                            <p className="text-blue-900 font-medium">{findProduct.email}</p>
                            <button className="w-full flex items-center justify-center gap-3 font-semibold py-4 px-6 rounded-2xl bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 hover:from-purple-100 hover:to-pink-100 hover:border-purple-300 transition-all duration-300">
                                <div className="bg-purple-100 p-2 rounded-full">
                                    <PhoneIcon className="h-5 w-5 text-purple-600" />
                                </div>
                                <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">{findProduct.phone}</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetails;

