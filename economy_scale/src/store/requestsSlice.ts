import { api } from "../modules/ratioAPI";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { type HandlerCostsRequestsFilterResponse } from "../modules/Api";

export interface Request {
  requestId: number;
  status: number;
  createdAt?: Date;
  closedAt?: Date;
  formedAt?: Date;
  productName?: string;
  calculationResult?: number;
}

export interface RequestsFilter {
  status?: number;
  dateFrom?: string;
  dateTo?: string;
}

export interface RequestsList {
  requests: Request[];
  count?: number;
  error?: string;
}

const initialState: RequestsList = {
  requests: [],
  count: 0,
};

export const getAllCostRequests = createAsyncThunk(
  "costRequest/getAllCostRequests",
  async (filter?: RequestsFilter) => {
    const response = await api.costRequests.costRequestsList(filter);
    return response.data;
  },
);

const isEmptyDate = (dateStr?: string) =>
  !dateStr || dateStr === "0001-01-01T00:00:00Z";

const requestsSlice = createSlice({
  name: "requests",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAllCostRequests.fulfilled, (state, action) => {
        const requestsData: HandlerCostsRequestsFilterResponse[] =
          action.payload;
        state.requests = requestsData.map((item) => ({
          requestId: item.id ?? 0,
          status: item.Status ?? 0,
          createdAt: isEmptyDate(item.CreatedAt)
            ? undefined
            : new Date(item.CreatedAt || ""),

          closedAt: isEmptyDate(item.ClosedAt)
            ? undefined
            : new Date(item.ClosedAt || ""),

          formedAt: isEmptyDate(item.FormedAt)
            ? undefined
            : new Date(item.FormedAt || ""),
          max_volume: item.Max_volume || undefined,
          min_volume: item.Min_volume || undefined,
          calculationResult: item.ratio || undefined,
        }));
        state.count = requestsData.length;
      })
      .addCase(getAllCostRequests.rejected, (state, action) => {
        state.error = `Failed to fetch cost requests: ${action.error.message}`;
      });
  },
});

export default requestsSlice.reducer;
