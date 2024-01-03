import { IResetPassword, IUser } from '@/interfaces/auth';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const userApi = createApi({
    reducerPath: 'users',
    tagTypes: ['User'],
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
        getUsers: builder.query<IUser[], void>({
            query: () => '/users',
            providesTags: ['User']
        }),
        getUserById: builder.query<IUser, number>({
            query: (id) => `/users/${id}`,
            providesTags: ['User']
        }),

        //Quên mật khẩu
        forgotPassword: builder.mutation({
            query: (user: IUser) => ({
                url: '/forgotpassword',
                method: 'POST',
                body: user
            }),
            invalidatesTags: ['User']
        }),
        // VerifyOTP Quên Mật khẩu
        verifyOTPResetPassword: builder.mutation({
            query: (user: IUser) => ({
                url: '/verifyOTPResetPassword',
                method: 'POST',
                body: user
            }),
            invalidatesTags: ['User']
        }),
        // Đặt lại mật khẩu
        resetPassword: builder.mutation({
            query: (user: IResetPassword) => ({
                url: `/resetpassword`,
                method: 'PATCH',
                body: user
            }),
            invalidatesTags: ['User']
        }),
        // VerifyOTP
        verifyOTP: builder.mutation({
            query: (user: IUser) => ({
                url: '/verifyOTP',
                method: 'POST',
                body: user
            }),
            invalidatesTags: ['User']
        }),
        // Thay đổi mật khẩu
        changePassword: builder.mutation({
            query: (user: IUser) => ({
                url: '/changepassword',
                method: 'PATCH',
                body: user
            }),
            invalidatesTags: ['User']
        }),
        // ResendOTP
        resendNewOTP: builder.mutation({
            query: (user: IUser) => ({
                url: '/sendnewOTP',
                method: 'POST',
                body: user
            }),
            invalidatesTags: ['User']
        }),
        // Resend Forgot Password OTP
        resendNewForgotOTP: builder.mutation({
            query: (user: IUser) => ({
                url: '/sendNewForgotOTP',
                method: 'POST',
                body: user
            }),
            invalidatesTags: ['User']
        }),
        // Đăng nhập
        signIn: builder.mutation({
            query: (user: IUser) => ({
                url: '/signin',
                method: 'POST',
                body: user
            }),
            invalidatesTags: ['User']
        }),
        // Đăng kí
        signUp: builder.mutation({
            query: (user: IUser) => ({
                url: '/signup',
                method: 'POST',
                body: user
            }),
            invalidatesTags: ['User']
        }),
        removeUser: builder.mutation<IUser, number>({
            query: (id) => ({
                url: `/users/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['User']
        }),
        removeUserByAdmin: builder.mutation<IUser, number>({
            query: (id) => ({
                url: `/user/${id}/admin`,
                method: 'DELETE',
            }),
            invalidatesTags: ['User']
        }),
        updateUser: builder.mutation({
            query: (user: IUser) => ({
                url: `/users/${user._id}`,
                method: 'PATCH',
                body: user
            }),
            invalidatesTags: ['User']
        }),
        updateUserByAdmin: builder.mutation({
            query: (user: IUser) => ({
                url: `/user/${user._id}/admin`,
                method: 'PATCH',
                body: user
            }),
            invalidatesTags: ['User']
        }),

    }),


});

export const {
    useGetUsersQuery,
    useGetUserByIdQuery,
    useVerifyOTPMutation,
    useVerifyOTPResetPasswordMutation,
    useResetPasswordMutation,
    useSignInMutation,
    useSignUpMutation,
    useRemoveUserMutation,
    useUpdateUserMutation,
    useRemoveUserByAdminMutation,
    useUpdateUserByAdminMutation,
    useForgotPasswordMutation,
    useChangePasswordMutation,
    useResendNewOTPMutation,
    useResendNewForgotOTPMutation
} = userApi;
export const userReducer = userApi.reducer;
export default userApi