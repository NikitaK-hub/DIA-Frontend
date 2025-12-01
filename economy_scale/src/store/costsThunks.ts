import { createAsyncThunk } from "@reduxjs/toolkit";
import { getCostByName } from "../modules/ratioAPI";

export const fetchCosts = createAsyncThunk(
  "costsFilter/fetchCosts",
  async (searchValue: string = "", { rejectWithValue }) => {
    try {
      const response = await getCostByName(searchValue);
      return response.results || [];
    } catch (error) {
      console.error("Fetch costs error:", error);
      return rejectWithValue("Failed to fetch costs");
    }
  },
);

export const searchCosts = createAsyncThunk(
  "costsFilter/searchCosts",
  async (searchValue: string, { rejectWithValue }) => {
    try {
      const response = await getCostByName(searchValue);
      return response.results || [];
    } catch (error) {
      console.error("Search costs error:", error);
      return rejectWithValue("Failed to search costs");
    }
  },
);
