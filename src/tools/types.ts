export interface User {
  id: number;
  name: string;
  surname: string;
  email: string;
  phone: string;
  userRole: "USER";
}

export interface Option {
  id: number;
  name: string;
  value?: string;
}

export interface ColorAndSize {
  id: number;
  color: string;
  photoCount: number;
  stock: number;
  imageUrls: string[];
  sizeStockMap: Record<string, number>;
}

export interface Offer {
  id: number;
  offerTypes: "RENT" | "SALE";
  price: number;
  rentDuration?: number; // only for RENT
  productCondition: "FIRST_HAND" | "SECOND_HAND";
}

export interface Product {
  id: number;
  productCode: string;
  category: Option;          // main category
  subcategoryId?: number;    // optional
  price: number;
  gender: "WOMAN" | "MAN" | "KID";
  user: User;
  colorAndSizes: ColorAndSize[];
  createdAt: string; // ISO date string
  offers: Offer[];
  status: "PENDING" | "APPROVED" | "REJECTED" | "ACTIVE";
}


// Form data type (for adding/editing)
// export interface FormData {
//   id?: string; // optional for localStorage
//   user: User;
//   category: Option | null;
//   gender: Option | null;
//   offerTypes: Option | null;
//   condition: Option | null;
//   colors: Option[];
//   sizes: string[];
//   price: number;
//   images: File[]; // file objects
//   rentDuration: number;
//   productCode: string;
//   status?: 'PENDING' | 'APPROVED' | 'REJECTED';
// }