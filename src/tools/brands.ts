import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "./base-query";

export const brandsApi = createApi({
    reducerPath: "brandsApi",
    baseQuery: baseQuery("/brands"),
    tagTypes: ["Brands"],
    endpoints: (build) => ({
        getBrands: build.query({
            query: () => "",
            providesTags: ["Brands"],
        }),

        addBrands: build.mutation({
            query: (formData) => ({
                url: "",
                method: "POST",
                body: JSON.stringify(formData),
                headers: { "Content-Type": "application/json" },
            }),
            invalidatesTags: ["Brands"],
        }),

        updateBrands: build.mutation({
            query: ({ id, data }) => ({
                url: `/${id}`,
                method: "PUT",
                body: data,
            }),
            invalidatesTags: ["Brands"],
        }),

        deleteBrands: build.mutation({
            query: (id) => ({
                url: `/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Brands"],
        }),
    }),
})

export const {
    useGetBrandsQuery,
    useAddBrandsMutation,
    useUpdateBrandsMutation,
    useDeleteBrandsMutation,
} = brandsApi;