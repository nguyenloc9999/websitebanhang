
import { IBrand } from '@/interfaces/brand';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';


const brandApi = createApi({
    reducerPath: 'brands',
    tagTypes: ['Brands'],
    baseQuery: fetchBaseQuery({
        baseUrl: import.meta.env.VITE_API_URL,
    }),
    endpoints: (builder) => ({
        getBrand: builder.query<IBrand[], void>({
            query: () => `/brands`,
            providesTags: ['Brands']
        }),
        getBrandById: builder.query<IBrand, number | string>({
            query: (id) => `/brands/${id}`,
            providesTags: ['Brands']
        }),
        addBrand: builder.mutation({
            query: (brand: IBrand) => ({
                url: '/brands',
                method: "POST",
                body: brand
            }),
            invalidatesTags: ['Brands']
        }),
        removeBrand: builder.mutation({
            query: (id) => ({
                url: `/brands/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ['Brands']
        }),
        updateBrand: builder.mutation({
            query: (brand: IBrand) => ({
                url: `/brands/${brand._id}`,
                method: "PATCH",
                body: brand
            }),
            invalidatesTags: ['Brands']
        })
    })
});

export const { useGetBrandQuery, useGetBrandByIdQuery, useAddBrandMutation, useRemoveBrandMutation, useUpdateBrandMutation } = brandApi;
export const brandReducer = brandApi.reducer;
export default brandApi