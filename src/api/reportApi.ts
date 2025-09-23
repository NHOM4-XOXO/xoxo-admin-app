import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { ReportItemResponse } from "../types/Report.type";
import { refreshAccessToken } from "./refreshTokenHelper";

const baseQuery = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_API_URL + "/api/admin/reports",
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

export const reportApi = createApi({
  reducerPath: "report",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["Report"],
  keepUnusedDataFor: 60, // Keep data for 60 seconds
  refetchOnMountOrArgChange: false, // Don't refetch on mount
  refetchOnFocus: false, // Don't refetch on window focus
  refetchOnReconnect: false, // Don't refetch on reconnect
  endpoints: (builder) => ({
    getReports: builder.query<ReportItemResponse[], void>({
      query: () => "",
      transformResponse: (response: {
        statusCode: string;
        message: string;
        data: ReportItemResponse[];
      }) => response.data,
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: "Report" as const, id })),
              { type: "Report", id: "LIST" },
            ]
          : [{ type: "Report", id: "LIST" }],
    }),

    
    deleteReport: builder.mutation<void, number>({
      query: (id) => ({
        url: `/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "Report", id: "LIST" }],
    }),

    updateReport: builder.mutation<
      ReportItemResponse,
      Partial<ReportItemResponse> & Pick<ReportItemResponse, "id">
    >({
      query: ({ id, ...patch }) => ({
        url: `/${id}/review`,
        method: "PATCH",
        body: patch,
      }),
      invalidatesTags: (_, __, { id }) => [{ type: "Report", id }],
    }),
  }),
});

// Export hooks for usage in functional components
export const {
  useGetReportsQuery,
  useUpdateReportMutation,
  useDeleteReportMutation,
} = reportApi;
