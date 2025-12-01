import { api } from "../modules/ratioAPI";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

interface Costs {
  price?: number;
  image_url?: string;
  cost_title?: string;
  cost_id?: number;
}

interface CostRequestInfo {
  created_at?: string | null;
}

interface CostRequestBundle {
  requestId?: number;
  count?: number;
  costs: Costs[];
  requestInfo?: CostRequestInfo;
  error?: string | null;
}

const initialState: CostRequestBundle = {
  requestId: NaN,
  count: NaN,
  costs: [],
  requestInfo: {
    created_at: null,
  },
  error: null,
};

export const getCostRequest = createAsyncThunk(
  "costRequest/getCostRequest",
  async (requestId: number) => {
    const response = await api.costRequests.costRequestsDetail(requestId);
    return response.data;
  },
);

export const addCostToRequest = createAsyncThunk(
  "costRequest/addCostToCostRequest",
  async (costId: number) => {
    const response = await api.costs.addToRequestCreate(costId);
    return response.data;
  },
);

export const fetchCostRequestInfo = createAsyncThunk(
  "costRequest/fetchCostRequestInfo",
  async () => {
    const response = await api.costRequests.costRequestInfoList();
    return response.data;
  },
);

const costRequestSlice = createSlice({
  name: "costRequest",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getCostRequest.fulfilled, (state, action) => {
        const { price_request_to_costs, id, created_at } =
          action.payload;
        if (price_request_to_costs && id) {
          state.requestId = id;
          state.requestInfo = {
            created_at: created_at,
          };
          state.costs = price_request_to_costs;
        }
      })
      .addCase(getCostRequest.rejected, (state) => {
        state.error = "Failed to fetch cost request";
      });
  },
});

export default costRequestSlice.reducer;
