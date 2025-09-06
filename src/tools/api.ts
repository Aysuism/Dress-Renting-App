import { type FormData } from "./types";

const API_BASE_URL = 'http://localhost:8081';

// Local storage keys
const PENDING_PRODUCTS_KEY = 'pendingProducts';
const APPROVED_PRODUCTS_KEY = 'approvedProducts';

// Submit product - store in localStorage temporarily
export const submitProduct = async (productData: FormData) => {
    // For now, store in localStorage since backend doesn't have pending storage
    const pendingProducts = getPendingProductsFromStorage();

    // Convert File objects to something storable
    const imagesForStorage = await Promise.all(
        productData.images.map(async (file) => {
            if (file instanceof File) {
                // Convert File to data URL for storage
                return new Promise<string>((resolve) => {
                    const reader = new FileReader();
                    reader.onload = (e) => resolve(e.target?.result as string);
                    reader.readAsDataURL(file);
                });
            }
            return file; // Already a data URL
        })
    );

    const newProduct = {
        ...productData,
        image: await Promise.all(imagesForStorage),
        id: Date.now().toString(), // Add unique ID
        status: 'PENDING' as const
    };

    pendingProducts.push(newProduct);
    localStorage.setItem(PENDING_PRODUCTS_KEY, JSON.stringify(pendingProducts));

    return Promise.resolve(newProduct);
};

// Get pending products from localStorage
export const getPendingProducts = async (): Promise<FormData[]> => {
    return getPendingProductsFromStorage();
};

// Approve product - move from pending to approved
export const approveProduct = async (productCode: string) => {
    const pendingProducts = getPendingProductsFromStorage();
    const approvedProducts = getApprovedProductsFromStorage();

    const productIndex = pendingProducts.findIndex(p => p.productCode === productCode);

    if (productIndex === -1) {
        throw new Error('Product not found');
    }

    const approvedProduct = pendingProducts[productIndex];
    approvedProduct.status = 'APPROVED';

    // Remove from pending, add to approved
    pendingProducts.splice(productIndex, 1);
    approvedProducts.push(approvedProduct);

    localStorage.setItem(PENDING_PRODUCTS_KEY, JSON.stringify(pendingProducts));
    localStorage.setItem(APPROVED_PRODUCTS_KEY, JSON.stringify(approvedProducts));

    return Promise.resolve(approvedProduct);
};

// Reject product - just remove from pending
export const disapproveProduct = async (productCode: string) => {
    const pendingProducts = getPendingProductsFromStorage();

    const productIndex = pendingProducts.findIndex(p => p.productCode === productCode);

    if (productIndex === -1) {
        throw new Error('Product not found');
    }

    pendingProducts.splice(productIndex, 1);
    localStorage.setItem(PENDING_PRODUCTS_KEY, JSON.stringify(pendingProducts));

    return Promise.resolve();
};

// Helper functions for localStorage
const getPendingProductsFromStorage = (): FormData[] => {
    try {
        const stored = localStorage.getItem(PENDING_PRODUCTS_KEY);
        if (!stored) return [];

        const products = JSON.parse(stored);

        // Convert image data back to proper format
        return products.map((product: any) => ({
            ...product,
            // Images are stored as objects, we can't recreate File objects
            // So we'll store them as data URLs for display purposes
            images: product.images || []
        }));
    } catch {
        return [];
    }
};

const getApprovedProductsFromStorage = (): FormData[] => {
    try {
        const stored = localStorage.getItem(APPROVED_PRODUCTS_KEY);
        return stored ? JSON.parse(stored) : [];
    } catch {
        return [];
    }
};

export const submitProductToAPI = async (productData: FormData) => {
  const formData = new FormData();
  
  // Create the nested structure that matches ProductRequestDto
  const productRequest = {
    subcategoryId: productData.category?.id,
    colorAndSizes: productData.colors.map(color => ({
      colorId: color.id,
      sizes: productData.sizes
    })),
    gender: productData.gender?.name,
    productOffers: [{
      offerType: productData.offerType?.name,
      productCondition: productData.condition?.name,
      price: productData.price,
      rentDuration: productData.rentDuration || 1
    }],
    name: productData.name,
    surname: productData.surname,
    email: productData.email,
    phone: productData.phone,
    productCode: productData.productCode
  };
  
  // Append as a simple string (not Blob)
  formData.append('product', JSON.stringify(productRequest));
  
  // Append images (even if empty array)
  productData.images.forEach((image) => {
    formData.append('images', image);
  });

  // Debug: Log what we're sending
  console.log('FormData entries:');
  for (let [key, value] of formData.entries()) {
    console.log(key, value instanceof File ? `File: ${value.name}` : value);
  }

  try {
    console.log('Submitting to API:', productRequest);
    
    const response = await fetch(`${API_BASE_URL}/api/v1/products/upload`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('API Error response:', errorText);
      throw new Error(`Failed to submit product: ${response.status} ${response.statusText}`);
    }

    return response.json();
  } catch (error) {
    console.error('Error submitting product to API:', error);
    throw error;
  }
};