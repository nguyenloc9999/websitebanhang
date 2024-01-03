import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
const passportApi = createApi({
    reducerPath: 'passport',
    tagTypes: ['Passport'],
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
        loginGoogle: builder.query<any, void>({
            query: () => `/auth/google`,
            providesTags: ['Passport']
        }),

        
    })
});

export const {
    useLoginGoogleQuery
} = passportApi
export const passportReducer = passportApi.reducer;
export default passportApi