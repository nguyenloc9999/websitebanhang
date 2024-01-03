

import { IColor } from '@/interfaces/color';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';


const colorApi = createApi({
    reducerPath: 'colors',
    tagTypes: ['Colors'],
    baseQuery: fetchBaseQuery({
        baseUrl: import.meta.env.VITE_API_URL,
    }),
    endpoints: (builder) => ({
        getColors: builder.query<IColor[], void>({
            query: () => `/colors`,
            providesTags: ['Colors']
        }),
        getColorById: builder.query<IColor, number | string>({
            query: (id) => `/colors/${id}`,
            providesTags: ['Colors']
        }),
        addColor: builder.mutation({
            query: (color: IColor) => ({
                url: '/colors',
                method: "POST",
                body: color
            }),
            invalidatesTags: ['Colors']
        }),
        removeColor: builder.mutation({
            query: (id) => ({
                url: `/colors/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ['Colors']
        }),
        updateColor: builder.mutation({
            query: (color: IColor) => ({
                url: `/colors/${color._id}`,
                method: "PATCH",
                body: color
            }),
            invalidatesTags: ['Colors']
        })
    })
});

export const {
    useGetColorsQuery,
    useGetColorByIdQuery,
    useAddColorMutation,
    useRemoveColorMutation,
    useUpdateColorMutation
} = colorApi;
export const colorReducer = colorApi.reducer;
export default colorApi