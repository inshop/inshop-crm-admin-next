import { configureStore } from '@reduxjs/toolkit'
import clientsSlice from "@/lib/redux/features/clientsSlice";

export const makeStore = () => {
  return configureStore({
    reducer: {
      clients: clientsSlice,
    }
  })
}

export type AppStore = ReturnType<typeof makeStore>
export type RootState = ReturnType<AppStore['getState']>
export type AppDispatch = AppStore['dispatch']
