import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { PostItemResponse } from "../types/Post.type";

const baseQuery = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_API_URL + "/api/admin/posts",
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

export const postAPI = createApi({
  reducerPath: "postAPI",
  baseQuery,
  tagTypes: ["Post"],
  endpoints: (builder) => ({
    getPosts: builder.query<PostItemResponse[], void>({
      query: () => "",
      providesTags: ["Post"],
    }),
    deletePost: builder.mutation<void, number>({
      query: (id) => ({
        url: `/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Post"],
    }),

    getPostById: builder.query<PostItemResponse, number>({
      query: (id) => `/${id}`,
      providesTags: ["Post"],
    }),

    updatePost: builder.mutation<
      PostItemResponse,
      { id: number; status: string }
    >({
      query: ({ id, status }) => ({
        url: `/${id}/status`,
        method: "POST",
        body: { status },
      }),
      invalidatesTags: ["Post"],
    }),
    // createPost: builder.mutation<PostItemResponse, Partial<PostItemResponse>>({
    //   query: (body) => ({
    //     url: `/`,
    //     method: "POST",
    //     body,
    //   }),
    //   invalidatesTags: ["Post"],
    // }),
  }),
});

export const {
  useGetPostsQuery,
  useDeletePostMutation,
  useGetPostByIdQuery,
  useUpdatePostMutation,
  // useCreatePostMutation,
} = postAPI;
