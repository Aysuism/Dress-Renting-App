import Swal from "sweetalert2";
import {
  useGetProductsQuery,
  useUpdateProductStatusMutation,
  useDeleteProductsMutation,
} from "../../tools/product";

const AdminPanel = () => {

  const { data: products = [], refetch } = useGetProductsQuery([]);
  console.log("Fetched products:", products);

  const [updateProductStatus] = useUpdateProductStatusMutation();
  const [deleteProduct] = useDeleteProductsMutation();


  const pendingProducts = products;

  const displaySizes = (product: any) => {
    if (product.colorAndSizes && product.colorAndSizes.length > 0) {
      const allSizes: string[] = [];

      product.colorAndSizes.forEach((colorSize: any) => {
        if (colorSize.sizeStockMap && typeof colorSize.sizeStockMap === 'object') {
          const sizes = Object.keys(colorSize.sizeStockMap);
          allSizes.push(...sizes);
        }
      });

      // Remove duplicates
      const uniqueSizes = [...new Set(allSizes)];
      return uniqueSizes.length > 0 ? uniqueSizes.join(", ") : "No sizes specified";
    }

    return "No sizes available";
  };


  const displayColors = (product: any) => {
    if (product.colorAndSizes && product.colorAndSizes.length > 0) {
      const colors = product.colorAndSizes.map((colorSize: any) => colorSize.color);
      return colors.join(", ");
    }
    return "No colors available";
  };

  const displayStatus = (product: any) => {
    return product.productStatus || "PENDING";
  };

  const handleSubmit = (productCode: string, status: "ACTIVE" | "REJECTED") => {
    const product = pendingProducts.find((p: any) => p.productCode === productCode);
    if (!product) return;

    updateProductStatus({ productCode, status })
      .unwrap()
      .then(() => {
        Swal.fire({
          icon: 'success',
          title: 'Uğurla dəyişdirildi!',
          text: `Məhsul statusu dəyişdirildi: ${status}`,
          timer: 1500,
          showConfirmButton: false,
        });
        refetch();
      })
      .catch((err) => {
        Swal.fire({
          icon: 'error',
          title: 'Xəta!',
          text: err?.data?.message || 'Serverdə problem yarandı.',
        });
      });
  };

  const handleDeleteAll = () => {
    if (products.length === 0) return;

    Swal.fire({
      title: 'Bütün məhsulları silmək istəyirsiniz?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Bəli, sil',
      cancelButtonText: 'Ləğv et',
    })
      .then((result) => {
        if (result.isConfirmed) {
          Promise.all(products.map((p: any) => deleteProduct(p.productCode).unwrap()))
            .then(() => {
              Swal.fire({
                icon: 'success',
                title: 'Bütün məhsullar silindi!',
                timer: 1500,
                showConfirmButton: false,
              });
              refetch();
            })
            .catch((err) => {
              Swal.fire({
                icon: 'error',
                title: 'Xəta!',
                text: err?.data?.message || 'Bəzi məhsullar silinə bilmədi.',
              });
            });
        }
      });
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Pending Products ({pendingProducts.length})</h2>
        {pendingProducts.length > 0 && (
          <button
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            onClick={handleDeleteAll}
          >
            Delete All
          </button>
        )}
      </div>

      {pendingProducts.length === 0 && (
        <div className="text-center p-8 border rounded-lg bg-gray-50">
          <p className="text-gray-500">No pending products found.</p>
          <p className="text-sm text-gray-400 mt-2">Send a test product to see it here.</p>
        </div>
      )}

      {pendingProducts.map((p: any) => {
        const sizes = displaySizes(p);
        const colors = displayColors(p);
        const status = displayStatus(p);

        return (
          <div key={p.productCode} className="border p-4 mb-4 rounded-lg bg-white shadow-sm">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p><strong>Product Code:</strong> {p.productCode}</p>
                <p><strong>Name:</strong> {p.name} {p.surname}</p>
                <p><strong>Email:</strong> {p.email}</p>
                <p><strong>Phone:</strong> {p.phone}</p>
                <p><strong>Price:</strong> {p.price || "Not set"}</p>
              </div>
              <div>
                <p><strong>Gender:</strong> {p.gender || "Not specified"}</p>
                <p><strong>Colors:</strong> {colors}</p>
                <p><strong>Sizes:</strong> {sizes}</p>
                <p><strong>Status:</strong> <span className={`font-semibold ${status === 'ACTIVE' ? 'text-green-600' : status === 'REJECTED' ? 'text-red-600' : 'text-yellow-600'}`}>{status}</span></p>
                <p><strong>Subcategory ID:</strong> {p.subcategoryId}</p>
                <p><strong>Created:</strong> {p.createdAt ? new Date(p.createdAt).toLocaleDateString() : "Unknown"}</p>
              </div>
            </div>

            {/* Display images if available */}
            {p.colorAndSizes && p.colorAndSizes.map((colorSize: any, colorIndex: number) => (
              colorSize.imageUrls && colorSize.imageUrls.length > 0 && (
                <div key={colorIndex} className="mt-4">
                  <strong>Images ({colorSize.color}):</strong>
                  <div className="flex gap-2 mt-2 flex-wrap">
                    {colorSize.imageUrls.map((url: string, imgIndex: number) => (
                      <img
                        key={imgIndex}
                        src={url}
                        alt={`Product ${colorSize.color} ${imgIndex + 1}`}
                        className="w-20 h-20 object-cover rounded border shadow-sm"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = 'none';
                        }}
                      />
                    ))}
                  </div>
                </div>
              )
            ))}

            <div className="mt-4 flex gap-2 flex-wrap">
              <button
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
                onClick={() => handleSubmit(p.productCode, "ACTIVE")}
              >
                ✓ Approve
              </button>
              <button
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                onClick={() => deleteProduct(p.productCode).unwrap().then(refetch)}
              >
                Delete
              </button>
              <button
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                onClick={() => handleSubmit(p.productCode, "REJECTED")}
              >
                ✗ Reject
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default AdminPanel;