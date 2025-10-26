import { useState } from "react";
import Swal from "sweetalert2";
import { useDeleteProductsMutation, useGetProductsQuery } from "../../tools/product";
import { useApproveProductMutation, useDisapproveProductMutation, useGetAllProductsQuery, } from "../../tools/adminReview";
import type { Product } from "../ProductDetails";

const ProductManagement = () => {
    const [activeTab, setActiveTab] = useState<"pending" | "approved">("pending");

    const { data: pendingProducts = [], refetch: refetchPending } =
        activeTab === "pending" ? useGetAllProductsQuery([]) : { data: [], refetch: () => { } };

    const { data: approvedProducts = [], refetch: refetchApproved } =
        activeTab === "approved" ? useGetProductsQuery([]) : { data: [], refetch: () => { } };

    const displayedProducts = activeTab === "pending" ? pendingProducts : approvedProducts;

    const [deleteProduct, { isLoading: isDeleted }] = useDeleteProductsMutation();
    const [approveProduct, { isLoading: isApproved }] = useApproveProductMutation();
    const [disapproveProduct, { isLoading: isDisapproved }] = useDisapproveProductMutation();

    const reloadData = () => {
        if (activeTab === "pending") refetchPending();
        if (activeTab === "approved") refetchApproved();
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
        <div className="space-y-6">
            {/* Tabs */}
            <div className="flex gap-4">
                <button
                    onClick={() => setActiveTab("pending")}
                    className={`px-4 py-2 rounded-lg font-semibold transition ${activeTab === "pending"
                        ? "bg-blue-600 text-white"
                        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                        }`}
                >
                    Pending
                </button>
                <button
                    onClick={() => setActiveTab("approved")}
                    className={`px-4 py-2 rounded-lg font-semibold transition ${activeTab === "approved"
                        ? "bg-blue-600 text-white"
                        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                        }`}
                >
                    Approved
                </button>
            </div>

            {/* Product List */}
            {displayedProducts.length === 0 ? (
                <div className="text-center p-10 border rounded-lg bg-gray-50 text-gray-500">
                    No products found.
                </div>
            ) : (
                displayedProducts.map((p: Product) => {
                    const sizeInfo = p.colorAndSizes.map((cs) => cs.sizes.join(", "));

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
                                    <p><strong>Size:</strong> {sizeInfo.join("; ") || "Not specified"}</p>
                                    <p><strong>Subcategory:</strong> {p.subcategory?.name}</p>
                                    <p><strong>Created:</strong> {p.createdAt ? new Date(p.createdAt).toLocaleDateString() : "Unknown"}</p>
                                </div>

                                {/* Right Info */}
                                <div className="space-y-4">
                                    {p.colorAndSizes?.map((cs, idx) => (
                                        <div key={idx} className="space-y-1">
                                            <p><strong>Color:</strong> {cs.color}</p>
                                            <p><strong>Size:</strong> {cs.sizes?.join(", ") || "No sizes"}</p>
                                            {cs.imageUrls?.length > 0 ? (
                                                <div className="flex flex-wrap gap-2 mt-2">
                                                    {cs.imageUrls.map((url, imgIdx) => (
                                                        <img
                                                            key={imgIdx}
                                                            src={url}
                                                            alt={`Product ${cs.color} ${imgIdx + 1}`}
                                                            className="w-24 h-24 object-cover rounded border shadow-sm"
                                                            onError={(e) => {
                                                                const img = e.currentTarget as HTMLImageElement;
                                                                img.style.display = "none";
                                                            }}
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
                                {activeTab === "pending" && (
                                    <>
                                        <button
                                            onClick={() => handleApprove(p.productCode)}
                                            className="flex-1 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
                                            disabled={isApproved}
                                        >
                                            {isApproved ? "Qəbul edilir..." : "✓ Qəbul et"}
                                        </button>
                                        <button
                                            onClick={() => handleDelete(p.productCode)}
                                            className="flex-1 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                                            disabled={isDeleted}
                                        >
                                            {isDeleted ? "Silinir..." : "Sil"}
                                        </button>
                                    </>
                                )}
                                <button
                                    onClick={() => handleReject(p.productCode)}
                                    className="flex-1 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition"
                                    disabled={isDisapproved}
                                >
                                    {isDisapproved ? "İmtina edilir..." : "✗ İmtina"}
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