import { createSlice, type PayloadAction } from "@reduxjs/toolkit"
import {useAppSelector} from "@/lib/redux/hooks";
import {ClientListDetailsType} from "@/dto/clients";

interface InitialStateType {
  list: ClientListDetailsType[]
}

const initialState: InitialStateType = {
  list: [],
}

const clientsSlice = createSlice({
  name: "favorites",
  initialState,
  reducers: {
    getList: (state, action: PayloadAction<ClientListDetailsType[]>) => {}
  },
})

export const useFavoriteProduct = () =>
  useAppSelector((state) => state.clients)

export const { getList } = clientsSlice.actions
export default clientsSlice.reducer
