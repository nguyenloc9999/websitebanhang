import { IChildProduct } from '@/interfaces/childProduct';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';


const childProductApi = createApi({
    reducerPath: 'childProduct',
    tagTypes: ['child-products'],
    baseQuery: fetchBaseQuery({
        baseUrl: import.meta.env.VITE_API_URL,
        prepareHeaders: (headers) => {
            const storedData = localStorage.getItem('accessToken');
            if (storedData) {
                const { accessToken } = JSON.parse(storedData);
                if (accessToken) {
                    headers.set('Authorization', `Bearer ${accessToken}`);
                }
            }
            return headers;
        },

    }),
    endpoints: (builder) => ({
        getChildProductPrice: builder.query({
            query: (query) => `/get-child-product?productId=${query.productId}&sizeId=${query.sizeId}&colorId=${query.colorId}`,
            providesTags: ['child-products']
        }),
        getChildProductById: builder.query<IChildProduct, number | string>({
            query: (id) => `/child-product/${id}`,
            providesTags: ['child-products']
        }),
        // 
        getChildProductByProductId: builder.query<IChildProduct, number | string>({
            query: (productId) => {
                if (productId) {
                    return `/child-products/${productId}`;
                } else {
                    return '';
                }
            },
            providesTags: ['child-products']
        }),

        addChildProduct: builder.mutation({
            query: (childProduct: IChildProduct) => ({
                url: '/child-products',
                method: 'POST',
                body: childProduct
            }),
            invalidatesTags: ['child-products']
        }),
        removecChildProduct: builder.mutation<IChildProduct, number | string>({
            query: (id) => ({
                url: `/child-products/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['child-products']
        }),
        updateChildProduct: builder.mutation({
            query: (childProduct: IChildProduct) => ({
                url: `/child-product/${childProduct._id}`,
                method: 'PATCH',
                body: childProduct
            }),
            invalidatesTags: ['child-products']
        })
    })
});

export const {
    useGetChildProductPriceQuery,
    useGetChildProductByIdQuery,
    useGetChildProductByProductIdQuery,
    useAddChildProductMutation,
    useRemovecChildProductMutation,
    useUpdateChildProductMutation
} = childProductApi;
export const childProductReducer = childProductApi.reducer;
export default childProductApi