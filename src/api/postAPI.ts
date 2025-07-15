import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { Post } from "../types/Post.type";

export const postAPI = createApi({
  reducerPath: "post",
  baseQuery: fetchBaseQuery({
    baseUrl: "/api", // Use proxy instead of direct localhost:3001
  }),
  tagTypes: ["Post"],
  keepUnusedDataFor: 60, // Keep data for 60 seconds
  refetchOnMountOrArgChange: false, // Don't refetch on mount
  refetchOnFocus: false, // Don't refetch on window focus
  refetchOnReconnect: false, // Don't refetch on reconnect
  endpoints: (builder) => ({
    getPosts: builder.query<Post[], void>({
      query: () => "/posts",
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: "Post" as const, id })),
              { type: "Post", id: "LIST" },
            ]
          : [{ type: "Post", id: "LIST" }],
    }),
    getPostById: builder.query<Post, number>({
      query: (id) => `/posts/${id}`,
      providesTags: (result, error, id) => [{ type: "Post", id }],
    }),
    updatePost: builder.mutation<Post, Partial<Post> & Pick<Post, "id">>({
      query: ({ id, ...patch }) => ({
        url: `/posts/${id}`,
        method: "PATCH",
        body: patch,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "Post", id }],
    }),
    deletePost: builder.mutation<{ success: boolean }, number>({
      query: (id) => ({
        url: `/posts/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [
        { type: "Post", id },
        { type: "Post", id: "LIST" },
      ],
    }),
    createPost: builder.mutation<Post, Omit<Post, "id">>({
      query: (post) => ({
        url: "/posts",
        method: "POST",
        body: {
          ...post,
          createdAt: new Date().toISOString(),
        },
      }),
      invalidatesTags: [{ type: "Post", id: "LIST" }],
    }),
  }),
});

export const {
  useGetPostsQuery,
  useGetPostByIdQuery,
  useUpdatePostMutation,
  useDeletePostMutation,
  useCreatePostMutation,
} = postAPI;
