import Swal from "sweetalert2";
import { useDeleteProductsMutation, } from "../../tools/product";
import { useApproveProductMutation, useDisapproveProductMutation, useGetAllProductsQuery, } from "../../tools/adminReview";

const ProductManagement = () => {
    const { data: allproducts = [], refetch } = useGetAllProductsQuery([]);

    const [deleteProduct, { isLoading: isDeleted }] = useDeleteProductsMutation();
    const [approveProduct, { isLoading: isApproved }] = useApproveProductMutation();
    const [disapproveProduct, { isLoading: isDisapproved }] = useDisapproveProductMutation();

    const reloadData = () => refetch();

    const handleDeleteAll = () => {
        if (allproducts.length === 0) return;

        Swal.fire({
            title: "Bütün məhsulları silmək istəyirsiniz?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Bəli, sil",
            cancelButtonText: "Ləğv et",
        }).then((result) => {
            if (result.isConfirmed) {
                Promise.all(allproducts.map((p: any) => deleteProduct(p.productCode).unwrap()))
                    .then(() => {
                        Swal.fire({ icon: "success", title: "Bütün məhsullar silindi!", timer: 1500, showConfirmButton: false });
                        reloadData();
                    })
                    .catch(() => Swal.fire({ icon: "error", title: "Bəzi məhsullar silinə bilmədi." }));
            }
        });
    };

    const handleApprove = async (productCode: string) => {
        try {
            await approveProduct(productCode).unwrap();
            Swal.fire({ icon: "success", title: "Məhsul təsdiqləndi!", timer: 1500, showConfirmButton: false });
            reloadData();
        } catch {
            Swal.fire({ icon: "error", title: "Serverdə problem yarandı." });
        }
    };

    const handleReject = async (productCode: string) => {
        try {
            await disapproveProduct(productCode).unwrap();
            Swal.fire({ icon: "success", title: "Məhsul rədd edildi!", timer: 1500, showConfirmButton: false });
            reloadData();
        } catch {
            Swal.fire({ icon: "error", title: "Serverdə problem yarandı." });
        }
    };

    const handleDelete = async (productCode: string) => {
        try {
            await deleteProduct(productCode).unwrap();
            Swal.fire({ icon: "success", title: "Məhsul silindi!", timer: 1500, showConfirmButton: false });
            reloadData();
        } catch {
            Swal.fire({ icon: "error", title: "Məhsul silinmədi." });
        }
    };

    return (
        <div className="p-6 space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <h2 className="text-2xl font-bold text-gray-800">All Products ({allproducts.length})</h2>
                {allproducts.length > 0 && (
                    <button
                        onClick={handleDeleteAll}
                        className="px-5 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                    >
                        Delete All
                    </button>
                )}
            </div>

            {allproducts.length === 0 ? (
                <div className="text-center p-10 border rounded-lg bg-gray-50 text-gray-500">
                    No products found.
                </div>
            ) : (
                allproducts.map((p: any) => {
                    // Fix: Access the sizes array correctly
                    const sizeInfo = p.colorAndSizes.map((cs: any) => cs.sizes.join(', '));

                    return (
                        <div key={p.productCode} className="border p-4 rounded-lg bg-white shadow-sm space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Left Info */}
                                <div className="space-y-2 text-gray-700">
                                    <p><strong>Product Code:</strong> {p.productCode}</p>
                                    <p><strong>Ad Soyad:</strong> {p.userName} {p.userSurname}</p>
                                    <p><strong>Email:</strong> {p.userEmail}</p>
                                    <p><strong>Telefon:</strong> {p.userPhone}</p>
                                    <p><strong>Price:</strong> {p.price || "Not set"}</p>
                                    <p><strong>Gender:</strong> {p.gender || "Not specified"}</p>
                                    <p><strong>Size:</strong> {sizeInfo.join('; ') || "Not specified"}</p>
                                    <p><strong>Subcategory:</strong> {p.subcategory?.name}</p>
                                    <p><strong>Created:</strong> {p.createdAt ? new Date(p.createdAt).toLocaleDateString() : "Unknown"}</p>
                                </div>

                                {/* Right Info: Colors & Images */}
                                <div className="space-y-4">
                                    {p.colorAndSizes?.map((cs: any, idx: number) => (
                                        <div key={idx} className="space-y-1">
                                            <p><strong>Color:</strong> {cs.color}</p>
                                            <p><strong>Size:</strong> {cs.sizes?.join(', ') || "No sizes"}</p>
                                            {cs.imageUrls?.length > 0 ? (
                                                <div className="flex flex-wrap gap-2 mt-2">
                                                    {cs.imageUrls.map((url: string, imgIdx: number) => (
                                                        <img
                                                            key={imgIdx}
                                                            src={url}
                                                            alt={`Product ${cs.color} ${imgIdx + 1}`}
                                                            className="w-24 h-24 object-cover rounded border shadow-sm"
                                                            onError={(e) => ((e.target as HTMLImageElement).style.display = "none")}
                                                        />
                                                    ))}
                                                </div>
                                            ) : (
                                                <p className="text-gray-500 text-sm">No images uploaded</p>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex gap-2 flex-wrap">
                                <button
                                    onClick={() => handleApprove(p.productCode)}
                                    className="flex-1 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
                                    disabled={isApproved}
                                >
                                    {isApproved ? "Qəbul edilir..." : "✓ Qəbul et"}
                                </button>
                                <button
                                    onClick={() => handleReject(p.productCode)}
                                    className="flex-1 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition"
                                    disabled={isDisapproved}
                                >
                                    {isDisapproved ? "İmtina edilir..." : "✗ İmtina"}
                                </button>
                                <button
                                    onClick={() => handleDelete(p.productCode)}
                                    className="flex-1 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                                    disabled={isDeleted}
                                >
                                    {isDeleted ? "Silinir..." : "Sil"}
                                </button>
                            </div>
                        </div>
                    );
                })
            )}
        </div>
    );
};

export default ProductManagement;