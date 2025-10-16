export interface User {
  id: number;
  name: string;
  surname: string;
  email: string;
  phone: string;
  userRole: "USER";
}

export interface Option {
  id: string | number;
  name: string;
  value?: string;
}

export interface ColorAndSize {
  id: number;
  color: string;
  photoCount: number;
  stock: number;
  imageUrls: string;
  size: string[];
}

export interface Offer {
  id: number;
  offerType: "RENT" | "SALE";
  price: number;
  rentDuration?: number;
  productCondition: "FIRST_HAND" | "SECOND_HAND";
}

// export interface Product {
//   userName: string;
//   userSurname: string;
//   userEmail: string;
//   userPhone: string;
//   productCode: string;
//   subcategoryId: string;
//   price: number;
//   gender: "WOMAN" | "MAN" | "KID";
//   description:string;
//   colorAndSizes: ColorAndSize[];
//   createdAt: string;
//   offers: Offer[];
// }