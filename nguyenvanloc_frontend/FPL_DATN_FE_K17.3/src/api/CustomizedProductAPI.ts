
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { ICustomizedProduct } from '@/interfaces/customizedproducts';


const customizedProductApi = createApi({
    reducerPath: 'customizedproducts',
    tagTypes: ['customized-products'],
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
        getCustomProducts: builder.query<ICustomizedProduct[], void>({
            query: () => `/customized-products-list`,
            providesTags: ['customized-products']
        }),

        getCustomizedproductsById: builder.query<any, number | string>({
            query: (id) => `/customized-products/id/${id}`,
            providesTags: ['customized-products']
        }),
        getCustomizedproductsByUserId: builder.query<any, number | string>({
            query: (userId) => `/customized-products/${userId}`,
            providesTags: ['customized-products']
        }),

        getAllCustomProductDelete: builder.query<ICustomizedProduct[], void>({
            query: (userId) => `/CustomProducts/delete/${userId}`,
            providesTags: ['customized-products']
        }),
        getAllDelete: builder.query<ICustomizedProduct[], void>({
            query: () => `/CustomProducts/delete`,
            providesTags: ['customized-products']
        }),
        addCustomProduct: builder.mutation({
            query: (customizedProduct: ICustomizedProduct) => ({
                url: '/customized-products',
                method: 'POST',
                body: customizedProduct
            }),
            invalidatesTags: ['customized-products']
        }),
        removeCustomProduct: builder.mutation<ICustomizedProduct, number>({
            query: (id) => ({
                url: `/customized-products/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['customized-products']
        }),
        removeForceCustomProduct: builder.mutation<ICustomizedProduct, number>({
            query: (id) => ({
                url: `/customized-products/force/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['customized-products']
        }),

        RestoreCustomProduct: builder.mutation({
            query: (id) => ({
                url: `/customized-products/restore/${id}`,
                method: 'PATCH'
            }),
            invalidatesTags: ['customized-products']
        }),

        updateCustomProduct: builder.mutation({
            query: (customizedProduct: ICustomizedProduct) => ({
                url: `/customized-products/${customizedProduct.id}`,
                method: 'PATCH',
                body: customizedProduct
            }),
            invalidatesTags: ['customized-products']
        })

    })
});

export const {
    useGetCustomizedproductsByIdQuery,
    useGetCustomizedproductsByUserIdQuery,
    useAddCustomProductMutation,
    useUpdateCustomProductMutation,
    useRemoveForceCustomProductMutation,
    useRemoveCustomProductMutation,
    useRestoreCustomProductMutation,
    useGetAllCustomProductDeleteQuery,
    useGetCustomProductsQuery,
    useGetAllDeleteQuery
} = customizedProductApi;
export const CustomizedproductsReducer = customizedProductApi.reducer;
export default customizedProductApi