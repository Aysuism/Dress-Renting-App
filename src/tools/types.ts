export interface Option {
  id: number;
  name: string;
}

export interface FormData {
  category: Option | null;
  gender: Option | null;
  offerType: Option | null;
  condition: Option | null;
  colors: Option[];
  sizes: string[];
  price: number;
  images: File[];
  rentDuration: number;
  productCode: string;
  name: string;
  surname: string;
  email: string;
  phone: string;
  status?: 'PENDING' | 'APPROVED' | 'REJECTED';
  id?: string; // Add for localStorage
}