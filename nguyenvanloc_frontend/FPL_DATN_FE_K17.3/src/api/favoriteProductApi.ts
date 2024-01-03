import { IFavorite } from '@/interfaces/favorite';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';


const favoriteApi = createApi({
    reducerPath: 'favorite',
    tagTypes: ['Favorite'],
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
        getFavoriteUser: builder.query<IFavorite[], number | string>({
            query: (userId) => `/favoriteProduct/${userId}`,
            providesTags: ['Favorite']
        }),
        getFavorite: builder.query({
            query: (query) => `/favoriteProduct?userId=${query.userId}&productId=${query.productId}`,
            providesTags: ['Favorite']
        }),
        // 
        addFavorite: builder.mutation({
            query: (body: any) => ({
                url: `/favoriteProduct/${body.userId}`,
                method: 'POST',
                body: body
            }),
            invalidatesTags: ['Favorite']
        }),
        removeFavorite: builder.mutation<IFavorite | any, string>({
            query: (id) => ({
                url: `/favoriteProduct/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Favorite']
        }),

    })
});

export const {
    useGetFavoriteUserQuery,
    useGetFavoriteQuery,
    useAddFavoriteMutation,
    useRemoveFavoriteMutation
} = favoriteApi;
export const favoriteReducer = favoriteApi.reducer;
export default favoriteApi