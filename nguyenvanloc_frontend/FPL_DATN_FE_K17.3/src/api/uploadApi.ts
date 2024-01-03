import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const uploadApi = createApi({
    reducerPath: 'upload',
    tagTypes: ['Upload'],
    baseQuery: fetchBaseQuery({
        baseUrl: import.meta.env.VITE_API_URL,
    }),
    endpoints: (builder) => ({
        addImage: builder.mutation({
            query: (files) => ({
                url: "/images/upload",
                method: "POST",
                body: files,
            }),
            invalidatesTags: ['Upload']
        }),
        updateImage: builder.mutation({
            query: ({ publicId, files }) => ({
                url: `/images/${publicId}`,
                method: "PUT",
                body: files,
            }),
            invalidatesTags: ['Upload']
        }),
        deleteImage: builder.mutation({
            query: (publicId) => ({
                url: `/images/${publicId}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Upload'],
        }),

    }),
});

export const {
    useAddImageMutation,
    useUpdateImageMutation,
    useDeleteImageMutation
} = uploadApi;
export const uploadReducer = uploadApi.reducer;
export default uploadApi