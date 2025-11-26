import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { Costs } from "../modules/ratioAPI";

interface CostsFilterState {
  searchValue: string;
  costs: Costs[];
}

export const costsSlice = createSlice({
  name: "costsFilter",
  initialState: {
    searchValue: "",
    costs: [],
  } as CostsFilterState,
  reducers: {
    setSearchValue: (state, action: PayloadAction<string>) => {
      state.searchValue = action.payload;
    },
    setCosts: (state, action: PayloadAction<Costs[]>) => {
      state.costs = action.payload;
    },
  },
});

export const {
  setSearchValue,
  setCosts,
} = costsSlice.actions;

export default costsSlice.reducer;
