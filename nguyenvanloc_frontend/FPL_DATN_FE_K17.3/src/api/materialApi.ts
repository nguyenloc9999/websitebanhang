import { IMaterials } from '@/interfaces/materials';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';


const materialsApi = createApi({
    reducerPath: 'materials',
    tagTypes: ['Materials'],
    baseQuery: fetchBaseQuery({
        baseUrl: import.meta.env.VITE_API_URL,
    }),
    endpoints: (builder) => ({
        getMaterial: builder.query<IMaterials[], void>({
            query: () => '/materials',
            providesTags: ['Materials']
        }),
        getMaterialById: builder.query<IMaterials, number | string>({
            query: (id) => `/materials/${id}`,
            providesTags: ['Materials']
        }),
        addMaterial: builder.mutation({
            query: (materials: IMaterials) => ({
                url: '/materials',
                method: "POST",
                body: materials
            }),
            invalidatesTags: ['Materials']
        }),
        removeMaterial: builder.mutation({
            query: (id: string) => ({
                url: `/materials/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ['Materials']
        }),
        updateMaterial: builder.mutation({
            query: (materials: IMaterials) => ({
                url: `/materials/${materials._id}`,
                method: "PATCH",
                body: materials
            }),
            invalidatesTags: ['Materials']
        })
    })
});


export const {
    useGetMaterialQuery,
    useGetMaterialByIdQuery,
    useAddMaterialMutation,
    useRemoveMaterialMutation,
    useUpdateMaterialMutation
} = materialsApi;
export const materialsReducer = materialsApi.reducer;
export default materialsApi