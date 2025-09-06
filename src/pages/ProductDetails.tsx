import { useParams } from "react-router";
import { useState } from "react";
import PhoneIcon from '@mui/icons-material/Phone';
import { Swiper, SwiperSlide, type SwiperClass } from "swiper/react";
import { FreeMode, Thumbs } from "swiper/modules";
import slugify from "slugify";

export const COLORS = [
    { name: "Qırmızı", hex: "#FF0000" },
    { name: "Yaşıl", hex: "#008000" },
    { name: "Mavi", hex: "#0000FF" },
    { name: "Sarı", hex: "#FFFF00" },
    { name: "Qara", hex: "#000000" },
    { name: "Ağ", hex: "#FFFFFF" },
    { name: "Narıncı", hex: "#FFA500" },
    { name: "Bənövşəyi", hex: "#800080" },
    { name: "Çəhrayı", hex: "#FFC0CB" },
    { name: "Boz", hex: "#808080" },
];
const localProducts = [
    {
        id: "1",
        category: { id: 1, name: "Don" },
        gender: { id: 1, name: "Qadın" },
        offerType: { id: 1, name: "Kirayə" },
        condition: { id: 1, name: "FIRST_HAND" },
        colors: [{ id: 1, name: "Qara", hex: COLORS.find(c => c.name === "Qara")?.hex || "#000000" }],
        sizes: ["S", "M"],
        price: 45,
        images: ["https://i.pinimg.com/736x/0c/4f/c6/0c4fc62d6d205d2ab33620bf4e590a15.jpg", "https://mauiofficial.com/img/p/4/2/6/0/4260.jpg"], // File array would be empty for demo
        rentDuration: 7,
        productCode: "P-001",
        name: "Aysu",
        surname: "Ismayilzade",
        email: "aysu@example.com",
        phone: "0511234567",
        status: "APPROVED"
    },
    {
        id: "2",
        category: { id: 2, name: "Kostyum" },
        gender: { id: 2, name: "Kişi" },
        offerType: { id: 1, name: "Kirayə" },
        condition: { id: 2, name: "SECOND_HAND" },
        colors: [
            { id: 5, name: "Ağ", hex: COLORS.find(c => c.name === "Ağ")?.hex || "#FFFFFF" },
            { id: 2, name: "Mavi", hex: COLORS.find(c => c.name === "Mavi")?.hex || "#0000FF" }
        ],
        sizes: ["M", "L", "XL"],
        price: 85,
        images: ["https://i.pinimg.com/736x/0c/4f/c6/0c4fc62d6d205d2ab33620bf4e590a15.jpg", "https://mauiofficial.com/img/p/4/2/6/0/4260.jpg"],
        rentDuration: 5,
        productCode: "P-002",
        name: "Ali",
        surname: "Hüseynov",
        email: "ali@example.com",
        phone: "0511234568",
        status: "APPROVED"
    },
    {
        id: "3",
        category: { id: 1, name: "Don" },
        gender: { id: 1, name: "Qadın" },
        offerType: { id: 2, name: "Satış" },
        condition: { id: 1, name: "FIRST_HAND" },
        colors: [
            { id: 5, name: "Ağ", hex: COLORS.find(c => c.name === "Ağ")?.hex || "#FFFFFF" },
            { id: 2, name: "Mavi", hex: COLORS.find(c => c.name === "Mavi")?.hex || "#0000FF" }
        ],
        sizes: ["XS", "S", "M"],
        price: 120,
        images: ["https://i.pinimg.com/736x/0c/4f/c6/0c4fc62d6d205d2ab33620bf4e590a15.jpg", "https://mauiofficial.com/img/p/4/2/6/0/4260.jpg"],
        rentDuration: 1, // Not used for sale but kept for structure
        productCode: "P-003",
        name: "Leyla",
        surname: "Quliyeva",
        email: "leyla@example.com",
        phone: "0511234569",
        status: "APPROVED"
    },
    {
        id: "4",
        category: { id: 1, name: "Don" },
        gender: { id: 2, name: "Kişi" },
        offerType: { id: 2, name: "Satış" },
        condition: { id: 2, name: "SECOND_HAND" },
        colors: [
            { id: 5, name: "Ağ", hex: COLORS.find(c => c.name === "Ağ")?.hex || "#FFFFFF" },
            { id: 2, name: "Mavi", hex: COLORS.find(c => c.name === "Mavi")?.hex || "#0000FF" }
        ],
        sizes: ["L", "XL", "XXL"],
        price: 55,
        images: ["https://i.pinimg.com/736x/0c/4f/c6/0c4fc62d6d205d2ab33620bf4e590a15.jpg", "https://mauiofficial.com/img/p/4/2/6/0/4260.jpg"],
        rentDuration: 1,
        productCode: "P-004",
        name: "Nermin",
        surname: "Memmedova",
        email: "nermin@example.com",
        phone: "0511234570",
        status: "APPROVED"
    },
    {
        id: "5",
        category: { id: 1, name: "Don" },
        gender: { id: 3, name: "Uşaq" },
        offerType: { id: 1, name: "Kirayə" },
        condition: { id: 1, name: "FIRST_HAND" },
        colors: [
            { id: 5, name: "Ağ", hex: COLORS.find(c => c.name === "Ağ")?.hex || "#FFFFFF" },
            { id: 2, name: "Mavi", hex: COLORS.find(c => c.name === "Mavi")?.hex || "#0000FF" }
        ],
        sizes: ["S", "M"],
        price: 25,
        images: ["https://i.pinimg.com/736x/0c/4f/c6/0c4fc62d6d205d2ab33620bf4e590a15.jpg", "https://mauiofficial.com/img/p/4/2/6/0/4260.jpg"],
        rentDuration: 3,
        productCode: "P-005",
        name: "Emil",
        surname: "Ceferov",
        email: "emil@example.com",
        phone: "0511234571",
        status: "APPROVED"
    },
    {
        id: "6",
        category: { id: 2, name: "Kostyum" },
        gender: { id: 1, name: "Qadın" },
        offerType: { id: 1, name: "Kirayə" },
        condition: { id: 1, name: "FIRST_HAND" },
        colors: [
            { id: 5, name: "Ağ", hex: COLORS.find(c => c.name === "Ağ")?.hex || "#FFFFFF" },
            { id: 2, name: "Mavi", hex: COLORS.find(c => c.name === "Mavi")?.hex || "#0000FF" }
        ],
        sizes: ["M", "L"],
        price: 95,
        images: ["https://i.pinimg.com/736x/0c/4f/c6/0c4fc62d6d205d2ab33620bf4e590a15.jpg", "https://mauiofficial.com/img/p/4/2/6/0/4260.jpg"],
        rentDuration: 10,
        productCode: "P-006",
        name: "Günay",
        surname: "Rzayeva",
        email: "gunay@example.com",
        phone: "0511234572",
        status: "APPROVED"
    },
    {
        id: "7",
        category: { id: 1, name: "Don" },
        gender: { id: 2, name: "Kişi" },
        offerType: { id: 2, name: "Satış" },
        condition: { id: 2, name: "SECOND_HAND" },
        colors: [
            { id: 5, name: "Ağ", hex: COLORS.find(c => c.name === "Ağ")?.hex || "#FFFFFF" },
            { id: 2, name: "Mavi", hex: COLORS.find(c => c.name === "Mavi")?.hex || "#0000FF" }
        ],
        sizes: ["XL", "XXL"],
        price: 75,
        images: ["https://i.pinimg.com/736x/0c/4f/c6/0c4fc62d6d205d2ab33620bf4e590a15.jpg", "https://mauiofficial.com/img/p/4/2/6/0/4260.jpg"],
        rentDuration: 1,
        productCode: "P-007",
        name: "Orxan",
        surname: "Veliyev",
        email: "orxan@example.com",
        phone: "0511234573",
        status: "APPROVED"
    },
    {
        id: "8",
        category: { id: 1, name: "Don" },
        gender: { id: 1, name: "Qadın" },
        offerType: { id: 1, name: "Kirayə" },
        condition: { id: 1, name: "FIRST_HAND" },
        colors: [
            { id: 5, name: "Ağ", hex: COLORS.find(c => c.name === "Ağ")?.hex || "#FFFFFF" },
            { id: 2, name: "Mavi", hex: COLORS.find(c => c.name === "Mavi")?.hex || "#0000FF" }
        ],
        sizes: ["S", "M", "L"],
        price: 38,
        images: ["https://i.pinimg.com/736x/0c/4f/c6/0c4fc62d6d205d2ab33620bf4e590a15.jpg", "https://mauiofficial.com/img/p/4/2/6/0/4260.jpg"],
        rentDuration: 7,
        productCode: "P-008",
        name: "Sevinc",
        surname: "Eliyeva",
        email: "sevinc@example.com",
        phone: "0511234574",
        status: "APPROVED"
    }
];

const ProductDetails: React.FC = () => {
    const { urlid } = useParams<{ urlid: string }>();
    const [thumbsSwiper, setThumbsSwiper] = useState<SwiperClass | null>(null);

    const product = localProducts.find(
        (p) => slugify(String(p.id), { lower: true }) === urlid
    );

    if (!product) return <div className="alert alert-warning">Paltar tapılmadı</div>;

    const { category, gender, colors, sizes, images } = product;

    return (
        <div className="py-8 px-4">
            <div className="max-w-6xl mx-auto bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-200">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8">
                    {/* Images */}
                    <div className="space-y-4">
                        <div className="relative rounded-2xl overflow-hidden shadow-lg h-96 bg-gradient-to-br from-blue-50 to-purple-50">
                            <Swiper
                                loop={images.length > 1}
                                spaceBetween={10}
                                thumbs={{ swiper: thumbsSwiper }}
                                modules={[FreeMode, Thumbs]}
                                className="h-full"
                            >
                                {images.length > 0 ? (
                                    images.map((img, idx) => (
                                        <SwiperSlide key={idx}>
                                            <img src={img} alt={product.name} className="w-full h-full object-cover" />
                                        </SwiperSlide>
                                    ))
                                ) : (
                                    <SwiperSlide>
                                        <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-400">
                                            Şəkil yoxdur
                                        </div>
                                    </SwiperSlide>
                                )}
                            </Swiper>
                        </div>

                        {/* Thumbnail slider */}
                        <Swiper
                            onSwiper={setThumbsSwiper}
                            loop={images.length > 1}
                            spaceBetween={12}
                            slidesPerView={Math.min(images.length, 4)}
                            freeMode
                            watchSlidesProgress
                            modules={[FreeMode, Thumbs]}
                            className="thumbnail-slider"
                        >
                            {images.length > 0 && images.map((img, idx) => (
                                <SwiperSlide key={idx} className="cursor-pointer">
                                    <div className="rounded-xl overflow-hidden border-2 border-transparent transition-all duration-200 hover:border-purple-400 h-20">
                                        <img src={img} alt={`thumb-${idx}`} className="w-full h-full object-cover" />
                                    </div>
                                </SwiperSlide>
                            ))}
                        </Swiper>
                    </div>

                    {/* Product Info */}
                    <div className="flex flex-col space-y-6">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">{product.name} {product.surname}</h1>
                            <div className="flex items-baseline mt-2">
                                <span className="text-3xl font-extrabold text-purple-500">{product.price} AZN</span>
                                {product.offerType.name === "Kirayə" && <span className="ml-1 text-sm text-gray-500">/gün</span>}
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
                        <div className="flex gap-3">
                            {colors.map((c) => (
                                <div
                                    key={c.id}
                                    className="w-10 h-10 rounded-full border-2 border-gray-300"
                                    style={{ backgroundColor: c.hex }}
                                ></div>
                            ))}
                        </div>


                        {/* Sizes */}
                        <div>
                            <p className="text-sm font-semibold text-gray-700 mb-3">Ölçü seçimi</p>
                            <div className="flex flex-wrap gap-2">
                                {sizes.map((size) => (
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
                            <p className="text-blue-900 font-medium mb-0">{product.name} {product.surname}</p>
                            <p className="text-blue-900 font-medium">{product.email}</p>
                            <button className="w-full flex items-center justify-center gap-3 font-semibold py-4 px-6 rounded-2xl bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 hover:from-purple-100 hover:to-pink-100 hover:border-purple-300 transition-all duration-300">
                                <div className="bg-purple-100 p-2 rounded-full">
                                    <PhoneIcon className="h-5 w-5 text-purple-600" />
                                </div>
                                <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">{product.phone}</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetails;