import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { Costs } from "../modules/ratioAPI";
import { fetchCosts, searchCosts } from "./costsThunks";

interface CostsFilterState {
  searchValue: string;
  loading: boolean;
  costs: Costs[];
  error: string | null;
  loadedFromStorage: boolean;
}

const loadStateFromStorage = (): CostsFilterState => {
  try {
    const serializedState = localStorage.getItem("costsFilterState");
    if (serializedState === null) {
      return {
        searchValue: "",
        loading: false,
        costs: [],
        error: null,
        loadedFromStorage: false,
      };
    }
    const state = JSON.parse(serializedState);
    state.loadedFromStorage =
      state.loadedFromStorage !== undefined ? state.loadedFromStorage : true;
    return state;
  } catch (err) {
    console.error("Error loading state from localStorage:", err);
    return {
      searchValue: "",
      loading: false,
      costs: [],
      error: null,
      loadedFromStorage: false,
    };
  }
};

const saveStateToStorage = (state: CostsFilterState) => {
  try {
    const serializedState = JSON.stringify(state);
    localStorage.setItem("costsFilterState", serializedState);
  } catch (err) {
    console.error("Error saving state to localStorage:", err);
  }
};

const initialState: CostsFilterState = loadStateFromStorage();

export const costsSlice = createSlice({
  name: "costsFilter",
  initialState,
  reducers: {
    setSearchValue: (state, action: PayloadAction<string>) => {
      state.searchValue = action.payload;
      state.loadedFromStorage = true;
      saveStateToStorage(state);
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
      state.loadedFromStorage = true;
      saveStateToStorage(state);
    },
    setCosts: (state, action: PayloadAction<Costs[]>) => {
      state.costs = action.payload;
      state.loadedFromStorage = true;
      saveStateToStorage(state);
    },
    resetFilter: (state) => {
      state.searchValue = "";
      state.costs = [];
      state.error = null;
      state.loadedFromStorage = false;
      saveStateToStorage(state);
    },
    clearError: (state) => {
      state.error = null;
      state.loadedFromStorage = true;
      saveStateToStorage(state);
    },
    clearPersistedState: () => {
      localStorage.removeItem("costsFilterState");
      return {
        searchValue: "",
        loading: false,
        costs: [],
        error: null,
        loadedFromStorage: false,
      };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCosts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCosts.fulfilled, (state, action) => {
        state.loading = false;
        state.costs = action.payload;
        state.loadedFromStorage = true;
        saveStateToStorage(state);
      })
      .addCase(fetchCosts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.costs = [];
        state.loadedFromStorage = true;
        saveStateToStorage(state);
      })
      .addCase(searchCosts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(searchCosts.fulfilled, (state, action) => {
        state.loading = false;
        state.costs = action.payload;
        state.loadedFromStorage = true;
        saveStateToStorage(state);
      })
      .addCase(searchCosts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.costs = [];
        saveStateToStorage(state);
      });
  },
});

export const {
  setSearchValue,
  setLoading,
  setCosts,
  resetFilter,
  clearError,
  clearPersistedState,
} = costsSlice.actions;

export default costsSlice.reducer;
