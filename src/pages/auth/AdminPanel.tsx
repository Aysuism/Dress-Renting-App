import { useSelector, useDispatch } from "react-redux";
import Swal from "sweetalert2";
import type { RootState } from "../../tools/store";
import { updateProductStatus } from "../../tools/fakeApi";

const AdminPanel = () => {
    const dispatch = useDispatch();

    // Only pending products
    const pendingProducts = useSelector((state: RootState) =>
        state.fakeProducts.pending.filter(p => p.productStatus === "PENDING")
    );

    const handleSubmit = (productCode: string, status: "ACTIVE" | "REJECTED") => {
        const product = pendingProducts.find(p => p.productCode === productCode);
        if (!product) return;

        // Update Redux (and localStorage inside your fakeApi)
        dispatch(updateProductStatus({ productCode, status }));

        Swal.fire({
            icon: 'success',
            title: 'Uğurla dəyişdirildi!',
            text: `Product ${product.productCode} status: ${status}`,
            timer: 1500,
            showConfirmButton: false,
        });
    };

    return (
        <div className="p-6">
            <h2 className="text-xl font-bold mb-4">Pending Products</h2>
            {pendingProducts.length === 0 && <p>No pending products.</p>}

            {pendingProducts.map((p:any) => (
                <div
                    key={`${p.id}-${p.productCode}`}
                    className="border p-4 mb-4 rounded-lg"
                >
                    <p><strong>Name:</strong> {p.name} {p.surname}</p>
                    <p><strong>Email:</strong> {p.email}</p>
                    <p><strong>Phone:</strong> {p.phone}</p>
                    <p><strong>Product Code:</strong> {p.productCode}</p>
                    <p><strong>Price:</strong> {p.price}</p>
                    <p><strong>Category:</strong> {p.category?.name ?? "-"}</p>
                    <p><strong>Status:</strong> {p.productStatus}</p>

                    <div className="mt-2 flex gap-2">
                        <button
                            className="px-3 py-1 bg-green-500 text-white rounded"
                            onClick={() => handleSubmit(p.productCode, "ACTIVE")}
                        >
                            Approve
                        </button>
                        <button
                            className="px-3 py-1 bg-red-500 text-white rounded"
                            onClick={() => handleSubmit(p.productCode, "REJECTED")}
                        >
                            Reject
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default AdminPanel;