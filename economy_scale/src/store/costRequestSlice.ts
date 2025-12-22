// store/costRequestSlice.ts
import { api } from "../modules/ratioAPI";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface Costs {
  cost_id: number;
  cost_price: number;
  cost_title: string;
  img?: string;
  image_url?: string;
  type_change?: boolean;
}

export interface CostRequestInfo {
  min_volume?: number;
  max_volume?: number;
  createdAt?: string;
  closedAt?: string;
  formedAt?: string;
  calculationResult?: number;
  status?: number;
  ratio?: number;
}

export interface CostRequestBundle {
  requestId?: number;
  count?: number;
  costs: Costs[];
  requestInfo?: CostRequestInfo;
  isDraft: boolean;
  loading?: boolean;
  error?: string | null;
}

const initialState: CostRequestBundle = {
  requestId: undefined,
  count: 0,
  costs: [],
  requestInfo: {
    min_volume: undefined,
    max_volume: undefined,
    createdAt: undefined,
  },
  isDraft: false,
  loading: false,
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
      Min_volume: requestInfo.min_volume,
      Max_volume: requestInfo.max_volume,
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
    costPrice,
  }: {
    requestId: number;
    costId: number;
    costPrice: number | undefined;
  }) => {
    const updateData: {
      cost_price?: number;
    } = {};

    if (costPrice !== undefined) {
      updateData.cost_price = costPrice;
    }

    const response = await api.costRequestCosts.costsUpdate(
      requestId,
      costId,
      updateData,
    );
    return response.data;
  },
);

export const formCostRequestAsync = createAsyncThunk(
  "CostRequest/formCostRequestAsync",
  async (requestId: number) => {
    const response = await api.costRequests.formUpdate(requestId);
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
      cost_price: cost.cost_price || undefined,
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
    return { requestId, costId };
  },
);

const costRequestSlice = createSlice({
  name: "costRequest",
  initialState,
  reducers: {
    setRequestData: (
      state,
      action: PayloadAction<Partial<CostRequestInfo>>,
    ) => {
      state.requestInfo = {
        ...state.requestInfo,
        ...action.payload,
      };
    },
    setCostData: (
      state,
      action: PayloadAction<{
        costId: number;
        field: "cost_price";
        value: number;
      }>,
    ) => {
      const { costId, field, value } = action.payload;
      const costIndex = state.costs.findIndex(
        (cost) => cost.cost_id === costId,
      );
      if (costIndex !== -1) {
        state.costs[costIndex] = {
          ...state.costs[costIndex],
          [field]: value,
        };
      }
    },
    updateCostPrice: (
      state,
      action: PayloadAction<{ costId: number; costPrice: number }>
    ) => {
      const { costId, costPrice } = action.payload;
      const costIndex = state.costs.findIndex(
        (cost) => cost.cost_id === costId,
      );
      if (costIndex !== -1) {
        state.costs[costIndex].cost_price = costPrice;
      }
    },
    setCosts: (state, action: PayloadAction<Costs[]>) => {
      state.costs = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getCostRequest.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getCostRequest.fulfilled, (state, action) => {
        const {
          price_request_to_costs,
          Min_volume,
          Max_volume,
          Ratio,
          id,
          created_at,
          status,
        } = action.payload;
        
        console.log('getCostRequest.fulfilled:', action.payload);
        
        if (price_request_to_costs && id) {
          state.requestId = id;
          state.requestInfo = {
            createdAt: created_at,
            max_volume: Max_volume,
            min_volume: Min_volume,
            ratio: Ratio,
            status: status,
          };
          
          // Преобразуем данные из API в формат Costs
          state.costs = price_request_to_costs.map((item: any) => {
            console.log('Processing cost item:', item);
            
            return {
              cost_id: item.cost_id || item.ID_cost,
              cost_price: item.cost_price || 0,
              cost_title: item.cost_title || '',
              img: item.img || '',
              image_url: item.img || item.image_url || '',
              type_change: item.type_change || false,
            };
          });
          
          state.isDraft = status === 1;
          state.count = price_request_to_costs.length;
        } else {
          // Если нет данных, устанавливаем пустой массив
          state.costs = [];
          state.count = 0;
        }
        state.loading = false;
      })
      .addCase(getCostRequest.rejected, (state, action) => {
        state.loading = false;
        state.error = `Не удалось загрузить заявку: ${action.error.message}`;
        state.costs = [];
        state.count = 0;
      })
      .addCase(deleteCostRequest.fulfilled, (state) => {
        state.requestId = undefined;
        state.count = 0;
        state.costs = [];
        state.isDraft = false;
        state.requestInfo = {
          max_volume: undefined,
          min_volume: undefined,
          createdAt: undefined,
        };
      })
      .addCase(updateCostRequest.fulfilled, (state, action) => {
        // Обновляем requestInfo данными с сервера
        if (action.payload) {
          state.requestInfo = {
            ...state.requestInfo,
            ...action.payload,
          };
        }
      })
      .addCase(updateCostInCostRequest.fulfilled, () => {
        // Можно обновить состояние при необходимости
      })
      .addCase(updateCostInRequestAsync.fulfilled, () => {
        // Обновление успешно, можно обновить состояние при необходимости
      })
      .addCase(formCostRequestAsync.pending, (state) => {
        state.error = undefined;
        state.loading = true;
      })
      .addCase(formCostRequestAsync.fulfilled, (state) => {
        state.isDraft = false;
        state.error = undefined;
        state.loading = false;
      })
      .addCase(formCostRequestAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = `Не удалось сформировать заявку: ${action.error.message}`;
      })
      .addCase(deleteCostFromRequest.fulfilled, (state, action) => {
        const { costId } = action.payload;
        state.costs = state.costs.filter((cost) => cost.cost_id !== costId);
        state.count = state.costs.length;
      })
      .addCase(deleteCostRequest.rejected, (state, action) => {
        state.error = `Не удалось удалить заявку: ${action.error.message}`;
      })
      .addCase(updateCostRequest.rejected, (state, action) => {
        state.error = `Не удалось обновить заявку: ${action.error.message}`;
      })
      .addCase(updateCostInCostRequest.rejected, (state, action) => {
        state.error = `Не удалось обновить издержку в заявке: ${action.error.message}`;
      })
      .addCase(updateCostInRequestAsync.rejected, (state, action) => {
        state.error = `Не удалось обновить стоимость издержки: ${action.error.message}`;
      });
  },
});

export const { 
  setRequestData, 
  setCosts, 
  setCostData, 
  updateCostPrice,
  setLoading,
  clearError 
} = costRequestSlice.actions;
export default costRequestSlice.reducer;