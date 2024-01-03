import { IOrder } from '@/interfaces/order';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';


const orderApi = createApi({
    reducerPath: 'order',
    tagTypes: ['Order'],
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
        getOrder: builder.query<IOrder[], void>({
            query: () => '/order',
            providesTags: ['Order']
        }),

        getOrderById: builder.query<IOrder, number | string>({
            query: (id) => `/order/${id}`,
            providesTags: ['Order']
        }),
        getOrderByUserId: builder.query<IOrder, number | string>({
            query: (userId) => `/order/${userId}/user`,
            providesTags: ['Order']
        }),
        addOrder: builder.mutation({
            query: (order: IOrder) => ({
                url: '/order',
                method: 'POST',
                body: order
            }),
            invalidatesTags: ['Order']
        }),
        removeOrder: builder.mutation<IOrder, number>({
            query: (id) => ({
                url: `/order/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Order']
        }),
        updateOrder: builder.mutation({
            query: (order: IOrder) => ({
                url: `/order/${order._id}`,
                method: 'PATCH',
                body: order
            }),
            invalidatesTags: ['Order']
        }),
        updateOrderStatus: builder.mutation({
            query: (order: any) => ({
                url: `/order-status/${order._id}`,
                method: 'PATCH',
                body: order
            }),
            invalidatesTags: ['Order']
        })
    })
});

export const {
    useGetOrderQuery,
    useGetOrderByIdQuery,
    useGetOrderByUserIdQuery,
    useAddOrderMutation,
    useRemoveOrderMutation,
    useUpdateOrderMutation,
    useUpdateOrderStatusMutation
} = orderApi;
export const orderReducer = orderApi.reducer;
export default orderApi