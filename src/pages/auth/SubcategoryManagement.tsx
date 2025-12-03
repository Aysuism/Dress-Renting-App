import { useState } from 'react';
import { useAddSubcategoryMutation, useDeleteSubcategoryMutation, useGetSubcategoriesQuery, useUpdateSubcategoryMutation, } from '../../tools/subCategory';
import { useGetCategoriesQuery } from '../../tools/categories';
import Swal from 'sweetalert2';
import { genderOptions } from '../AddCloth';
import { MultiSelectButton } from '../../components/SelectButton';

const SubcategoryManagement = () => {
  const { data: subcategories = [] } = useGetSubcategoriesQuery([]);
  const { data: categories = [] } = useGetCategoriesQuery([]);
  const [deleteSubCategory] = useDeleteSubcategoryMutation();
  const [addSubcategories, { isLoading }] = useAddSubcategoryMutation();
  const [updateSub] = useUpdateSubcategoryMutation();

  const [editingSub, setEditingSub] = useState<{
    id: number;
    name: string;
    categoryId: string;
    genders: string[];
  } | null>(null);

  const [formData, setFormData] = useState<{
    name: string;
    categoryId: string;
    genders: string[];
  }>({
    name: "",
    categoryId: "",
    genders: [],
  });

  const handleSubmit = (e: any) => {
    e.preventDefault();
    if (!formData.categoryId) {
      Swal.fire({
        icon: "error",
        title: "Xəta!",
        text: "Zəhmət olmasa, kateqoriya seçin.",
        confirmButtonText: "Bağla",
      });
      return;
    }

    const data = {
      name: formData.name,
      categoryId: Number(formData.categoryId),
      genders: formData.genders,
    };

    addSubcategories(data)
      .unwrap()
      .then(() => {
        Swal.fire({
          icon: "success",
          title: "Uğurla əlavə edildi!",
          text: `Alt kateqoriya əlavə edildi: ${formData.name}`,
          timer: 1500,
          showConfirmButton: false,
        });
        setFormData({ name: "", categoryId: "", genders: [] });
      })
      .catch(() => {
        Swal.fire({
          icon: "error",
          title: "Xəta!",
          text: "Serverdə problem yarandı.",
          confirmButtonText: "Bağla",
        });
      });
  };

  const handleDeleteSubcategory = (id: any) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This subcategory will be permanently deleted!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    }).then((result) => {
      if (result.isConfirmed) {
        deleteSubCategory(id)
          .unwrap()
          .then(() => Swal.fire("Deleted!", "Subcategory has been deleted.", "success"))
          .catch(() => Swal.fire("Error", "Failed to delete subcategory.", "error"));
      }
    });
  };

  const handleEditSub = (sub: any) => {
    setEditingSub({
      id: sub.id,
      name: sub.name,
      categoryId: String(sub.category.id),
      genders: Array.isArray(sub.genders)
        ? sub.genders.map(String)
        : [String(sub.genders)],
    });
  };


  const handleUpdateSubmit = (e: any) => {
    e.preventDefault();
    if (!editingSub) return;

    const { id, name, categoryId, genders } = editingSub;

    updateSub({
      id,
      data: { name, categoryId: Number(categoryId), genders },
    })
      .unwrap()
      .then(() => {
        Swal.fire("Updated!", "Subcategory has been updated.", "success");
        setEditingSub(null);
      })
      .catch(() => {
        Swal.fire("Error", "Failed to update subcategory.", "error");
      });
  };

  return (
    <div className="p-6 space-y-6">
      {/* Add Subcategory Form */}
      <form
        onSubmit={handleSubmit}
        className="p-4 border rounded shadow-sm bg-white max-w-md mx-auto space-y-4"
      >
        <label className="block font-medium text-gray-700">Alt Kateqoriya</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
          className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
        />

        <label className="block font-medium text-gray-700 mt-2">Kateqoriya Seçin</label>
        <select
          name="categoryId"
          value={formData.categoryId}
          onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
          required
          className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
        >
          <option value="">Kateqoriya seçin</option>
          {categories.map((cat: any) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>

        <MultiSelectButton
          options={genderOptions}
          selected={genderOptions.filter(g => formData.genders.includes(g.value))}
          setSelected={(selectedOptions) =>
            setFormData({
              ...formData,
              genders: selectedOptions.map((o) => o.value).filter((v): v is string => v !== undefined),
            })
          }
          default="Cins seçin"
        />

        <button
          type="submit"
          disabled={isLoading}
          className={`w-full py-2 rounded-lg text-white font-medium transition ${isLoading ? "bg-gray-400 cursor-not-allowed" : "bg-black hover:bg-gray-800"
            }`}
        >
          {isLoading ? "Əlavə olunur..." : "Alt Kateqoriya Əlavə Et"}
        </button>
      </form>

      {/* Existing Subcategories List */}
      {subcategories.length > 0 && (
        <div className="p-4 border rounded shadow-sm bg-gray-50 max-w-md mx-auto space-y-2">
          <h3 className="text-lg font-semibold mb-2">Mövcud Alt Kateqoriyalar:</h3>
          <ul className="space-y-2">
            {subcategories.map((sub: any) => (
              <li
                key={sub.id}
                className="flex justify-between items-center bg-white px-3 py-2 rounded shadow-sm"
              >
                <span>
                  {sub.name} (
                  {categories.find((c: any) => c.id === sub.category.id)?.name || "N/A"}
                  ) —{" "}
                  {Array.isArray(sub.genders)
                    ? sub.genders.join(", ")
                    : sub.genders}
                </span>
                <div className="flex gap-2">
                  <button
                    className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                    onClick={() => handleEditSub(sub)}
                  >
                    Edit
                  </button>
                  <button
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                    onClick={() => handleDeleteSubcategory(sub.id)}
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Edit Form */}
      {editingSub && (
        <form
          onSubmit={handleUpdateSubmit}
          className="p-4 border rounded shadow-sm bg-white max-w-md mx-auto space-y-4"
        >
          <input
            type="text"
            value={editingSub.name}
            onChange={(e) =>
              setEditingSub({ ...editingSub, name: e.target.value })
            }
            required
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
          />

          <select
            value={editingSub.categoryId}
            onChange={(e) =>
              setEditingSub({ ...editingSub, categoryId: e.target.value })
            }
            required
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
          >
            <option value="">Kateqoriya seçin</option>
            {categories.map((cat: any) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>

          <MultiSelectButton
            options={genderOptions}
            selected={genderOptions.filter(g => editingSub.genders.includes(g.value))}
            setSelected={(selectedOptions) =>
              setEditingSub({
                ...editingSub,
                genders: selectedOptions.map((o) => o.value).filter((v): v is string => v !== undefined),
              })
            }
            default="Cins seçin"
          />

          <div className="flex gap-2">
            <button
              type="submit"
              className="flex-1 py-2 rounded-lg bg-green-500 text-white hover:bg-green-600"
            >
              Update
            </button>
            <button
              type="button"
              onClick={() => setEditingSub(null)}
              className="flex-1 py-2 rounded-lg bg-gray-400 text-white hover:bg-gray-500"
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default SubcategoryManagement;