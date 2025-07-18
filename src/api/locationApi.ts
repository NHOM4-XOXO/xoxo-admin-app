import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { Location } from "./../types/Location.type";

export const locationAPI = createApi({
  reducerPath: "locationApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://provinces.open-api.vn/api/",
  }),
  tagTypes: ["Location"],
  endpoints: (builder) => ({
    getLocations: builder.query<Location[], void>({
      query: () => "p/",
      providesTags: [{ type: "Location", id: "LIST" }],
    }),
  }),
});

export const { useGetLocationsQuery } = locationAPI;
