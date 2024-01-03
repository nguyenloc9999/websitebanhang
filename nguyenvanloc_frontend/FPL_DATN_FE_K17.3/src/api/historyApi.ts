import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';


const historyApi = createApi({
    reducerPath: 'history',
    tagTypes: ['History'],
    baseQuery: fetchBaseQuery({
        baseUrl: import.meta.env.VITE_API_URL,
    }),
    endpoints: (builder) => ({
        getByOrderHistory: builder.query({
            query: (orderId: string) => `/history/${orderId}`,
            providesTags: ['History']
        }),
        createHistory: builder.mutation({
            query: (history: any) => ({
                url: '/history',
                method: "POST",
                body: history
            }),
            invalidatesTags: ['History']
        }),
    })
});

export const {
    useGetByOrderHistoryQuery,
    useCreateHistoryMutation
} = historyApi;
export const historyReducer = historyApi.reducer;
export default historyApi