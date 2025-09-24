import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { UserType } from "../types/User.type";
import { refreshAccessToken } from "./refreshTokenHelper";

// Wrapper baseQuery tự động refresh token khi gặp lỗi 401
const baseQuery = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_API_URL + "/api/admin/users",
  prepareHeaders: (headers) => {
    const localAuth = localStorage.getItem("adminAuth");
    const sessionAuth = sessionStorage.getItem("adminAuth");
    const authData = localAuth || sessionAuth;
    if (authData) {
      const { token } = JSON.parse(authData);
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
    }
    return headers;
  },
  credentials: "include",
});

const baseQueryWithReauth = async (args: any, api: any, extraOptions: any) => {
  let result = await baseQuery(args, api, extraOptions);
  if (result?.error?.status === 401) {
    const newToken = await refreshAccessToken();
    if (newToken) {
      result = await baseQuery(args, api, extraOptions);
    }
  }
  return result;
};

export const userAPI = createApi({
  reducerPath: "userAPI",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["User"],
  endpoints: (builder) => ({
    getUsers: builder.query<UserType[], void>({
      query: () => "",
      providesTags: ["User"],
    }),

    updateUser: builder.mutation<UserType, { id: number; enabled: boolean }>({
      query: ({ id, enabled }) => ({
        url: `/${id}/status`,
        method: "PATCH",
        body: { enabled: enabled },
      }),
      invalidatesTags: ["User"],
    }),

    createUser: builder.mutation<UserType, Partial<UserType>>({
      query: (body) => ({
        url: `/`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["User"],
    }),
    assignUserRole: builder.mutation<any, { userId: number; role: string }>({
      query: ({ userId, role }) => ({
        url: `/../../owner/users/${userId}/roles`,
        method: "POST",
        body: { role },
      }),
      invalidatesTags: ["User"],
    }),
    removeUserRole: builder.mutation<any, { userId: number; role: string }>({
      query: ({ userId, role }) => ({
        url: `${import.meta.env.VITE_API_URL}/api/owner/users/${userId}/roles`,
        method: "DELETE",
        body: { role },
      }),
      invalidatesTags: ["User"],
    }),
    createAdmin: builder.mutation<
      any,
      { email: string; password: string; firstName: string; lastName: string }
    >({
      query: (body) => ({
        url: `${import.meta.env.VITE_API_URL}/api/owner/users/admin`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["User"],
    }),
    forgotPassword: builder.mutation<any, { email: string }>({
      query: (body) => ({
        url: `${import.meta.env.VITE_API_URL}/api/auth/forgot-password`,
        method: "POST",
        body,
      }),
    }),
    resetPassword: builder.mutation<
      any,
      { token: string; newPassword: string }
    >({
      query: (body) => ({
        url: `${import.meta.env.VITE_API_URL}/api/auth/reset-password`,
        method: "POST",
        body,
      }),
    }),
    changePassword: builder.mutation<
      any,
      { oldPassword: string; newPassword: string }
    >({
      query: (body) => ({
        url: `${import.meta.env.VITE_API_URL}/api/auth/change-password`,
        method: "POST",
        body,
      }),
    }),
  }),
});

export const {
  useGetUsersQuery,
  useUpdateUserMutation,
  useCreateUserMutation,
  useAssignUserRoleMutation,
  useRemoveUserRoleMutation,
  useCreateAdminMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
  useChangePasswordMutation,
} = userAPI;
