import { useState, useEffect } from 'react';
import { getPendingProducts, approveProduct, disapproveProduct } from '../tools/api';
import { type FormData } from '../tools/types';

const AdminPanel = () => {
    const [requests, setRequests] = useState<FormData[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchPendingProducts();
    }, []);

    const fetchPendingProducts = async () => {
        try {
            setLoading(true);
            setError(null);
            const pendingProducts = await getPendingProducts();
            setRequests(pendingProducts);
        } catch (err) {
            console.error('Error fetching pending products:', err);
            setError('Failed to load pending products');
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async (productCode: string) => {
        try {
            setError(null);
            await approveProduct(productCode);

            await fetchPendingProducts();
            alert('Product approved successfully!');
        } catch (err) {
            console.error('Error approving product:', err);
            setError('Failed to approve product');
        }
    };

    const handleReject = async (productCode: string) => {
        try {
            setError(null);
            await disapproveProduct(productCode);

            await fetchPendingProducts();
            alert('Product rejected successfully!');
        } catch (err) {
            console.error('Error rejecting product:', err);
            setError('Failed to reject product');
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="text-lg">Loading pending products...</div>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto p-6">
            <div className="bg-white p-8 rounded-2xl shadow-lg">
                <h2 className="text-3xl mb-6 text-center font-bold bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">
                    Admin Panel
                </h2>

                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
                        {error}
                    </div>
                )}

                <h3 className="text-xl font-semibold mb-4">
                    Pending Submissions ({requests.length})
                </h3>

                {requests.length === 0 ? (
                    <p className="text-gray-600 text-center py-8">No pending requests.</p>
                ) : (
                    <div className="space-y-6 max-h-[calc(100vh-200px)] overflow-y-auto">
                        {requests.map((req, idx) => (
                            <div key={idx} className="p-6 border rounded-xl shadow-sm bg-white">
                                <div className="flex justify-between items-start mb-4">
                                    <h4 className="font-bold text-lg">
                                        {req.category?.name} - {req.productCode}
                                    </h4>
                                    <span className="bg-yellow-100 text-yellow-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                                        Pending
                                    </span>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                    <div>
                                        <p><span className="font-semibold">Submitted by:</span> {req.name} {req.surname}</p>
                                        <p><span className="font-semibold">Contact:</span> {req.email} | {req.phone}</p>
                                    </div>
                                    <div>
                                        <p><span className="font-semibold">Gender:</span> {req.gender?.name}</p>
                                        <p><span className="font-semibold">Offer Type:</span> {req.offerType?.name}</p>
                                        <p><span className="font-semibold">Condition:</span> {req.condition?.name}</p>
                                        <p><span className="font-semibold">Price:</span> ${req.price}</p>
                                    </div>
                                    <div>
                                        <p><span className="font-semibold">Colors:</span> {req.colors.map(c => c.name).join(", ")}</p>
                                    </div>
                                    <div>
                                        <p><span className="font-semibold">Sizes:</span> {req.sizes.join(", ")}</p>
                                    </div>
                                </div>

                                {/* {req.images && req.images.length > 0 && (
                                    <div className="mt-3">
                                        <p className="font-semibold mb-2">Images:</p>
                                        <div className="flex gap-2 flex-wrap">
                                            {req.images.map((image, i) => (
                                                <img
                                                    key={i}
                                                    src={typeof image === 'string' ? image : URL.createObjectURL(image)}
                                                    alt="preview"
                                                    className="w-16 h-16 object-cover rounded"
                                                />
                                            ))}
                                        </div>
                                    </div>
                                )} */}

                                <div className="flex gap-3 mt-6">
                                    <button
                                        onClick={() => handleApprove(req.productCode)}
                                        className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg flex-1 transition-colors"
                                    >
                                        Approve
                                    </button>
                                    <button
                                        onClick={() => handleReject(req.productCode)}
                                        className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg flex-1 transition-colors"
                                    >
                                        Reject
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminPanel;