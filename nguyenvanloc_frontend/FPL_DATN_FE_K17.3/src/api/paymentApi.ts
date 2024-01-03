

import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';


const paymentApi = createApi({
    reducerPath: 'payments',
    tagTypes: ['Payment'],
    baseQuery: fetchBaseQuery({
        baseUrl: import.meta.env.VITE_API_URL,
    }),
    endpoints: (builder) => ({
        getMomo: builder.query<any, void>({
            query: () => `/momo`,
            providesTags: ['Payment']
        }),
        payMomo: builder.mutation({
            query: (momo: any) => ({
                url: '/create_momo',
                method: "POST",
                body: momo
            }),
            invalidatesTags: ['Payment']
        }),
        payPaypal: builder.mutation({
            query: (paypal: any) => ({
                url: '/create_pay',
                method: "POST",
                body: paypal
            }),
            invalidatesTags: ['Payment']
        }),

    })
});

export const {
    usePayMomoMutation,
    usePayPaypalMutation
} = paymentApi;
export const paymentReducer = paymentApi.reducer;
export default paymentApi