
import { ISize } from '@/interfaces/size';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';


const sizeApi = createApi({
    reducerPath: 'size',
    tagTypes: ['Size'],
    baseQuery: fetchBaseQuery({
        baseUrl: import.meta.env.VITE_API_URL,
    }),
    endpoints: (builder) => ({
        getSize: builder.query<ISize[], void>({
            query: () => `/size`,
            providesTags: ['Size']
        }),
        getSizeByDesign: builder.query<ISize[], void>({
            query: () => `/size-custom`,
            providesTags: ['Size']
        }),
        getSizeById: builder.query<ISize, number | string>({
            query: (id) => `/size/${id}`,
            providesTags: ['Size']
        }),
        addSize: builder.mutation({
            query: (size: ISize) => ({
                url: '/size',
                method: "POST",
                body: size
            }),
            invalidatesTags: ['Size']
        }),
        removeSize: builder.mutation({
            query: (id) => ({
                url: `/size/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ['Size']
        }),
        updateSize: builder.mutation({
            query: (size: ISize) => ({
                url: `/size/${size._id}`,
                method: "PATCH",
                body: size
            }),
            invalidatesTags: ['Size']
        })
    })
});

export const {
    useGetSizeQuery,
    useGetSizeByDesignQuery,
    useGetSizeByIdQuery,
    useAddSizeMutation,
    useRemoveSizeMutation,
    useUpdateSizeMutation
} = sizeApi;
export const sizeReducer = sizeApi.reducer;
export default sizeApi