import { useState } from 'react';
import { useAddCategoriesMutation, useDeleteCategoriesMutation, useGetCategoriesQuery, useUpdateCategoriesMutation, } from '../../tools/categories';
import Swal from 'sweetalert2';

const CategoryManagement = () => {
    const { data: categories = [] } = useGetCategoriesQuery([]);

    const [addCategories, { isLoading }] = useAddCategoriesMutation();
    const [deleteCategory] = useDeleteCategoriesMutation();
    const [updateCat] = useUpdateCategoriesMutation();
    const [editingCat, setEditingCat] = useState<{ id: number; name: string } | null>(null);

    const [formData, setFormData] = useState({ name: "" });

    const handleChange = (e: any) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        try {
            await addCategories({ name: formData.name }).unwrap();
            Swal.fire({
                icon: "success",
                title: "Uğurla əlavə edildi!",
                text: `Kateqoriya əlavə edildi: ${formData.name}`,
                timer: 1500,
                showConfirmButton: false,
            });
            setFormData({ name: "" });
        } catch (err) {
            Swal.fire({
                icon: "error",
                title: "Xəta!",
                text: "Serverdə problem yarandı.",
                confirmButtonText: "Bağla",
            });
            console.error("Add category error:", err);
        }
    };

    const handleDeleteCategory = (id: any) => {
        Swal.fire({
            title: "Are you sure?",
            text: "This category will be permanently deleted!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes, delete it!",
            cancelButtonText: "Cancel",
        }).then((result) => {
            if (result.isConfirmed) {
                deleteCategory(id)
                    .unwrap()
                    .then(() => Swal.fire("Deleted!", "Category has been deleted.", "success"))
                    .catch((error) => {
                        Swal.fire("Error", "Failed to delete category.", "error");
                        console.error("Delete category error:", error);
                    });
            }
        });
    };

    const handleEdit = (cat: any) => setEditingCat({ id: cat.id, name: cat.name });

    const handleUpdateSubmit = (e: any) => {
        e.preventDefault();
        if (!editingCat) return;
        const { id, name } = editingCat;

        updateCat({ id, data: { name } })
            .unwrap()
            .then(() => {
                Swal.fire("Updated!", "Category has been updated.", "success");
                setEditingCat(null);
            })
            .catch((err) => {
                Swal.fire("Error", "Failed to update category.", "error");
                console.error("Update category error:", err);
            });
    };

    return (
        <div className="p-6 space-y-6">
            {/* Add Category Form */}
            <form
                onSubmit={handleSubmit}
                className="p-4 border rounded shadow-sm bg-white max-w-md mx-auto space-y-4"
            >
                <label htmlFor="categoryName" className="block font-medium text-gray-700">Kateqoriya</label>
                <input
                    type="text"
                    id="categoryName"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                />
                <button
                    type="submit"
                    disabled={isLoading}
                    className={`w-full py-2 rounded-lg text-white font-medium transition ${isLoading ? "bg-gray-400 cursor-not-allowed" : "bg-black hover:bg-gray-800"
                        }`}
                >
                    {isLoading ? 'Əlavə olunur...' : 'Kateqoriya Əlavə Et'}
                </button>
            </form>

            {/* Existing Categories List */}
            {categories.length > 0 && (
                <div className="p-4 border rounded shadow-sm bg-gray-50 max-w-md mx-auto space-y-2">
                    <h3 className="text-lg font-semibold mb-2">Mövcud Kateqoriyalar:</h3>
                    <ul className="space-y-2">
                        {categories.map((cat: any) => (
                            <li key={cat.id} className="flex justify-between items-center bg-white px-3 py-2 rounded shadow-sm">
                                <span>{cat.name}</span>
                                <div className="flex gap-2">
                                    <button
                                        className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                                        onClick={() => handleEdit(cat)}
                                    >
                                        Edit
                                    </button>
                                    <button
                                        className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                                        onClick={() => handleDeleteCategory(cat.id)}
                                    >
                                        Delete
                                    </button>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {/* Edit Category Form */}
            {editingCat && (
                <form
                    onSubmit={handleUpdateSubmit}
                    className="p-4 border rounded shadow-sm bg-white max-w-md mx-auto space-y-4"
                >
                    <input
                        type="text"
                        value={editingCat.name}
                        onChange={(e) => setEditingCat({ ...editingCat, name: e.target.value })}
                        required
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                    />
                    <div className="flex gap-2">
                        <button type="submit" className="flex-1 py-2 rounded-lg bg-green-500 text-white hover:bg-green-600">
                            Update
                        </button>
                        <button
                            type="button"
                            onClick={() => setEditingCat(null)}
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

export default CategoryManagement;