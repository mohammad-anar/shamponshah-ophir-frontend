/* eslint-disable @typescript-eslint/no-explicit-any */
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type {
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
} from "@reduxjs/toolkit/query";
import { RootState } from "../store";
import { logout, setAccessToken } from "../features/auth";

const baseQuery = fetchBaseQuery({
  baseUrl: process.env.NEXT_PUBLIC_API_URL || "http://localhost:4005/api/v1",
  prepareHeaders: (headers, { getState }) => {
    let token = (getState() as RootState).auth?.accessToken;
    if (!token && typeof document !== "undefined") {
      const match = document.cookie.match(new RegExp("(?:^|; )accessToken=([^;]*)"));
      if (match) token = decodeURIComponent(match[1]);
    }
    if (token) {
      const cleanToken = token.startsWith("Bearer ") ? token : `Bearer ${token}`;
      headers.set("Authorization", cleanToken);
    }
    return headers;
  },
  credentials: "include",
});

const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);

  if (result.error && result.error.status === 401) {
    const refreshToken = (api.getState() as RootState).auth?.refreshToken;
    if (refreshToken) {
      const refreshResult = await baseQuery(
        {
          url: "/auth/refresh",
          method: "POST",
          body: { refreshToken },
        },
        api,
        extraOptions
      );

      if (refreshResult.data) {
        const newAccessToken = (refreshResult.data as any).accessToken;
        api.dispatch(setAccessToken(newAccessToken));
        result = await baseQuery(args, api, extraOptions);
      } else {
        api.dispatch(logout());
      }
    } else {
      api.dispatch(logout());
    }
  }

  return result;
};

export const baseApi = createApi({
  reducerPath: "baseApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: [
    "auth",
    "vendors",
    "categories",
    "gigs",
    "jobs",
    "offers",
    "orders",
    "payments",
    "events",
    "family-hub",
    "reviews",
    "messages",
    "notifications",
    "admin",
  ],
  endpoints: () => ({}),
});

export default baseApi;
