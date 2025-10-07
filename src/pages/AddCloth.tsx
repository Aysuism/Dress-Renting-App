import React, { useState } from 'react';
import { optionLabels, options } from './Home';
import SelectButton, { MultiSelectButton } from '../components/SelectButton';
import { type Option } from '../tools/types';
import { Link } from 'react-router';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import { useAddProductsMutation } from '../tools/product';
import Swal from 'sweetalert2';

export const generateProductCode = () => `P-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

const colorOptions = options.colors;
const sizeOptions = options.sizes.map(size => size.name);

const categoriesByGender: Record<string, string[]> = {
  WOMAN: [
    "Gəlinlik", "Ziyafət geyimi", "Don", "Köynək", "Bluz", "Şalvar",
    "Ətək", "Şort", "Gödəkcə", "Palto", "Ayaqqabı", "Çanta", "Aksesuar", "Digər"
  ],
  MAN: ["Kostyum", "Ayaqqabı", "Aksesuar", "Digər"],
  KID: ["Don", "Kostyum", "Ayaqqabı", "Aksesuar", "Digər"]
};

export interface FormDataState {
  category: Option | null;
  gender: Option | null;
  offerTypes: Option | null;
  condition: Option | null;
  colors: Option[];
  sizes: string[];
  price: number;
  rentDuration: number;
  productCode: string;
  name: string;
  surname: string;
  email: string;
  phone: string;
  images: File[];
}

const AddCloth = () => {
  const [addProducts, { isLoading }] = useAddProductsMutation();

  const [formData, setFormData] = useState<FormDataState>({
    category: null,
    gender: null,
    offerTypes: null,
    condition: null,
    colors: [],
    sizes: [],
    price: 0,
    rentDuration: 1,
    productCode: generateProductCode(),
    name: "",
    surname: "",
    email: "",
    phone: "",
    images: []
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) || 0 : value
    }));
  };

  const handleSelectChange = (field: keyof FormDataState, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const filesArray = e.target.files ? Array.from(e.target.files) : [];
    setFormData(prev => ({ ...prev, images: filesArray }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const { images, category, offerTypes, condition, colors, sizes, name, surname, email, phone, price, gender, rentDuration, productCode } = formData;

    // ✅ Validation checks
    const errors = [
      !images.length && 'Zəhmət olmasa məhsul şəkli seçin',
      !category && 'Zəhmət olmasa kateqoriya seçin',
      offerTypes?.value === "SALE" &&
      (!condition?.value || !["FIRST_HAND", "SECOND_HAND"].includes(condition.value)) &&
      'SALE təklifləri üçün Vəziyyət FIRST_HAND və ya SECOND_HAND olmalıdır!'
    ].filter(Boolean);

    if (errors.length) {
      Swal.fire({ icon: 'error', title: 'Xəta!', text: errors[0] as string });
      return;
    }

    // ✅ Helper builders
    const sizeStockMap = Object.fromEntries(sizes.map(size => [size, 1]));
    const user = { id: 0, name, surname, email, phone, userRole: "USER" };

    const colorAndSizes = colors.map(c => ({
      id: 0,
      color: c.value,
      photoCount: images.length,
      stock: sizes.length,
      imageUrls: [],
      sizeStockMap
    }));

    const offers = [{
      id: 0,
      product: "string",
      offerType: offerTypes?.value ?? "RENT",
      price,
      rentDuration: offerTypes?.value === "RENT" ? rentDuration : 1,
      productCondition: condition?.value ?? "FIRST_HAND"
    }];

    // ✅ Main product payload
    const product = {
      id: 0,
      productCode,
      user,
      subcategoryId: category?.id ?? 0,
      colorAndSizes,
      price,
      gender: gender?.value ?? "WOMAN",
      productStatus: "PENDING",
      createdAt: new Date().toISOString(),
      productOffers: offers
    };

    // ✅ FormData builder
    const data = new FormData();
    data.append("product", new Blob([JSON.stringify(product)], { type: "application/json" }));
    images.forEach(file => data.append("images", file));

    // ✅ Submit
    try {
      await addProducts(data).unwrap();
      Swal.fire({
        icon: 'success',
        title: 'Uğurla göndərildi!',
        text: 'Məhsul inzibati təsdiq üçün göndərildi!',
        timer: 2000,
        showConfirmButton: true
      });

      // Reset
      setFormData({
        category: null,
        gender: null,
        offerTypes: null,
        condition: null,
        colors: [],
        sizes: [],
        price: 0,
        rentDuration: 1,
        productCode: generateProductCode(),
        name: "",
        surname: "",
        email: "",
        phone: "",
        images: []
      });
    } catch (error: any) {
      Swal.fire({
        icon: 'error',
        title: 'Xəta baş verdi!',
        text: error.data?.message || 'Zəhmət olmasa yenidən cəhd edin.'
      });
      console.log("❌ Error details:", error);
    }
  };

  return (
    <div className='py-10'>
      <p className="mb-10 text-[#4A5565] text-[14px] flex items-center">
        <Link to="/" className="hover:text-black">Əsas</Link>
        <ChevronLeftIcon className="translate-y-[1px]" />
        Məhsul Əlavə et
      </p>

      <form onSubmit={handleSubmit} encType="multipart/form-data">
        {/* Name, surname, email, phone */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
          {["name", "surname", "phone", "email"].map((field) => (
            <div className="flex flex-col" key={field}>
              <label htmlFor={field}>{field.charAt(0).toUpperCase() + field.slice(1)}</label>
              <input
                type={field === "email" ? "email" : field === "phone" ? "tel" : "text"}
                id={field}
                name={field}
                value={formData[field as keyof FormDataState] as string}
                placeholder={field === "phone" ? '+994' : field === "email" ? "example@gmail.com" : ""}
                onChange={handleChange}
                className="px-4 py-2 mt-2 border-1 border-[#D4D4D4] rounded-lg focus:border-purple-600"
                required
              />
            </div>
          ))}
        </div>

        {/* Images */}
        <div className="flex flex-col my-10 gap-5">
          <label htmlFor="images">Şəkillər (Maksimum 3 ədəd) *</label>
          <div
            className="border-2 border-dashed border-black rounded-[16px] p-8 text-center cursor-pointer hover:bg-gray-50"
            onClick={() => document.getElementById("images")?.click()}
          >
            <input
              type="file"
              id="images"
              name="images"
              multiple
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
            <p>Şəkilləri seçin və ya buraya sürükləyin</p>
          </div>

          {formData.images.length > 0 && (
            <div className="flex gap-4 mt-4 flex-wrap">
              {formData.images.map((file, idx) => (
                <div key={idx} className="relative w-24 h-24">
                  <img src={URL.createObjectURL(file)} alt="preview" className="w-full h-full object-cover rounded-lg" />
                  <button
                    type="button"
                    className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center"
                    onClick={() => setFormData(prev => ({ ...prev, images: prev.images.filter((_, i) => i !== idx) }))}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Gender, category, colors */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
          <div className='col-span-1 sm:col-span-2 flex gap-5'>
            <SelectButton
              selected={formData.gender}
              setSelected={(item) => handleSelectChange('gender', item)}
              options={[{ id: 0, name: "Cins", value: "" }, ...options.genders.map((o: Option) => ({
                id: o.id,
                name: optionLabels[o.name as keyof typeof optionLabels] || o.name,
                value: o.name
              }))]}
            />

            {formData.gender && (
              <SelectButton
                selected={formData.category}
                setSelected={(item) => handleSelectChange('category', item)}
                options={[{ id: 0, name: "Kateqoriya", value: "" }, ...categoriesByGender[formData.gender.value as keyof typeof categoriesByGender].map((name, idx) => ({
                  id: idx + 1,
                  name,
                  value: name
                }))]}
              />
            )}

            <MultiSelectButton
              options={[{ id: 0, name: "Rəng seçin", value: "" }, ...colorOptions.map((o: Option) => ({
                id: o.id,
                name: optionLabels[o.name as keyof typeof optionLabels] || o.name,
                value: o.name
              }))]}
              selected={formData.colors}
              setSelected={(items) => setFormData(prev => ({ ...prev, colors: items }))}
            />
          </div>

          {/* Offer type, condition */}
          <SelectButton
            options={[{ id: 0, name: "İstifadə forması" }, ...options.offerTypes.map((o: Option) => ({
              id: o.id,
              name: optionLabels[o.name as keyof typeof optionLabels] || o.name,
              value: o.name
            }))]}
            selected={formData.offerTypes}
            setSelected={(item) => handleSelectChange('offerTypes', item)}
          />

          <SelectButton
            options={[
              { id: 0, name: "Vəziyyət" },
              ...(formData.offerTypes?.value === "SALE"
                ? options.conditions.filter(o => ["FIRST_HAND", "SECOND_HAND"].includes(o.name))
                : options.conditions
              ).map(o => ({
                id: o.id,
                name: optionLabels[o.name as keyof typeof optionLabels] || o.name,
                value: o.name
              }))
            ]}
            selected={formData.condition}
            setSelected={(item) => handleSelectChange('condition', item)}
          />


          {/* Price */}
          <div className="flex flex-col col-span-1 sm:col-span-2">
            <label htmlFor="price">Qiymət</label>
            <input
              type="number"
              id="price"
              name="price"
              value={formData.price === 0 ? "" : formData.price}
              placeholder='0'
              onChange={handleChange}
              className="px-4 py-2 mt-2 border-1 border-[#D4D4D4] rounded-lg focus:border-purple-600"
              min="0"
              step="0.01"
              required
            />
          </div>

          {/* Sizes */}
          <div className="flex flex-col col-span-1 sm:col-span-2">
            <label htmlFor="sizes">Ölçülər</label>
            <div className="flex flex-wrap gap-2 mt-2">
              {sizeOptions.map(size => (
                <button
                  key={size}
                  type="button"
                  onClick={() => {
                    const newSizes = formData.sizes.includes(size)
                      ? formData.sizes.filter(s => s !== size)
                      : [...formData.sizes, size];
                    setFormData(prev => ({ ...prev, sizes: newSizes }));
                  }}
                  className={`w-[78px] py-2 rounded-lg text-sm cursor-pointer ${formData.sizes.includes(size)
                    ? "bg-black text-white"
                    : "bg-[#E5E7EB] text-[#4A5565]"}`
                  }
                >
                  {size}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className='text-end'>
          <button
            type="submit"
            className="w-full md:w-[500px] h-[40px] rounded-lg font-bold text-lg text-white bg-black hover:bg-gray-800 transition-all disabled:opacity-50 cursor-pointer"
            disabled={isLoading}
          >
            {isLoading ? 'Məhsul Göndərilir...' : 'Məhsulu Göndər'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddCloth;