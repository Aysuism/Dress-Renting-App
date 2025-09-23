import React, { useState } from 'react';
import { optionLabels, options } from './Home';
import SelectButton, { MultiSelectButton } from '../components/SelectButton';
import { type Option } from '../tools/types';
import { Link } from 'react-router';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import { useAddClothesMutation } from '../tools/product';
import { useDispatch } from 'react-redux';
import { addPendingProduct } from '../tools/fakeApi';
import Swal from 'sweetalert2';

const generateProductCode = () => `P-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

const colorOptions = options.colors;
const sizeOptions = options.sizes.map(size => size.name);

// Gender-based categories
const categoriesByGender: Record<string, string[]> = {
  WOMAN: [
    "Gəlinlik", "Ziyafət geyimi", "Don", "Köynək", "Bluz", "Şalvar",
    "Ətək", "Şort", "Gödəkcə", "Palto", "Ayaqqabı", "Çanta", "Aksesuar", "Digər"
  ],
  MAN: [
    "Kostyum", "Ayaqqabı", "Aksesuar", "Digər"
  ],
  KID: [
    "Don", "Kostyum", "Ayaqqabı", "Aksesuar", "Digər"
  ]
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

  const [addClothes] = useAddClothesMutation();
  const dispatch = useDispatch();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (field: keyof FormDataState, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      setFormData(prev => ({ ...prev, images: filesArray }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(addPendingProduct(formData));

    const productRequestDto = {
      productCode: formData.productCode,
      subcategoryId: formData.category?.id ?? 0,
      price: formData.price,
      gender: formData.gender?.value ?? "",
      userId: null,
      colorAndSizes: formData.colors.map(color => ({
        color: color.value,
        photoCount: formData.images.length,
        sizeStockMap: formData.sizes.reduce((acc, s) => {
          acc[s] = 1;
          return acc;
        }, {} as Record<string, number>),
        imageUrls: [],
      })),
      offers: [{
        offerType: formData.offerTypes?.value ?? "SALE",
        price: formData.price ?? 0,
        productCondition: formData.condition?.value ?? "FIRST_HAND",
      }]
    };

    const data = new FormData();
    data.append("product", new Blob([JSON.stringify(productRequestDto)], { type: "application/json" }));
    formData.images.forEach(file => data.append("images", file));

    addClothes(data)
      .unwrap()
      .then(() => {
        Swal.fire({
          icon: 'success',
          title: 'Uğurla göndərildi!',
          text: 'Məhsul inzibati təsdiq üçün göndərildi!',
        });
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
          images: [],
        });
      })
      .catch(err => {
        console.error("Göndərmə xətası:", err);
        Swal.fire({
          icon: 'error',
          title: 'Xəta baş verdi',
          text: 'Zəhmət olmasa yenidən cəhd edin.',
        });
      });
  };

  return (
    <div className='py-10'>
      <p className="mb-10 text-[#4A5565] text-[14px] flex items-center">
        <Link to="/" className="hover:text-black">Əsas</Link>
        <ChevronLeftIcon className="translate-y-[1px]" />
        Məhsul Əlavə et
      </p>

      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
          <div className="flex flex-col">
            <label htmlFor="name">Ad</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              placeholder='Ad'
              onChange={handleChange}
              className="px-4 py-2 mt-2 border-1 border-[#D4D4D4] rounded-lg focus:border-purple-600"
              required
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="surname">Soyad</label>
            <input
              type="text"
              id="surname"
              name="surname"
              value={formData.surname}
              placeholder='Soyad'
              onChange={handleChange}
              className="px-4 py-2 mt-2 border-1 border-[#D4D4D4] rounded-lg focus:border-purple-600"
              required
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="phone">Telefon</label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              placeholder='+994'
              onChange={handleChange}
              className="px-4 py-2 mt-2 border-1 border-[#D4D4D4] rounded-lg focus:border-purple-600"
              required
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              placeholder='example@gmail.com'
              onChange={handleChange}
              className="px-4 py-2 mt-2 border-1 border-[#D4D4D4] rounded-lg focus:border-purple-600"
              required
            />
          </div>
        </div>
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

          {/* Preview */}
          {formData.images.length > 0 && (
            <div className="flex gap-4 mt-4 flex-wrap">
              {formData.images.map((file, idx) => {
                const url = URL.createObjectURL(file);
                return (
                  <div key={idx} className="relative w-24 h-24">
                    <img
                      src={url}
                      alt="preview"
                      className="w-full h-full object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center"
                      onClick={() =>
                        setFormData(prev => ({
                          ...prev,
                          images: prev.images.filter((_, i) => i !== idx),
                        }))
                      }
                    >
                      ×
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
          <div className='col-span-1 sm:col-span-2 flex gap-5'>

            <SelectButton
              selected={formData.gender}
              setSelected={item => handleSelectChange('gender', item)}
              options={[
                { id: 0, name: "Cins", value: "" },
                ...options.genders.map(o => ({
                  id: o.id,
                  name: optionLabels[o.name] || o.name,
                  value: o.name,
                }))
              ]}
            />

            {formData.gender && (
              <SelectButton
                selected={formData.category}
                setSelected={item => handleSelectChange('category', item)}
                options={[
                  { id: 0, name: "Kateqoriya", value: "" },
                  ...categoriesByGender[formData.gender.value as keyof typeof categoriesByGender].map((name, idx) => ({
                    id: idx + 1,
                    name,
                    value: name,
                  }))
                ]}
              />
            )}

            <MultiSelectButton
              options={[{ id: 0, name: "Rəng seçin", value: "" }, ...colorOptions.map(o => ({
                id: o.id,
                name: optionLabels[o.name] || o.name,
                value: o.name,
              }))]}
              selected={formData.colors}
              setSelected={(items) => setFormData(prev => ({ ...prev, colors: items }))}
            />
          </div>

          <SelectButton
            options={[{ id: 0, name: "İstifadə forması" }, ...options.offerTypes.map(o => ({
              id: o.id,
              name: optionLabels[o.name] || o.name,
              value: o.name,
            }))]}
            selected={formData.offerTypes}
            setSelected={item => handleSelectChange('offerTypes', item)}
          />

          <SelectButton
            options={[{ id: 0, name: "Vəziyyət" }, ...options.conditions.map((o: any) => ({
              id: o.id,
              name: optionLabels[o.name] || o.name,
              value: o.name,
            }))]}
            selected={formData.condition}
            setSelected={item => handleSelectChange('condition', item)}
          />

          <div className="flex flex-col col-span-1 sm:col-span-2">
            <label htmlFor="note">Qeyd</label>
            <input
              type="text"
              id="note"
              name="note"
              // value={formData.note}
              placeholder='Müştəriyə çatdırmaq istədiyiniz qeydi daxil edin...'
              className="px-4 py-2 mt-2 border-1 border-[#D4D4D4] rounded-lg focus:border-purple-600"
              onChange={handleChange}
            />
          </div>

          <div className="flex flex-col col-span-1 sm:col-span-2">
            <label htmlFor="price">Qiymət</label>
            <input
              type="number"
              id="price"
              name="price"
              value={formData.price === 0 ? "" : formData.price}
              placeholder='0'
              onChange={e => {
                const value = e.target.value;
                setFormData(prev => ({
                  ...prev,
                  price: value === "" ? 0 : parseFloat(value)
                }));
              }}
              className="px-4 py-2 mt-2 border-1 border-[#D4D4D4] rounded-lg focus:border-purple-600"
              min="0"
              step="0.01"
              required
            />
          </div>

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
                    : "bg-[#E5E7EB] text-[#4A5565]"
                    }`}
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
          >
            Məhsulu Göndər
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddCloth;