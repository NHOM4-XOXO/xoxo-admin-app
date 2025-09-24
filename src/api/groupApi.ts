import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { GroupItemResponse, GroupStatus } from "../types/Group.type";
import { refreshAccessToken } from "./refreshTokenHelper";

const baseQuery = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_API_URL + "/api/admin/groups",
  prepareHeaders: (headers) => {
    const authData = sessionStorage.getItem("adminAuth");
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

export const groupApi = createApi({
  reducerPath: "group",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["Group"],
  endpoints: (builder) => ({
    getGroups: builder.query<GroupItemResponse[], void>({
      query: () => "",
      transformResponse: (response: {
        statusCode: string;
        message: string;
        data: GroupItemResponse[];
      }) => response.data,
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: "Group" as const, id })),
              { type: "Group", id: "LIST" },
            ]
          : [{ type: "Group", id: "LIST" }],
    }),
    deleteGroup: builder.mutation<void, number>({
      query: (id) => ({
        url: `/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Group"],
    }),

    updateGroupStatus: builder.mutation<
      GroupItemResponse,
      { groupId: number; status: GroupStatus }
    >({
      query: ({ groupId, status }) => ({
        url: `/${groupId}/status`,
        method: "PATCH",
        body: { status },
      }),
      invalidatesTags: (_, __, { groupId }) => [{ type: "Group", id: groupId }],
    }),
    getGroupAnalytics: builder.query<any, number>({
      query: (groupId) => `/${groupId}/analytics`,
    }),
  }),
});

export const {
  useGetGroupsQuery,
  useDeleteGroupMutation,
  useUpdateGroupStatusMutation,
  useGetGroupAnalyticsQuery,
} = groupApi;
