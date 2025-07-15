import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { Activity, ChartData, Stats, TopPost } from "../types/Dashboard.type";

export const dashboardApi = createApi({
  reducerPath: "dashboard",
  baseQuery: fetchBaseQuery({
    baseUrl: "/api", // Use proxy instead of direct localhost:3001
  }),
  tagTypes: ["Stats", "Activities", "TopPosts", "ChartData"],
  keepUnusedDataFor: 60, // Keep data for 60 seconds
  refetchOnMountOrArgChange: false, // Don't refetch on mount
  refetchOnFocus: false, // Don't refetch on window focus
  refetchOnReconnect: false, // Don't refetch on reconnect
  endpoints: (builder) => ({
    getStats: builder.query<Stats, void>({
      query: () => "/stats",
      providesTags: ["Stats"],
    }),
    // Real-time updates
    refreshStats: builder.mutation<Stats, void>({
      query: () => ({
        url: "/stats",
        method: "GET",
      }),
      invalidatesTags: ["Stats"],
    }),
    getActivities: builder.query<Activity[], void>({
      query: () => "/activities",
      providesTags: ["Activities"],
    }),
    getTopPosts: builder.query<TopPost[], void>({
      query: () => "/topPosts",
      providesTags: ["TopPosts"],
    }),
    getChartData: builder.query<ChartData, void>({
      query: () => "/chartData",
      providesTags: ["ChartData"],
    }),
  }),
});

export const {
  useGetStatsQuery,
  useGetActivitiesQuery,
  useGetTopPostsQuery,
  useGetChartDataQuery,
  useRefreshStatsMutation,
} = dashboardApi;
