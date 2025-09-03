import { useState, useRef, type ChangeEvent, type FormEvent } from "react";
import { useAddClothesMutation } from "../tools/product";
import Swal from "sweetalert2";
import type { Option } from "../components/SelectButton";
import SelectButton, { MultiSelectButton } from "../components/SelectButton";

interface FormData {
  category: Option | null;
  color: Option[];
  gender: Option | null;
  price: number;
  size: string[];
  images: File[]; // Changed from string[] to File[]
  offerType: "RENT" | "SALE";
  condition: "FIRST_HAND" | "SECOND_HAND";
  rentDuration?: number;
  productCode: string;
}

const options = {
  categories: [
    { id: 1, name: "Don" },
    { id: 2, name: "Kostyum" },
  ],
  size: [
    { id: 1, name: "S" },
    { id: 2, name: "M" },
    { id: 3, name: "L" },
    { id: 4, name: "XL" },
    { id: 5, name: "XXL" },
  ],
  genders: [
    { id: 1, name: "Qadın" },
    { id: 2, name: "Kişi" },
    { id: 3, name: "Uşaq" },
  ],
  colors: [
    { id: 1, name: "Qırmızı" },
    { id: 2, name: "Mavi" },
    { id: 3, name: "Yaşıl" },
    { id: 4, name: "Qara" },
    { id: 5, name: "Ağ" },
    { id: 6, name: "Çəhrayı" },
    { id: 7, name: "Bənövşəyi" },
  ],
  conditions: [
    { id: 1, name: "FIRST_HAND" },
    { id: 2, name: "SECOND_HAND" },
  ],
  offerTypes: [
    { id: 1, name: "RENT" },
    { id: 2, name: "SALE" },
  ],
};

const colorMap: Record<string, string> = {
  "Qırmızı": "RED",
  "Mavi": "BLUE",
  "Yaşıl": "GREEN",
  "Qara": "BLACK",
  "Ağ": "WHITE",
  "Çəhrayı": "PINK",
  "Bənövşəyi": "PURPLE"
};

const genderMap: Record<string, string> = {
  "Qadın": "WOMAN",
  "Kişi": "MAN",
  "Uşaq": "UNISEX",
};

const conditionMap: Record<string, string> = {
  "FIRST_HAND": "FIRST_HAND",
  "SECOND_HAND": "SECOND_HAND",
};

const offerTypeMap: Record<string, string> = {
  "RENT": "RENT",
  "SALE": "SALE",
};

const generateProductCode = () => {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 1000);
  return `P-${timestamp}-${random}`;
};

const AddCloth = () => {
  const [formData, setFormData] = useState<FormData>({
    category: null,
    color: [],
    gender: null,
    price: 0,
    size: [],
    images: [],
    offerType: "SALE",
    condition: "FIRST_HAND",
    rentDuration: 1,
    productCode: generateProductCode(),
  });

  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});
  const [addClothes, { isLoading }] = useAddClothesMutation();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  const optionsForSelect: Record<string, Option[]> = {
    categories: options.categories,
    sizes: options.size,
    genders: options.genders,
    colors: options.colors,
    conditions: options.conditions,
    offerTypes: options.offerTypes,
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof FormData, string>> = {};

    if (!formData.category) newErrors.category = "Category is required";
    if (formData.color.length === 0) newErrors.color = "At least one color is required";
    if (!formData.gender) newErrors.gender = "Gender is required";
    if (formData.price <= 0) newErrors.price = "Valid price is required";
    if (formData.size.length === 0) newErrors.size = "At least one size is required";
    if (formData.images.length === 0) newErrors.images = "At least one image is required";
    if (formData.offerType === "RENT" && (!formData.rentDuration || formData.rentDuration <= 0)) {
      newErrors.rentDuration = "Valid rent duration is required for rental offers";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const fileArray = Array.from(files);
      const imageUrls: string[] = [];
      
      for (let i = 0; i < fileArray.length; i++) {
        imageUrls.push(URL.createObjectURL(fileArray[i]));
      }

      setFormData(prev => ({
        ...prev,
        images: [...prev.images, ...fileArray].slice(0, 10) // Allow up to 10 images
      }));

      setImagePreviews(prev => [...prev, ...imageUrls].slice(0, 10));

      if (errors.images) {
        setErrors(prev => ({ ...prev, images: undefined }));
      }
    }
  };

  const handleSizeChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      size: checked
        ? [...prev.size, value]
        : prev.size.filter(s => s !== value)
    }));

    if (errors.size) {
      setErrors(prev => ({ ...prev, size: undefined }));
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      Swal.fire({
        title: "Validation Error!",
        text: "Please fill all required fields correctly",
        icon: "error",
        confirmButtonText: "OK"
      });
      return;
    }

    try {
      // Prepare colorAndSizes array based on selected colors and sizes
      const colorAndSizes = formData.color.flatMap(colorOption =>
        formData.size.map(size => ({
          color: colorMap[colorOption.name] || colorOption.name,
          size: size,
          photoCount: formData.images.filter((_, index) => {
            // This is a simplified approach - you might need to adjust
            // how you associate images with colors based on your UI
            return true; // For now, just count all images
          }).length
        }))
      );

      // Create the product object according to the API structure
      const product = {
        productCode: formData.productCode,
        subcategoryId: formData.category?.id,
        price: formData.price,
        gender: genderMap[formData.gender?.name ?? ""] || "UNISEX",
        colorAndSizes: colorAndSizes,
        createdAt: new Date().toISOString(),
        offers: {
          offerType: formData.offerType,
          condition: formData.condition,
          rentDuration: formData.offerType === "RENT" ? formData.rentDuration : undefined,
        },
      };

      // Create FormData for the request
      const submitFormData = new FormData();
      submitFormData.append(
        "product",
        new Blob([JSON.stringify(product)], { type: "application/json" })
      );

      // Add all images to FormData
      formData.images.forEach(file => {
        submitFormData.append("images", file);
      });

      // Use the mutation hook to submit the data
      const result = await addClothes(submitFormData).unwrap();

      Swal.fire({
        title: "Success!",
        text: "Clothing item added successfully",
        icon: "success",
        confirmButtonText: "OK"
      });

      // Reset form
      setFormData({
        category: null,
        color: [],
        gender: null,
        price: 0,
        size: [],
        images: [],
        offerType: "SALE",
        condition: "FIRST_HAND",
        rentDuration: 1,
        productCode: generateProductCode(),
      });
      setImagePreviews([]);
      if (fileInputRef.current) fileInputRef.current.value = "";

    } catch (error: any) {
      let errorMessage = "Failed to add clothing item";
      if (error.data?.message) {
        errorMessage = error.data.message;
      } else if (error.status) {
        errorMessage = `Server error: ${error.status}`;
      } else if (error.message) {
        errorMessage = error.message;
      }

      Swal.fire({
        title: "Error!",
        text: errorMessage,
        icon: "error",
        confirmButtonText: "OK"
      });
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white p-8 rounded-2xl shadow-lg">
        <h2 className="text-3xl mb-8 text-center font-bold bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">
          Yeni Geyim Əlavə Et
        </h2>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
            {/* Price */}
            <div className="flex flex-col">
              <label className="font-semibold mb-2 text-gray-700">Qiymət *</label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={e => setFormData(prev => ({ ...prev, price: Number(e.target.value) }))}
                className="px-4 py-3 border-2 border-gray-200 rounded-xl text-base focus:outline-none focus:border-purple-600"
              />
              {errors.price && <span className="text-red-500 text-sm mt-1">{errors.price}</span>}
            </div>

            {/* Offer Type */}
            <div className="flex flex-col">
              <label className="font-semibold mb-2 text-gray-700">Təklif Növü *</label>
              <select
                value={formData.offerType}
                onChange={e => setFormData(prev => ({ 
                  ...prev, 
                  offerType: e.target.value as "RENT" | "SALE" 
                }))}
                className="px-4 py-3 border-2 border-gray-200 rounded-xl text-base focus:outline-none focus:border-purple-600"
              >
                <option value="SALE">Satış</option>
                <option value="RENT">Kirayə</option>
              </select>
            </div>

            {/* Rent Duration (only for RENT) */}
            {formData.offerType === "RENT" && (
              <div className="flex flex-col">
                <label className="font-semibold mb-2 text-gray-700">Kirayə Müddəti (gün) *</label>
                <input
                  type="number"
                  value={formData.rentDuration}
                  onChange={e => setFormData(prev => ({ 
                    ...prev, 
                    rentDuration: Number(e.target.value) 
                  }))}
                  className="px-4 py-3 border-2 border-gray-200 rounded-xl text-base focus:outline-none focus:border-purple-600"
                />
                {errors.rentDuration && <span className="text-red-500 text-sm mt-1">{errors.rentDuration}</span>}
              </div>
            )}

            {/* Condition */}
            <div className="flex flex-col">
              <label className="font-semibold mb-2 text-gray-700">Vəziyyət *</label>
              <select
                value={formData.condition}
                onChange={e => setFormData(prev => ({ 
                  ...prev, 
                  condition: e.target.value as "FIRST_HAND" | "SECOND_HAND" 
                }))}
                className="px-4 py-3 border-2 border-gray-200 rounded-xl text-base focus:outline-none focus:border-purple-600"
              >
                <option value="FIRST_HAND">Yeni</option>
                <option value="SECOND_HAND">İşlənmiş</option>
              </select>
            </div>
          </div>

          {/* Image Upload */}
          <div className="mb-8">
            <label className="font-semibold mb-2 text-gray-700 block">
              Şəkillər (Maksimum 10 ədəd) *
            </label>

            <div
              className="border-2 border-dashed border-purple-600 rounded-xl p-8 text-center hover:bg-gray-50 transition cursor-pointer"
              onClick={() => fileInputRef.current?.click()}
            >
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
              <p className="text-gray-500 mt-2">
                Şəkilləri seçin və ya buraya sürükləyin
              </p>
            </div>

            {imagePreviews.length > 0 && (
              <div className="flex gap-4 flex-wrap mt-4">
                {imagePreviews.map((img, i) => (
                  <div key={i} className="relative w-24 h-24">
                    <img src={img} alt="preview" className="w-full h-full object-cover rounded-lg" />
                  </div>
                ))}
              </div>
            )}
            {errors.images && <span className="text-red-500 text-sm mt-1">{errors.images}</span>}
          </div>

          <div className="grid grid-cols-3 gap-4 mb-8">
            <SelectButton
              label="Kateqoriya"
              selected={formData.category}
              setSelected={option => setFormData(prev => ({ ...prev, category: option || null }))}
              options={optionsForSelect.categories}
            />
            {errors.category && <span className="text-red-500 text-sm mt-1">{errors.category}</span>}

            <SelectButton
              label="Cins"
              selected={formData.gender}
              setSelected={option => setFormData(prev => ({ ...prev, gender: option || null }))}
              options={optionsForSelect.genders}
            />
            {errors.gender && <span className="text-red-500 text-sm mt-1">{errors.gender}</span>}

            <MultiSelectButton
              label="Rənglər"
              selected={formData.color}
              setSelected={options => setFormData(prev => ({ ...prev, color: options }))}
              options={optionsForSelect.colors}
            />
            {errors.color && <span className="text-red-500 text-sm mt-1">{errors.color}</span>}
          </div>

          {/* Sizes */}
          <div className="mb-8">
            <label className="font-semibold text-gray-700 block mb-2">Ölçülər *</label>
            <div className="flex flex-wrap gap-4">
              {["S", "M", "L", "XL", "XXL"].map(size => (
                <label key={size} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    value={size}
                    checked={formData.size.includes(size)}
                    onChange={handleSizeChange}
                    className="w-5 h-5 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                  />
                  {size}
                </label>
              ))}
            </div>
            {errors.size && <span className="text-red-500 text-sm mt-1">{errors.size}</span>}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 rounded-full font-bold text-lg text-white bg-gradient-to-r from-purple-500 to-purple-700 hover:shadow-lg hover:-translate-y-0.5 transition"
          >
            {isLoading ? "Adding..." : "Geyim Əlavə Et"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddCloth;