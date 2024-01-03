import { ICategory } from "@/interfaces/category";
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';


const categoryApi = createApi({
    reducerPath: 'category',
    tagTypes: ['Category'],
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
        getCategory: builder.query<ICategory[], void>({
            query: () => '/category',
            providesTags: ['Category']
        }),
        getAllDelete: builder.query<ICategory[], void>({
            query: () => '/category/delete',
            providesTags: ['Category']
        })
        ,
        getCategoryById: builder.query<ICategory, number | string>({
            query: (id: any) => `/category/${id}`,
            providesTags: ['Category']
        }),
        // 
        addCategory: builder.mutation({
            query: (category: ICategory) => ({
                url: '/category',
                method: 'POST',
                body: category
            }),
            invalidatesTags: ['Category']
        }),
        removeCategory: builder.mutation<ICategory, string>({
            query: (id) => ({
                url: `/category/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Category']
        }),
        removeForceCategory: builder.mutation<ICategory, number | string>({
            query: (id) => ({
                url: `/category/force/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Category']
        }),
        updateCategory: builder.mutation({
            query: (category: ICategory) => ({
                url: `/category/${category._id}`,
                method: 'PATCH',
                body: category
            }),
            invalidatesTags: ['Category']
        }),
        restoreCategory: builder.mutation({
            query: (id) => ({
                url: `/category/restore/${id}`,
                method: 'PATCH'
            }),
            invalidatesTags: ['Category']
        })
    })
});

export const {
    useGetCategoryQuery,
    useGetCategoryByIdQuery,
    useGetAllDeleteQuery,
    useAddCategoryMutation,
    useRemoveCategoryMutation,
    useRemoveForceCategoryMutation,
    useUpdateCategoryMutation,
    useRestoreCategoryMutation
} = categoryApi;
export const categoryReducer = categoryApi.reducer;
export default categoryApi