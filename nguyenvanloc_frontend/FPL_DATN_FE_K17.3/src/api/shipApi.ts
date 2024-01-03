

import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
const authToken = '460e0e59-51df-11ee-96dc-de6f804954c9';


const shipApi = createApi({
    reducerPath: 'ships',
    tagTypes: ['Ship'],
    baseQuery: fetchBaseQuery({
        baseUrl: 'https://online-gateway.ghn.vn/shiip/public-api',
        headers: {
            'Token': `${authToken}`, // Header Authorization chứa token
        },
    }),
    endpoints: (builder) => ({
        getCity: builder.query<any, void>({
            query: () => `/master-data/province`,
            providesTags: ['Ship']
        }),
        getDistrict: builder.mutation({
            query: (provider) => ({
                url: '/master-data/district',
                method: "POST",
                body: provider
            }),
            invalidatesTags: ['Ship']
        }),
        getWard: builder.mutation({
            query: (district) => ({
                url: '/master-data/ward',
                method: "POST",
                body: district
            }),
            invalidatesTags: ['Ship']
        }),
        getAvailable: builder.mutation({
            query: (service) => ({
                url: '/v2/shipping-order/available-services',
                method: "POST",
                body: service
            }),
            invalidatesTags: ['Ship']
        }),
        getShipping: builder.mutation({
            query: (service) => ({
                url: '/v2/shipping-order/fee',
                method: "POST",
                body: service
            }),
            invalidatesTags: ['Ship']
        }),
    })
});

export const {
    useGetCityQuery,
    useGetDistrictMutation,
    useGetWardMutation,
    useGetAvailableMutation,
    useGetShippingMutation

} = shipApi;
export const shipReducer = shipApi.reducer;
export default shipApi