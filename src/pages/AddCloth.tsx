import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import { CheckIcon } from "lucide-react";
import Swal from "sweetalert2";
import { useAddProductsMutation } from "../tools/product";
import { useGetSubcategoriesQuery } from "../tools/subCategory";
import { useGetCategoriesQuery } from "../tools/categories";
import SelectButton from "../components/SelectButton";

// ------------------- TYPES -------------------
interface Option {
  id: string;
  name: string;
  value: string;
}

interface Category {
  id: string;
  name: string;
}

interface Subcategory {
  id: string;
  name: string;
  category: {
    id: string;
    name: string;
  };
}

interface ColorSizeVariant {
  color: string;
  colorName: string;
  sizes: string[];
  imageUrls: File[];
  imagePreviews?: string[];
}

interface FormData {
  userName: string;
  userSurname: string;
  userEmail: string;
  userPhone: string;
  productCode: string;
  gender: string;
  subcategory: {
    id: string;
    name: string;
    category: {
      id: string;
      name: string
    }
  };
  price: string;
  description: string;
  offerType: string;
  condition: string;
  colorAndSizes: ColorSizeVariant[];
}

// ------------------- STATIC OPTIONS -------------------
export const colorOptions: Option[] = [
  { id: "1", name: "Qırmızı", value: "RED" },
  { id: "2", name: "Yaşıl", value: "GREEN" },
  { id: "3", name: "Mavi", value: "BLUE" },
  { id: "4", name: "Sarı", value: "YELLOW" },
  { id: "5", name: "Qara", value: "BLACK" },
  { id: "6", name: "Ağ", value: "WHITE" },
  { id: "7", name: "Narıncı", value: "ORANGE" },
  { id: "8", name: "Bənövşəyi", value: "PURPLE" },
  { id: "9", name: "Çəhrayı", value: "PINK" },
  { id: "10", name: "Qəhvəyi", value: "BROWN" },
  { id: "11", name: "Boz", value: "GRAY" },
  { id: "12", name: "Bej", value: "BEIGE" },
];

const sizeOptions: Option[] = [
  { id: "1", name: "XS", value: "XS" },
  { id: "2", name: "S", value: "S" },
  { id: "3", name: "M", value: "M" },
  { id: "4", name: "L", value: "L" },
  { id: "5", name: "XL", value: "XL" },
  { id: "6", name: "XXL", value: "XXL" },
];

const offerTypeOptions: Option[] = [
  { id: "1", name: "Kirayə", value: "RENT" },
  { id: "2", name: "Satış", value: "SALE" },
];

const conditionOptions: Option[] = [
  { id: "1", name: "Birinci Əl", value: "FIRST_HAND" },
  { id: "2", name: "İkinci Əl", value: "SECOND_HAND" },
];

const genderOptions: Option[] = [
  { id: "1", name: "Qadın", value: "WOMAN" },
  { id: "2", name: "Kişi", value: "MAN" },
  { id: "3", name: "Uşaq", value: "KID" },
];

// ------------------- HELPERS -------------------
const getColorClass = (colorValue: string) => {
  const colorMap: Record<string, string> = {
    RED: "bg-red-500",
    GREEN: "bg-green-500",
    BLUE: "bg-blue-500",
    YELLOW: "bg-yellow-400",
    BLACK: "bg-black",
    WHITE: "bg-white border border-gray-300",
    ORANGE: "bg-orange-500",
    PURPLE: "bg-purple-500",
    PINK: "bg-pink-400",
    BROWN: "bg-amber-900",
    GRAY: "bg-gray-400",
    BEIGE: "bg-amber-200",
  };
  return colorMap[colorValue] || "bg-gray-200";
};

// ------------------- MAIN COMPONENT -------------------
const AddCloth: React.FC = () => {
  const { data: categories = [] } = useGetCategoriesQuery([]);
  const { data: subcategories = [] } = useGetSubcategoriesQuery([]);
  const [addProducts, { isLoading }] = useAddProductsMutation();
  const [errors, setErrors] = useState<Record<string, any>>({});

  const [formData, setFormData] = useState<FormData>({
    userName: "",
    userSurname: "",
    userEmail: "",
    userPhone: "",
    productCode: "",
    gender: "",
    subcategory: {
      id: "",
      name: "",
      category: {
        id: "",
        name: ""
      }
    },
    price: "",
    description: "",
    offerType: "",
    condition: "",
    colorAndSizes: [{ color: "BLACK", colorName: "Qara", sizes: [], imageUrls: [] }],
  });

  const [filteredSubcategories, setFilteredSubcategories] = useState<Subcategory[]>([]);

  // ------------------- EFFECTS -------------------
  useEffect(() => {
    if (!subcategories.length) return;

    if (!formData.subcategory.category.id) {
      setFilteredSubcategories(subcategories);
    } else {
      const filtered = subcategories.filter(
        (sc: Subcategory) => sc.category.id === formData.subcategory.category.id
      );
      setFilteredSubcategories(filtered);
    }
  }, [formData.subcategory.category.id, subcategories]);

  // ------------------- OPTIONS FOR SELECTS -------------------
  const genderSelectOptions: Option[] = [
    { id: "0", name: "Cins seçin", value: "" },
    ...genderOptions,
  ];

  const categorySelectOptions: Option[] = [
    { id: "0", name: "Kateqoriya seçin", value: "" },
    ...categories.map((c: Category) => ({
      id: c.id,
      name: c.name,
      value: c.id,
    })),
  ];

  const subcategorySelectOptions: Option[] = [
    { id: "0", name: "Alt kateqoriya seçin", value: "" },
    ...filteredSubcategories.map((sc: Subcategory) => ({
      id: sc.id,
      name: sc.name,
      value: sc.id,
    })),
  ];


  // ------------------- HANDLERS -------------------
  const handleChange = (e: any) => {
    const { name, value } = e.target;
    const cleanValue = value.replace(/[^a-zA-ZƏÖÜŞÇĞİəöüşıçğİ\s]/g, "");

    setFormData((prev) => ({ ...prev, [name]: cleanValue }));
  };

  const handleGenderSelect = (value: string) => {
    setFormData(prev => ({ ...prev, gender: value }));
  };

  const handleCategorySelect = (value: string) => {
    const selectedCategory = categories.find((c: Category) => c.id === value);
    setFormData((prev) => ({
      ...prev,
      subcategory: {
        id: "",
        name: "",
        category: selectedCategory
          ? { id: selectedCategory.id, name: selectedCategory.name }
          : { id: "", name: "" },
      },
    }));
  };

  const handleSubcategorySelect = (value: string) => {
    const selectedSubcategory = subcategories.find((sc: Subcategory) => sc.id === value);

    if (!selectedSubcategory) {
      setFormData((prev) => ({
        ...prev,
        subcategory: {
          id: "",
          name: "",
          category: { id: "", name: "" },
        },
      }));
      return;
    }
    const parentCategory = categories.find((c: Category) => c.id === selectedSubcategory.category.id);

    setFormData((prev) => ({
      ...prev,
      subcategory: {
        id: selectedSubcategory.id,
        name: selectedSubcategory.name,
        category: parentCategory
          ? { id: parentCategory.id, name: parentCategory.name }
          : { id: "", name: "" },
      },
    }));
    console.log("Seçilmiş subkateqoriya:", selectedSubcategory);
  };

  const handleColorSelect = (colorValue: string) => {
    setFormData((prev) => {
      const exists = prev.colorAndSizes.find((cs) => cs.color === colorValue);
      let updatedColors: ColorSizeVariant[];
      if (exists) {
        updatedColors = prev.colorAndSizes.filter((cs) => cs.color !== colorValue);
      } else {
        const colorName = colorOptions.find((c) => c.value === colorValue)?.name || "";
        updatedColors = [...prev.colorAndSizes, { color: colorValue, colorName, sizes: [], imageUrls: [] }];
      }
      return { ...prev, colorAndSizes: updatedColors };
    });
  };

  const handleSizeSelect = (colorValue: string, size: string) => {
    setFormData((prev) => ({
      ...prev,
      colorAndSizes: prev.colorAndSizes.map((cs) => {
        if (cs.color === colorValue) {
          const newSizes = cs.sizes.includes(size)
            ? cs.sizes.filter((s) => s !== size)
            : [...cs.sizes, size];
          return { ...cs, sizes: newSizes };
        }
        return cs;
      }),
    }));
  };

  const handleImageUpload = (colorValue: string, files: FileList | null) => {
    if (!files) return;
    const fileArray = Array.from(files);

    const previewPromises = fileArray.map(file => {
      return new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target?.result as string);
        reader.readAsDataURL(file);
      });
    });

    Promise.all(previewPromises).then(previews => {
      setFormData((prev) => ({
        ...prev,
        colorAndSizes: prev.colorAndSizes.map((cs) =>
          cs.color === colorValue ? {
            ...cs,
            imageUrls: fileArray,
            imagePreviews: previews
          } : cs
        ),
      }));
    });
  };

  const removeImage = (colorValue: string, index: number) => {
    setFormData((prev) => ({
      ...prev,
      colorAndSizes: prev.colorAndSizes.map((cs) => {
        if (cs.color === colorValue) {
          const newImageUrls = [...cs.imageUrls];
          const newImagePreviews = [...(cs.imagePreviews || [])];
          newImageUrls.splice(index, 1);
          newImagePreviews.splice(index, 1);
          return {
            ...cs,
            imageUrls: newImageUrls,
            imagePreviews: newImagePreviews
          };
        }
        return cs;
      }),
    }));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.userName.trim()) newErrors.userName = "Ad daxil edin";
    if (!formData.userSurname.trim()) newErrors.userSurname = "Soyad daxil edin";

    if (!formData.userEmail.trim()) newErrors.userEmail = "E-mail daxil edin. example@gmail.com";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.userEmail))
      newErrors.userEmail = "Düzgün e-mail daxil edin";

    if (!formData.userPhone.trim() || formData.userPhone.length !== 9)
      newErrors.userPhone = "Telefon nömrəsi düzgün daxil edilməyib";

    if (!formData.gender) newErrors.gender = "Cins seçin";
    if (!formData.subcategory.category.id) newErrors.category = "Kateqoriya seçin";
    if (!formData.subcategory.id) newErrors.subcategory = "Alt kateqoriya seçin";
    if (!formData.offerType) newErrors.offerType = "İstifadə forması seçin";
    if (!formData.condition) newErrors.condition = "Vəziyyət seçin";

    if (formData.colorAndSizes.length === 0) {
      newErrors.colorAndSizes = "Ən azı bir rəng seçin";
    } else {
      formData.colorAndSizes.forEach((cs, index) => {
        if (!cs.sizes || cs.sizes.length === 0) {
          newErrors[`colorAndSizes[${index}].sizes`] = `${cs.colorName || cs.color} rəngi üçün ölçü seçin`;
        }

        const imageCount = cs.imageUrls?.length || 0;
        if (imageCount < 3) {
          newErrors[`colorAndSizes[${index}].images`] = `${cs.colorName || cs.color} rəngi üçün ən azı 3 şəkil yükləyin`;
        } else if (imageCount > 10) {
          newErrors[`colorAndSizes[${index}].images`] = `${cs.colorName || cs.color} rəngi üçün maksimum 10 şəkil yükləyə bilərsiniz`;
        }
      });
    }

    if (!formData.price.trim()) newErrors.price = "Qiymət daxil edin";
    if (!formData.description.trim()) newErrors.description = "Qeyd bölməsini doldurun";

    return newErrors;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      Swal.fire({ icon: "error", title: "Xəta!", text: "Bütün sahələri düzgün doldurun" });
      return;
    }
    setErrors({});

    const phoneRegex = /^(50|51|55|70|77|99)\d{7}$/;
    if (!phoneRegex.test(formData.userPhone)) {
      Swal.fire({
        icon: "error",
        title: "Xəta!",
        text: "Telefon nömrəsi düzgün formatda deyil. İlk iki rəqəm 50,51,55,70,99 olmalıdır.",
      });
      return;
    }

    const payload = {
      userName: formData.userName,
      userSurname: formData.userSurname,
      userEmail: formData.userEmail,
      userPhone: `+994${formData.userPhone}`,
      gender: formData.gender,
      subcategoryId: formData.subcategory.id,
      categoryId: formData.subcategory.category.id,
      offerType: formData.offerType,
      condition: formData.condition,
      description: formData.description,
      productOffers: [
        {
          offerType: formData.offerType,
          price: Number(formData.price),
          condition: formData.condition,
          rentDuration: formData.offerType === "RENT" ? 1 : undefined,
        },
      ],
      colorAndSizes: formData.colorAndSizes.map(cs => ({
        color: cs.color,
        sizes: cs.sizes,
        imageUrls: []
      })),
    };

    const formPayload = new FormData();
    formPayload.append("product", new Blob([JSON.stringify(payload)], { type: "application/json" }));

    formData.colorAndSizes.forEach(cs => {
      if (cs.imageUrls && cs.imageUrls.length > 0) {
        const colorKey = cs.color;
        const sizeKey = cs.sizes.join("_");
        const key = `images_${colorKey}_${sizeKey}`;

        cs.imageUrls.forEach((file: File) => {
          formPayload.append(key, file);
        });
      }
    });

    try {
      const response = await addProducts(formPayload).unwrap();
      const productCode = response.productCode || response.id || response.code;

      Swal.fire({
        icon: "success",
        title: "Uğurla göndərildi!",
        html: productCode
          ? `Məhsulunuz əlavə edildi.<br><strong>Məhsul Kodu: ${productCode}</strong>`
          : "Məhsulunuz əlavə edildi",
        showConfirmButton: true,
        confirmButtonText: "OK",
      });

      setFormData({
        userName: "",
        userSurname: "",
        userEmail: "",
        userPhone: "",
        productCode: "",
        gender: "",
        subcategory: {
          id: "",
          name: "",
          category: {
            id: "",
            name: ""
          }
        },
        price: "",
        description: "",
        offerType: "",
        condition: "",
        colorAndSizes: [{ color: "BLACK", colorName: "Qara", sizes: [], imageUrls: [] }],
      });
      setErrors({});
    } catch (error: any) {
      console.error("Submission error:", error);
      Swal.fire({
        icon: "error",
        title: "Xəta!",
        text: error.data?.message || "Yenidən cəhd edin",
      });
    }
  };

  return (
    <div className="py-10">
      <p className="mb-10 text-[#4A5565] text-[14px] flex items-center">
        <Link to="/" className="hover:text-black">Əsas</Link>
        <ChevronLeftIcon className="translate-y-[1px]" />
        Məhsul Əlavə et
      </p>

      <form onSubmit={handleSubmit} className="space-y-10" encType="multipart/form-data">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Contact Info */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-black mb-2">Ad</label>
            <input
              type="text"
              name="userName"
              placeholder="Ad"
              value={formData.userName}
              onChange={handleChange}
              className="px-4 py-3 border rounded-lg outline-none border-[#D4D4D4]"
            />
            {errors.userName && (
              <p className="text-red-500 text-sm mt-1">{errors.userName}</p>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-black mb-2">Soyad</label>
            <input
              type="text"
              name="userSurname"
              placeholder="Soyad"
              value={formData.userSurname}
              onChange={handleChange}
              className="px-4 py-3 border rounded-lg outline-none border-[#D4D4D4]"
            />
            {errors.userSurname && (
              <p className="text-red-500 text-sm mt-1">{errors.userSurname}</p>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-black mb-2">E-mail</label>
            <input
              type="email"
              name="userEmail"
              placeholder="E-mail"
              value={formData.userEmail}
              onChange={(e) => {
                const { name, value } = e.target;
                const cleanValue = value.replace(/[^a-zA-Z0-9@._-]/g, "");
                setFormData((prev) => ({ ...prev, [name]: cleanValue }));
              }}
              className="px-4 py-3 border rounded-lg outline-none border-[#D4D4D4]"
            />
            {errors.userEmail && (
              <p className="text-red-500 text-sm mt-1">{errors.userEmail}</p>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-black mb-2">Telefon</label>
            <div className="relative">
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                +994
              </div>
              <input
                name="userPhone"
                value={formData.userPhone}
                maxLength={9}
                onChange={(e) => {
                  const digits = e.target.value.replace(/\D/g, "").slice(0, 9);
                  setFormData((prev) => ({ ...prev, userPhone: digits }));
                }}
                className="pl-16 pr-4 py-3 border rounded-lg outline-none w-full border-[#D4D4D4]"
                placeholder="xx xxx xx xx"
              />
            </div>
            {errors.userPhone && (
              <p className="text-red-500 text-sm mt-1">{errors.userPhone}</p>
            )}
          </div>

          {/* Gender, Category & Subcategory */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-black">Cins</label>
            <SelectButton
              selected={formData.gender}
              setSelected={handleGenderSelect}
              options={genderSelectOptions}
              default="Cins"
            />
            {errors.gender && <p className="text-red-500 text-sm mt-1">{errors.gender}</p>}
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-black">Kateqoriya</label>
            <SelectButton
              selected={formData.subcategory.category.id}
              setSelected={handleCategorySelect}
              options={categorySelectOptions}
              default="Kateqoriya"
            />
            {errors.category && <p className="text-red-500 text-sm mt-1">{errors.category}</p>}
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-black">Alt Kateqoriya</label>
            <SelectButton
              selected={formData.subcategory.id}
              setSelected={handleSubcategorySelect}
              options={subcategorySelectOptions}
              default="Alt Kateqoriya"
            />
            {errors.subcategory && <p className="text-red-500 text-sm mt-1">{errors.subcategory}</p>}
          </div>

          {/* Offer Type & Condition */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-black">İstifadə forması</label>
            <SelectButton
              selected={formData.offerType}
              setSelected={(value) => setFormData(prev => ({ ...prev, offerType: value }))}
              options={offerTypeOptions}
              default="İstifadə forması"
            />
            {errors.offerType && (
              <p className="text-red-500 text-sm mt-1">{errors.offerType}</p>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-black">Vəziyyət</label>
            <SelectButton
              selected={formData.condition}
              setSelected={(value) => setFormData(prev => ({ ...prev, condition: value }))}
              options={conditionOptions}
              default="Vəziyyət"
            />
            {errors.condition && (
              <p className="text-red-500 text-sm mt-1">{errors.condition}</p>
            )}
          </div>

          {/* Color Selection */}
          <div className="col-span-1 sm:col-span-2">
            <h3 className="text-lg font-medium mb-4">Rəng Seçimi</h3>
            <div className="grid grid-cols-6 gap-4 mb-2 bg-white border border-[#D4D4D4] rounded-lg p-5">
              {colorOptions.map((color) => (
                <div
                  key={color.id}
                  className="relative cursor-pointer"
                  onClick={() => handleColorSelect(color.value)}
                >
                  <div className={`w-[32px] h-[32px] rounded-lg ${getColorClass(color.value)}`} />
                  {formData.colorAndSizes.some(cs => cs.color === color.value) && (
                    <div className="w-[32px] h-[32px] absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 rounded-lg">
                      <CheckIcon className="text-white w-5 h-5" />
                    </div>
                  )}
                </div>
              ))}
            </div>
            {errors.colorAndSizes && (
              <p className="text-red-500 text-sm mb-4">{errors.colorAndSizes}</p>
            )}
          </div>

          {/* Color Variants */}
          {formData.colorAndSizes.map((cs, index) => (
            <div key={cs.color} className="col-span-1 sm:col-span-2 relative mb-6">
              <div className="flex items-center gap-3 mb-4">
                <h4 className="font-medium text-md">Rəng: {cs.colorName}</h4>
                <div className={`w-8 h-8 rounded-lg ${getColorClass(cs.color)} border border-gray-300`} />
              </div>

              {/* Sizes */}
              <div className="w-full grid grid-cols-1 gap-3 mb-4">
                <label className="text-md font-medium">Ölçülər</label>
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                  {sizeOptions.map((size) => (
                    <button
                      key={size.id}
                      type="button"
                      onClick={() => handleSizeSelect(cs.color, size.value)}
                      className={`cursor-pointer w-full h-[50px] flex justify-center items-center rounded-lg ${cs.sizes.includes(size.value)
                        ? 'bg-black text-white'
                        : 'bg-[#E5E7EB] text-gray-600'
                        }`}
                    >
                      {size.name}
                    </button>
                  ))}
                </div>
                {errors[`colorAndSizes[${index}].sizes`] && (
                  <p className="text-red-500 text-sm mt-1">{errors[`colorAndSizes[${index}].sizes`]}</p>
                )}
              </div>

              {/* Images */}
              <div>
                <label className="text-md font-medium mb-1">Şəkil yüklə</label>
                <p className="text-gray-500 mb-2">
                  {cs.imageUrls.length}/10 şəkil (minimum 3)
                </p>

                {/* Image Upload Area */}
                <label className="flex flex-col gap-2 items-center justify-center h-[100px] border-2 border-dashed border-black rounded-[16px] cursor-pointer text-center text-gray-500 hover:bg-gray-100">
                  <span className="px-5">Şəkil yükləmək üçün seçin və ya buraya sürükləyin</span>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleImageUpload(cs.color, e.target.files)}
                  />
                </label>

                {/* Image Previews */}
                {cs.imagePreviews && cs.imagePreviews.length > 0 && (
                  <div className="mt-4">
                    <p className="text-sm font-medium mb-2">Yüklənmiş şəkillər:</p>
                    <div className="flex gap-2 flex-wrap">
                      {cs.imagePreviews.map((preview, idx) => (
                        <div key={idx} className="relative">
                          <img
                            src={preview}
                            alt={`Preview ${idx + 1}`}
                            className="w-20 h-20 object-cover rounded border"
                          />
                          <button
                            type="button"
                            onClick={() => removeImage(cs.color, idx)}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 text-xs"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {errors[`colorAndSizes[${index}].images`] && (
                  <p className="text-red-500 text-sm mt-1">{errors[`colorAndSizes[${index}].images`]}</p>
                )}
              </div>
            </div>
          ))}

          {/* Price & Description */}
          <div className="col-span-1 sm:col-span-2 flex flex-col gap-2">
            <label className="text-sm font-medium text-black mb-2">Qiymət</label>
            <input
              type="text"
              name="price"
              value={formData.price}
              onChange={(e) => {
                const value = e.target.value;
                if (/^\d*\.?\d*$/.test(value)) {
                  setFormData((prev) => ({ ...prev, price: value }));
                }
              }}
              className="px-4 py-3 border rounded-lg outline-none border-[#D4D4D4]"
              placeholder="0.00"
              inputMode="decimal"
            />
            {errors.price && (
              <p className="text-red-500 text-sm mt-1">{errors.price}</p>
            )}
          </div>

          <div className="col-span-1 sm:col-span-2 flex flex-col gap-2">
            <label className="text-sm font-medium text-black mb-2">Qeyd</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={(e) => {
                const { name, value } = e.target;
                setFormData(prev => ({ ...prev, [name]: value }));
              }}
              className="px-4 py-3 bg-white border rounded-lg outline-none border-[#D4D4D4] h-[100px]"
            />
            {errors.description && (
              <p className="text-red-500 text-sm mt-1">{errors.description}</p>
            )}
          </div>
        </div>

        <div className="text-end">
          <button
            type="submit"
            disabled={isLoading}
            className="w-full max-w-[600px] bg-black text-white px-6 py-3 rounded-lg disabled:opacity-50"
          >
            {isLoading ? "Göndərilir..." : "Məhsul Əlavə Et"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddCloth;