import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import { dashboardApi } from "../api/dashboardApi";
import { postAPI } from "../api/postAPI";
import { userAPI } from "../api/userApi";
import { reportApi } from "../api/reportApi";

export const store = configureStore({
  reducer: {
    // Add the generated reducer as a specific top-level slice
    [dashboardApi.reducerPath]: dashboardApi.reducer,
    [postAPI.reducerPath]: postAPI.reducer,
    [userAPI.reducerPath]: userAPI.reducer,
    [reportApi.reducerPath]: reportApi.reducer,
  },
  // Adding the api middleware enables caching, invalidation, polling,
  // and other useful features of `rtk-query`.
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(dashboardApi.middleware)
      .concat(postAPI.middleware)
      .concat(userAPI.middleware)
      .concat(reportApi.middleware),
});

// optional, but required for refetchOnFocus/refetchOnReconnect behaviors
// see `setupListeners` docs - takes an optional callback as the 2nd arg for customization
setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
