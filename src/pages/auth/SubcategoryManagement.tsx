import { useState } from 'react';
import { useAddSubcategoryMutation, useDeleteSubcategoryMutation, useGetSubcategoriesQuery, useUpdateSubcategoryMutation, } from '../../tools/subCategory';
import { useGetCategoriesQuery } from '../../tools/categories';
import Swal from 'sweetalert2';

const SubcategoryManagement = () => {
  const { data: subcategories = [] } = useGetSubcategoriesQuery([]);
  const { data: categories = [] } = useGetCategoriesQuery([]);
  const [deleteSubCategory] = useDeleteSubcategoryMutation();
  const [addSubcategories, { isLoading }] = useAddSubcategoryMutation();
  const [updateSub] = useUpdateSubcategoryMutation();
  const [editingSub, setEditingSub] = useState<{ id: number; name: string; categoryId:string } | null>(null);

  const [formData, setFormData] = useState({ name: "", categoryId: "" });

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: any) => {
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

    const data = { name: formData.name, categoryId: Number(formData.categoryId) };

    try {
      await addSubcategories(data).unwrap();
      Swal.fire({
        icon: "success",
        title: "Uğurla əlavə edildi!",
        text: `Alt kateqoriya əlavə edildi: ${formData.name}`,
        timer: 1500,
        showConfirmButton: false,
      });
      setFormData({ name: "", categoryId: "" });
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Xəta!",
        text: "Serverdə problem yarandı.",
        confirmButtonText: "Bağla",
      });
      console.error("Add subcategory error:", err);
    }
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
          .catch((error) => {
            Swal.fire("Error", "Failed to delete subcategory.", "error");
            console.error("Delete subcategory error:", error);
          });
      }
    });
  };

  const handleEditSub = (sub: any) => setEditingSub({ id: sub.id, name: sub.name, categoryId: sub.category.id });

  const handleUpdateSubmit = (e: any) => {
    e.preventDefault();
    if (!editingSub) return;

    const { id, name, categoryId } = editingSub;

    updateSub({ id, data: { name, categoryId: Number(categoryId) } })
      .unwrap()
      .then(() => {
        Swal.fire("Updated!", "Subcategory has been updated.", "success");
        setEditingSub(null);
      })
      .catch((err) => {
        Swal.fire("Error", "Failed to update subcategory.", "error");
        console.error("Update subcategory error:", err);
      });
  };

  return (
    <div className="p-6 space-y-6">
      {/* Add Subcategory Form */}
      <form
        onSubmit={handleSubmit}
        className="p-4 border rounded shadow-sm bg-white max-w-md mx-auto space-y-4"
      >
        <label htmlFor="subcategoryName" className="block font-medium text-gray-700">Alt Kateqoriya</label>
        <input
          type="text"
          id="subcategoryName"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
        />

        <label htmlFor="categorySelect" className="block font-medium text-gray-700 mt-2">Kateqoriya Seçin</label>
        <select
          id="categorySelect"
          name="categoryId"
          value={formData.categoryId}
          onChange={handleChange}
          required
          className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
        >
          <option value="">Kateqoriya seçin</option>
          {categories.map((cat: any) => (
            <option key={cat.id} value={cat.id}>{cat.name}</option>
          ))}
        </select>

        <button
          type="submit"
          disabled={isLoading}
          className={`w-full py-2 rounded-lg text-white font-medium transition ${isLoading ? "bg-gray-400 cursor-not-allowed" : "bg-black hover:bg-gray-800"
            }`}
        >
          {isLoading ? 'Əlavə olunur...' : 'Alt Kateqoriya Əlavə Et'}
        </button>
      </form>

      {/* Existing Subcategories List */}
      {subcategories.length > 0 && (
        <div className="p-4 border rounded shadow-sm bg-gray-50 max-w-md mx-auto space-y-2">
          <h3 className="text-lg font-semibold mb-2">Mövcud Alt Kateqoriyalar:</h3>
          <ul className="space-y-2">
            {subcategories.map((sub: any) => (
              <li key={sub.id} className="flex justify-between items-center bg-white px-3 py-2 rounded shadow-sm">
                <span>{sub.name} ({categories.find((c: any) => c.id === sub.category.id).name})</span>
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

      {/* Edit Subcategory Form */}
      {editingSub && (
        <form
          onSubmit={handleUpdateSubmit}
          className="p-4 border rounded shadow-sm bg-white max-w-md mx-auto space-y-4"
        >
          <input
            type="text"
            value={editingSub.name}
            onChange={(e) => setEditingSub({ ...editingSub, name: e.target.value })}
            required
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
          />
          <select
            value={editingSub.categoryId}
            onChange={(e) => setEditingSub({ ...editingSub, categoryId: e.target.value })}
            required
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
          >
            <option value="">Kateqoriya seçin</option>
            {categories.map((cat: any) => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>

          <div className="flex gap-2">
            <button type="submit" className="flex-1 py-2 rounded-lg bg-green-500 text-white hover:bg-green-600">
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