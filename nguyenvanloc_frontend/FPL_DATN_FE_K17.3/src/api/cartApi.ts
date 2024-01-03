import { InputCart } from '@/interfaces/cart';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';


const cartApi = createApi({
    reducerPath: 'carts',
    tagTypes: ['Carts'],
    baseQuery: fetchBaseQuery({
        baseUrl: import.meta.env.VITE_API_URL,
        prepareHeaders: (headers) => {
            // const accessToken = JSON.parse(localStorage.getItem('accessToken') || '');
            // if (accessToken) {
            //     headers.set('Authorization', `Bearer ${accessToken}`);
            // }
            return headers;
        },

    }),
    endpoints: (builder) => ({
        getCarts: builder.query<any, string>({
            query: (userId) => `/carts/${userId}`,
            providesTags: ['Carts']
        }),
        addCart: builder.mutation({
            query: ({ data, userId }: { data: InputCart; userId: string }) => ({
                url: `/carts/${userId}/create`,
                method: 'POST',
                body: data
            }),
            invalidatesTags: ['Carts']
        }),
        removeProductInCart: builder.mutation<any, { userId: string, productId: string, colorId: string, sizeId: string, materialId: string }>({
            query: ({ userId, productId, colorId, sizeId, materialId }) => ({
                url: `/carts/${userId}/remove?idProduct=${productId}&colorId=${colorId}&sizeId=${sizeId}&materialId=${materialId}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Carts']
        }),

        changeQuantity: builder.mutation({
            query: ({ data, userId, productId, sizeId, colorId, materialId }: { data: any; userId: string, productId: string, sizeId: string, colorId: string, materialId: string }) => ({
                url: `/carts/${userId}/change?productId=${productId}&sizeId=${sizeId}&colorId=${colorId}&materialId=${materialId}`,
                method: 'PUT',
                body: data
            }),
            invalidatesTags: ['Carts']
        }),

        removeAllCart: builder.mutation<any, string | number>({
            query: (userId) => ({
                url: `/carts/${userId}/clears`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Carts']
        }),
        applyCoupon: builder.mutation({
            query: ({ data, userId }: { data: InputCart; userId: string }) => ({
                url: `/carts/${userId}/apply`,
                method: 'PATCH',
                body: data
            }),
            invalidatesTags: ['Carts']
        }),
        removeCoupon: builder.mutation({
            query: ({ data, userId }: { data: any; userId: string }) => ({
                url: `/carts/${userId}/remove-coupon`,
                method: 'PATCH',
                body: data
            }),
            invalidatesTags: ['Carts']
        }),
    })
});

export const {
    useGetCartsQuery,
    useAddCartMutation,
    useChangeQuantityMutation,
    useRemoveAllCartMutation,
    useRemoveProductInCartMutation,
    useApplyCouponMutation,
    useRemoveCouponMutation
} = cartApi;
export const cartReducer = cartApi.reducer;
export default cartApi