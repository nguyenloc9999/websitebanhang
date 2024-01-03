import { IStatus } from '@/interfaces/status';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';


const statusApi = createApi({
    reducerPath: 'status',
    tagTypes: ['Status'],
    baseQuery: fetchBaseQuery({
        baseUrl: import.meta.env.VITE_API_URL,
    }),
    endpoints: (builder) => ({
        getStatus: builder.query<IStatus[], void>({
            query: () => `/status`,
            providesTags: ['Status']
        }),
        addStatus: builder.mutation({
            query: (status: IStatus) => ({
                url: '/status',
                method: "POST",
                body: status
            }),
            invalidatesTags: ['Status']
        }),
        updateStatus: builder.mutation({
            query: (status: IStatus) => ({
                url: `/status/${status.id}`,
                method: "PATCH",
                body: status
            }),
            invalidatesTags: ['Status']
        })
    })
});

export const {
    useGetStatusQuery, useAddStatusMutation, useUpdateStatusMutation
} = statusApi;
export const statusReducer = statusApi.reducer;
export default statusApi