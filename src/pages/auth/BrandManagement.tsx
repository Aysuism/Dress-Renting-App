import { useState } from 'react';
import Swal from 'sweetalert2';
import { useAddBrandsMutation, useDeleteBrandsMutation, useGetBrandsQuery, useUpdateBrandsMutation } from '../../tools/brands';
const BrandManagement = () => {
    const { data: brands = [] } = useGetBrandsQuery([]);

    const [addBrands, { isLoading }] = useAddBrandsMutation();
    const [deleteBrands] = useDeleteBrandsMutation();
    const [updateBrands] = useUpdateBrandsMutation();
    const [editingBrand, setEditingBrand] = useState<{ id: number; name: string } | null>(null);

    const [formData, setFormData] = useState<{ name: string }>({ name: "" });

    const handleChange = (e: any) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        try {
            await addBrands({ name: formData.name }).unwrap();
            Swal.fire({
                icon: "success",
                title: "Uğurla əlavə edildi!",
                text: `Brend əlavə edildi: ${formData.name}`,
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
            console.error("Add brand error:", err);
        }
    };

    const handleDeleteBrand = (id: any) => {
        Swal.fire({
            title: "Are you sure?",
            text: "This brand will be permanently deleted!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes, delete it!",
            cancelButtonText: "Cancel",
        }).then((result) => {
            if (result.isConfirmed) {
                deleteBrands(id)
                    .unwrap()
                    .then(() => Swal.fire("Deleted!", "Brand has been deleted.", "success"))
                    .catch((error) => {
                        Swal.fire("Error", "Failed to delete brand.", "error");
                        console.error("Delete brand error:", error);
                    });
            }
        });
    };

    const handleEdit = (brand: any) => setEditingBrand({ id: brand.id, name: brand.name });

    const handleUpdateSubmit = (e: any) => {
        e.preventDefault();
        if (!editingBrand) return;
        const { id, name } = editingBrand;

        updateBrands({ id, data: { name } })
            .unwrap()
            .then(() => {
                Swal.fire("Updated!", "Brand has been updated.", "success");
                setEditingBrand(null);
            })
            .catch((err) => {
                Swal.fire("Error", "Failed to update brand.", "error");
                console.error("Update brand error:", err);
            });
    };

    return (
        <div className="p-6 space-y-6 mb-20">
            {/* Add Brand Form */}
            <form
                onSubmit={handleSubmit}
                className="p-4 border rounded shadow-sm bg-white max-w-md mx-auto space-y-4"
            >
                <label htmlFor="brandName" className="block font-medium text-gray-700">Brend</label>
                <input
                    type="text"
                    id="brandName"
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
                    {isLoading ? 'Əlavə olunur...' : 'Brend Əlavə Et'}
                </button>
            </form>

            {/* Existing Brands List */}
            {brands.length > 0 && (
                <div className="p-4 border rounded shadow-sm bg-gray-50 max-w-md mx-auto space-y-2">
                    <h3 className="text-lg font-semibold mb-2">Mövcud Brendlər:</h3>
                    <ul className="space-y-2">
                        {brands.map((brand: any) => (
                            <li key={brand.id} className="flex justify-between items-center bg-white px-3 py-2 rounded shadow-sm">
                                <span>{brand.name}</span>
                                <div className="flex gap-2">
                                    <button
                                        className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                                        onClick={() => handleEdit(brand)}
                                    >
                                        Edit
                                    </button>
                                    <button
                                        className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                                        onClick={() => handleDeleteBrand(brand.id)}
                                    >
                                        Delete
                                    </button>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {/* Edit Brand Form */}
            {editingBrand && (
                <form
                    onSubmit={handleUpdateSubmit}
                    className="p-4 border rounded shadow-sm bg-white max-w-md mx-auto space-y-4"
                >
                    <input
                        type="text"
                        value={editingBrand.name}
                        onChange={(e) => setEditingBrand({ ...editingBrand, name: e.target.value })}
                        required
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                    />
                    <div className="flex gap-2">
                        <button type="submit" className="flex-1 py-2 rounded-lg bg-green-500 text-white hover:bg-green-600">
                            Update
                        </button>
                        <button
                            type="button"
                            onClick={() => setEditingBrand(null)}
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

export default BrandManagement