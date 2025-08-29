import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { UserType } from "../types/User.type";

// Wrapper baseQuery tự động refresh token khi gặp lỗi 401
const baseQuery = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_API_URL + "/api/admin/users",
  prepareHeaders: (headers) => {
    const authData = localStorage.getItem("adminAuth");
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

async function refreshAccessToken() {
  try {
    const res = await fetch(
      import.meta.env.VITE_API_URL + "/api/auth/refresh-token",
      {
        method: "POST",
        credentials: "include",
      }
    );
    if (!res.ok) throw new Error("Refresh token failed");
    const data = await res.json();
    if (data?.token) {
      localStorage.setItem("adminAuth", JSON.stringify({ token: data.token }));
      return data.token;
    }
    throw new Error("No token in refresh response");
  } catch (err) {
    localStorage.removeItem("adminAuth");
    return null;
  }
}

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

    deleteUser: builder.mutation<void, number>({
      query: (id) => ({
        url: `/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["User"],
    }),

    updateUser: builder.mutation<
      UserType,
      { id: number; enabled: boolean }
    >({
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
  }),
});

export const {
  useGetUsersQuery,
  useDeleteUserMutation,
  useUpdateUserMutation,
  useCreateUserMutation,
} = userAPI;
