// tools/fakeApi.ts
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { type FormDataState } from "../pages/AddCloth";

export type ProductStatus = "PENDING" | "ACTIVE" | "REJECTED";

export interface PendingProduct extends FormDataState {
  id: number;
  productStatus: ProductStatus;
  productCode: string;
}

interface ProductsState {
  pending: PendingProduct[];
}

// Load from localStorage on init
const loadFromStorage = (): PendingProduct[] => {
  try {
    const raw = localStorage.getItem("pendingProducts");
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

const initialState: ProductsState = { pending: loadFromStorage() };
let nextId = 1;

export const fakeProductsSlice = createSlice({
  name: "fakeProducts",
  initialState,
  reducers: {
    addPendingProduct: (state, action: PayloadAction<FormDataState>) => {
      state.pending.push({
        ...action.payload,
        id: nextId++,
        productStatus: "PENDING",
      });
      localStorage.setItem("pendingProducts", JSON.stringify(state.pending));
    },
    updateProductStatus: (
      state,
      action: PayloadAction<{ id?: number; productCode?: string; status: ProductStatus }>
    ) => {
      const product = state.pending.find(
        p => (action.payload.id ? p.id === action.payload.id : p.productCode === action.payload.productCode)
      );

      if (product) {
        product.productStatus = action.payload.status;
      }

      // Only keep PENDING products in the pending list
      state.pending = state.pending.filter(p => p.productStatus === "PENDING");
      localStorage.setItem("pendingProducts", JSON.stringify(state.pending));
    },
  },
});

export const { addPendingProduct, updateProductStatus } = fakeProductsSlice.actions;
export default fakeProductsSlice.reducer;