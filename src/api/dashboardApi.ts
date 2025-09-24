import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { Activity, ChartData, Stats, TopPost } from "../types/Dashboard.type";

export const dashboardApi = createApi({
  reducerPath: "dashboard",
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_URL + "/dashboard",
    prepareHeaders: (headers) => {
      // Lấy token từ localStorage hoặc sessionStorage
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
