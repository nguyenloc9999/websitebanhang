
import { IComment } from '@/interfaces/comment';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';


const commentApi = createApi({
    reducerPath: 'comment',
    tagTypes: ['Comment'],
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
        getComments: builder.query<IComment[], void>({
            query: () => `/comment`,
            providesTags: ['Comment']
        }),
        getCommentByUser: builder.query<IComment[], void>({
            query: (userId) => `/comment?userId=${userId}`,
            providesTags: ['Comment']
        }),
        getCommentById: builder.query<IComment, number | string>({
            query: (id) => `/comment/${id}/detail`,
            providesTags: ['Comment']
        }),
        getCommentByProductId: builder.query<IComment, number | string>({
            query: (productId) => `/comment/${productId}`,
            providesTags: ['Comment']
        }),
        addComment: builder.mutation({
            query: (comment: IComment) => ({
                url: '/comment',
                method: 'POST',
                body: comment
            }),
            invalidatesTags: ['Comment']
        }),
        removeComment: builder.mutation<IComment, any>({
            query: ({ id, userId }) => ({
                url: `/comment/${id}/remove?userId=${userId}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Comment']
        }),
        removeCommentAdmin: builder.mutation<any, any>({
            query: (id) => ({
                url: `/comments/${id}/admin`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Comment']
        }),
        updateComment: builder.mutation({
            query: (comment: IComment) => ({
                url: `/comment/${comment.id}/update`,
                method: 'PATCH',
                body: comment
            }),
            invalidatesTags: ['Comment']
        }),
        updateCommentAdmin: builder.mutation({
            query: (comment: IComment) => ({
                url: `/comments/${comment.id}/admin`,
                method: 'PATCH',
                body: comment
            }),
            invalidatesTags: ['Comment']
        })
    })
});

export const {
    useGetCommentsQuery,
    useGetCommentByIdQuery,
    useGetCommentByProductIdQuery,
    useAddCommentMutation,
    useRemoveCommentAdminMutation,
    useRemoveCommentMutation,
    useUpdateCommentAdminMutation,
    useUpdateCommentMutation,
    useGetCommentByUserQuery
} = commentApi;
export const commentReducer = commentApi.reducer;
export default commentApi