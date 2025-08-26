import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { Report } from "../types/Report.type";

export const reportApi = createApi({
  reducerPath: "report",
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_URL + "/reports",
  }),

  tagTypes: ["Report"],
  keepUnusedDataFor: 60, // Keep data for 60 seconds
  refetchOnMountOrArgChange: false, // Don't refetch on mount
  refetchOnFocus: false, // Don't refetch on window focus
  refetchOnReconnect: false, // Don't refetch on reconnect
  endpoints: (builder) => ({
    getReports: builder.query<Report[], void>({
      query: () => "/reports",
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: "Report" as const, id })),
              { type: "Report", id: "LIST" },
            ]
          : [{ type: "Report", id: "LIST" }],
    }),
    updateReport: builder.mutation<
      Report,
      Partial<Report> & Pick<Report, "id">
    >({
      query: ({ id, ...patch }) => ({
        url: `/reports/${id}`,
        method: "PATCH",
        body: patch,
      }),
      invalidatesTags: (_, __, { id }) => [{ type: "Report", id }],
    }),
  }),
});

// Export hooks for usage in functional components
export const { useGetReportsQuery, useUpdateReportMutation } = reportApi;
