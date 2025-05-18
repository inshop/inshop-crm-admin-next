import { configureStore } from '@reduxjs/toolkit'
import {api} from "@/lib/redux/api";
// import {setupListeners} from "@reduxjs/toolkit/query";

export const makeStore = () => {
  return configureStore({
    reducer: {
      [api.reducerPath]: api.reducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        immutableCheck: false,
        serializableCheck: false,
      }).concat(api.middleware)
  })
}

// setupListeners(makeStore().dispatch)

export type AppStore = ReturnType<typeof makeStore>
export type RootState = ReturnType<AppStore['getState']>
export type AppDispatch = AppStore['dispatch']
