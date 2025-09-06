import { useState, useRef, type ChangeEvent, type FormEvent } from "react";
import { submitProduct } from '../tools/api';
import type { Option, FormData } from "../tools/types";
import SelectButton from "../components/SelectButton";

const categories: Option[] = [
  { id: 1, name: "Köynək" },
  { id: 2, name: "Şalvar" },
  { id: 3, name: "Ayaqqabı" },
];

const genderOptions: Option[] = [
  { id: 1, name: "QADIN" },
  { id: 2, name: "KİŞİ" },
  { id: 3, name: "UŞAQ" },
];

const offerOptions: Option[] = [
  { id: 1, name: "KİRAYƏ" },
  { id: 2, name: "SATIŞ" },
];

const conditionOptions: Option[] = [
  { id: 1, name: "BİRİNCİ ƏL" },
  { id: 2, name: "İKİNCİ ƏL" },
];

const colorOptions: Option[] = [
  { id: 1, name: "Qırmızı" },
  { id: 2, name: "Yaşıl" },
  { id: 3, name: "Mavi" },
  { id: 4, name: "Qara" },
  { id: 5, name: "Ağ" },
  { id: 6, name: "Sarı" },
  { id: 7, name: "Bənövşəyi" },
  { id: 8, name: "Çəhrayı" },
  { id: 9, name: "Narıncı" },
  { id: 10, name: "Qəhvəyi" },
];

const sizeOptions = ["XS", "S", "M", "L", "XL", "XXL"];

const generateProductCode = () => `P-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

const AddCloth = () => {
  const [formData, setFormData] = useState<FormData>({
    category: null,
    gender: null,
    offerType: offerOptions[1],
    condition: conditionOptions[0],
    colors: [],
    sizes: [],
    price: 0,
    images: [],
    rentDuration: 1,
    productCode: generateProductCode(),
    name: "",
    surname: "",
    email: "",
    phone: "",
  });

  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof FormData, string>> = {};

    if (!formData.category) newErrors.category = "Kateqoriya tələb olunur";
    if (!formData.gender) newErrors.gender = "Cinsiyyət tələb olunur";
    if (formData.colors.length === 0) newErrors.colors = "Ən azı bir rəng seçilməlidir";
    if (formData.sizes.length === 0) newErrors.sizes = "Ən azı bir ölçü seçilməlidir";
    if (formData.price <= 0) newErrors.price = "Qiymət 0-dan böyük olmalıdır";
    if (!formData.name.trim()) newErrors.name = "Ad tələb olunur";
    if (!formData.email.trim()) newErrors.email = "Email tələb olunur";
    if (!formData.phone.trim()) newErrors.phone = "Telefon nömrəsi tələb olunur";

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.email && !emailRegex.test(formData.email)) {
      newErrors.email = "Düzgün email ünvanı daxil edin";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    if (errors[name as keyof FormData]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      const firstError = Object.keys(errors)[0];
      if (firstError) {
        document.getElementById(firstError)?.scrollIntoView({
          behavior: 'smooth',
          block: 'center'
        });
      }
      return;
    }

    setIsSubmitting(true);

    try {
      await submitProduct(formData);
      alert("Məhsul inzibati təsdiq üçün göndərildi! Qeyd: Bu, müvəqqəti həll yoludur.");
      setFormData({
        category: null,
        gender: null,
        offerType: offerOptions[1],
        condition: conditionOptions[0],
        colors: [],
        sizes: [],
        price: 0,
        images: [],
        rentDuration: 1,
        productCode: generateProductCode(),
        name: "",
        surname: "",
        email: "",
        phone: "",
      });
      setErrors({});
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (error) {
      console.error("Göndərmə xətası:", error);
      alert("Xəta baş verdi. Zəhmət olmasa yenidən cəhd edin.");
    } finally {
      setIsSubmitting(false);
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
            <div>
              <SelectButton
                label="Kateqoriya"
                options={categories}
                selected={formData.category}
                setSelected={cat => setFormData(prev => ({ ...prev, category: cat }))}
              />
              {errors.category && <p className="text-red-500 text-sm mt-1">{errors.category}</p>}
            </div>

            <div>
              <SelectButton
                label="Cinsiyyət"
                options={genderOptions}
                selected={formData.gender}
                setSelected={g => setFormData(prev => ({ ...prev, gender: g }))}
              />
              {errors.gender && <p className="text-red-500 text-sm mt-1">{errors.gender}</p>}
            </div>

            <div>
              <SelectButton
                label="Təklif növü"
                options={offerOptions}
                selected={formData.offerType}
                setSelected={o => setFormData(prev => ({ ...prev, offerType: o }))}
              />
            </div>

            <div>
              <SelectButton
                label="Vəziyyət"
                options={conditionOptions}
                selected={formData.condition}
                setSelected={c => setFormData(prev => ({ ...prev, condition: c }))}
              />
            </div>

            <div className="flex flex-col">
              <label htmlFor="colors">Rənglər</label>
              <div className="flex flex-wrap gap-2 mt-2">
                {colorOptions.map(color => (
                  <button
                    key={color.id}
                    type="button"
                    onClick={() => {
                      const isSelected = formData.colors.some(c => c.id === color.id);
                      const newColors = isSelected
                        ? formData.colors.filter(c => c.id !== color.id)
                        : [...formData.colors, color];
                      setFormData(prev => ({ ...prev, colors: newColors }));
                    }}
                    className={`px-3 py-1 rounded-full text-sm ${formData.colors.some(c => c.id === color.id)
                      ? "bg-purple-600 text-white"
                      : "bg-gray-200 text-gray-800"
                      }`}
                  >
                    {color.name}
                  </button>
                ))}
              </div>
              {errors.colors && <p className="text-red-500 text-sm mt-1">{errors.colors}</p>}
            </div>

            <div className="flex flex-col">
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
                    className={`px-3 py-1 rounded-full text-sm ${formData.sizes.includes(size)
                      ? "bg-purple-600 text-white"
                      : "bg-gray-200 text-gray-800"
                      }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
              {errors.sizes && <p className="text-red-500 text-sm mt-1">{errors.sizes}</p>}
            </div>

            <div className="flex flex-col">
              <label htmlFor="price">Qiymət</label>
              <input
                type="number"
                id="price"
                name="price"
                value={formData.price === 0 ? "" : formData.price}
                onChange={e => {
                  const value = e.target.value;
                  setFormData(prev => ({
                    ...prev,
                    price: value === "" ? 0 : parseFloat(value)
                  }));
                }}
                className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-600"
                min="0"
                step="0.01"
              />

              {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price}</p>}
            </div>

            {formData.offerType?.name === "KİRAYƏ" && (
              <div className="flex flex-col">
                <label htmlFor="rentDuration">Kirayə müddəti (gün)</label>
                <input
                  type="number"
                  id="rentDuration"
                  name="rentDuration"
                  value={formData.rentDuration}
                  onChange={e => setFormData(prev => ({ ...prev, rentDuration: Number(e.target.value) }))}
                  className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-600"
                  min="1"
                />
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
            <div className="flex flex-col">
              <label htmlFor="name">Ad</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-600"
              />
              {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
            </div>
            <div className="flex flex-col">
              <label htmlFor="surname">Soyad</label>
              <input
                type="text"
                id="surname"
                name="surname"
                value={formData.surname}
                onChange={handleChange}
                className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-600"
              />
            </div>
            <div className="flex flex-col">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-600"
              />
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
            </div>
            <div className="flex flex-col">
              <label htmlFor="phone">Telefon</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-600"
              />
              {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 rounded-full font-bold text-lg text-white bg-gradient-to-r from-purple-500 to-purple-700 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {isSubmitting ? "Göndərilir..." : "Məhsulu Göndər"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddCloth;