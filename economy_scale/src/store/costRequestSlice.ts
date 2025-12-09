import { api } from "../modules/ratioAPI";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface Costs {
  price?: number;
  image_url?: string;
  cost_title?: string;
  cost_id?: number;
}

export interface CostRequestInfo {
  created_at?: string | null;
}

export interface CostRequestBundle {
  requestId?: number;
  count?: number;
  costs: Costs[];
  requestInfo?: CostRequestInfo;
  isDraft: boolean;
  error?: string | null;
}

const initialState: CostRequestBundle = {
  requestId: NaN,
  count: NaN,
  costs: [],
  requestInfo: {
    created_at: null,
  },
  isDraft: false,
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

export const updateCostRequest = createAsyncThunk(
  "costRequest/updateCostRequest",
  async ({
    requestId,
    requestInfo,
  }: {
    requestId: number;
    requestInfo: CostRequestInfo;
  }) => {
    const requestParamsToSend = {
      product_name: requestInfo.productName || undefined,
    };
    const response = await api.costRequests.costRequestsUpdate(
      requestId,
      requestParamsToSend,
    );
    return response.data;
  },
);

export const updateCostInRequestAsync = createAsyncThunk(
  "costRequest/updateCostInRequestAsync",
  async ({
    requestId,
    costId,
    inputField1,
    inputField2,
  }: {
    requestId: number;
    costId: number;
    inputField1?: number;
    inputField2?: number;
  }) => {
    const updateData: {
      input_field_1?: number;
      input_field_2?: number;
    } = {};

    if (inputField1 !== undefined) {
      updateData.input_field_1 = inputField1;
    }

    if (inputField2 !== undefined) {
      updateData.input_field_2 = inputField2;
    }

    const response = await api.costRequestCosts.costsUpdate(
      requestId,
      costId,
      updateData,
    );
    return response.data;
  },
);

export const updateCostInCostRequest = createAsyncThunk(
  "costRequest/updateCostInCostRequest",
  async ({
    requestId,
    costId,
    cost,
  }: {
    requestId: number;
    costId: number;
    cost: Costs;
  }) => {
    const requestParamsToSend = {
      input_field_1: cost.input_field_1 || undefined,
      input_field_2: cost.input_field_2 || undefined,
    };
    const response = await api.costRequestCosts.costsUpdate(
      requestId,
      costId,
      requestParamsToSend,
    );
    return response.data;
  },
);

export const deleteCostRequest = createAsyncThunk(
  "costRequest/deleteCostRequest",
  async (requestId: number) => {
    const response = await api.costRequests.costRequestsDelete(requestId);
    return response.data;
  },
);

export const deleteCostFromRequest = createAsyncThunk(
  "costRequest/deleteCostFromRequest",
  async ({ requestId, costId }: { requestId: number; costId: number }) => {
    await api.costRequestCosts.costsDelete(requestId, costId);
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
