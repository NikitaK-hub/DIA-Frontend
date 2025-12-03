import { dest_api } from "./target_config";
import { Api } from "../modules/API";

export interface Costs {
  id: number;
  title: string;
  image_url: string;
  info: string;
  type_change: boolean;
}

export interface CostSearchResult {
  costsCount: number;
  results: Costs[];
}

export interface CostRequestInfo {
  request_id: number;
  item_count: number;
}

export interface CostSearchResult {
  results: Costs[];
}

const MOCK_STAGES: Costs[] = [
 {
			id:    1,
			title: "Аренда офиса",
			image_url:   "/DIA-Frontend/stock.jpg",
			info:  "При расчете данной издержки стоит учитывать: стоимость аренды помещения, OPEX (операционные расходы) и т.п.",
			type_change:  true,
		},
		{
			id:    2,
			title: "Амортизация",
			image_url:   "/DIA-Frontend/stock.jpg",
			info:  "При расчете данной издержки стоит учитывать: первоначальную стоимость и срок его полезного использования.",
			type_change:  true,
		},
		{
			id:    3,
			title: "Стоимость ПО",
			image_url:   "/DIA-Frontend/stock.jpg",
			info:  "При расчете данной издержки стоит учитывать: лицензионные платежи, затраты на обновление и техническую поддержку ПО.",
			type_change:  true,
		},
		{
			id:    4,
			title: "Расходные материалы",
			image_url:   "/DIA-Frontend/stock.jpg",
			info:  "При расчете данных издержек стоит учитывать: стоимость закупки материалов и норму расхода на единицу продукции.",
			type_change:  false,
		},
		{
			id:    5,
			title: "Заработная плата",
			image_url:   "/DIA-Frontend/stock.jpg",
			info:  "При расчете данных издержек стоит учитывать: сдельная оплата труда производственных рабочих и премии.",
			type_change:  false,
		},
		{
			id:    6,
			title: "Транспортные расходы",
			image_url:   "/DIA-Frontend/stock.jpg",
			info:  "При расчете данных издержек стоит учитывать: стоимость топлива, плата за доставку, разовые затраты на доставку товара.",
			type_change:  false,
		},
];

export const getCostByName = async (
  costName = "",
): Promise<CostSearchResult> => {
  try {
    const token = localStorage.getItem('access_token'); // Получаем токен
    const headers: HeadersInit = {
      "Content-Type": "application/json",
    };
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
    console.log("Making API request to:", `/api/costs?title=${costName}`);
    const response = await fetch(`/api/costs?title=${costName}`, {
      mode: "cors",
      headers: headers,
    });
    console.log("Response status:", response.status, response.ok);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log("Response data:", data);
    if (Array.isArray(data)) {
      // Ensure all costs have fallback images
      const resultsWithFallback = data.map((cost: Costs) => ({
        ...cost,
        image_url: cost.image_url || "/DIA-Frontend/stock.jpg",
      }));
      return {
        costsCount: resultsWithFallback.length,
        results: resultsWithFallback,
      };
    } else {
      // Ensure all costs have fallback images
      const resultsWithFallback = (data.results || []).map((cost: Costs) => ({
        ...cost,
        image_url: cost.image_url || "/DIA-Frontend/stock.jpg",
      }));
      return {
        costsCount: data.costsCount || 0,
        results: resultsWithFallback,
      };
    }
  } catch (error) {
    console.error("API Error in getCostByName:", error);
    // Возвращаем mock-данные при ошибке
    // Ensure mock costs have fallback images
    const mockCostsWithFallback = MOCK_STAGES.map((cost) => ({
      ...cost,
      image_url: cost.image_url || "/DIA-Frontend/stock.jpg",
    }));
    return {
      costsCount: mockCostsWithFallback.length,
      results: mockCostsWithFallback,
    };
  }
};

export const getCostByID = async (id: number): Promise<Costs | null> => {
  try {
    console.log("Making API request to:", `/api/costs/${id}`);
    const response = await fetch(`/api/costs/${id}`, {
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
      },
    });
    console.log("Response status:", response.status, response.ok);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: Costs = await response.json();
    console.log("Response data:", data);
    // Ensure image_url has fallback
    const costWithFallback = {
      ...data,
      image_url: data.image_url || "/DIA-Frontend/stock.jpg",
    };
    return costWithFallback;
  } catch (error) {
    console.error("API Error in getCostByID:", error);
    const mockCost = MOCK_STAGES.find((cost) => cost.id === id) || null;
    // Ensure mock cost also has fallback image
    if (mockCost) {
      return {
        ...mockCost,
        image_url: mockCost.image_url || "/DIA-Frontend/stock.jpg",
      };
    }
    return mockCost;
  }
};

export const getCostRequestInfo = async (): Promise<CostRequestInfo> => {
  try {
    const response = await api.costRequests.costRequestInfoList();
    console.log("Response data:", response.data);
    return {
      request_id: response.data.request_id || 1,
      item_count: response.data.item_count || 0,
    };
  } catch (error) {
    console.error("API Error in getCostRequestInfo:", error);
    return {
      request_id: 1,
      item_count: 0,
    };
  }
};

const securityWorker = async (securityData: { accessToken: string } | null) => {
  if (securityData?.accessToken) {
    return {
      headers: {
        Authorization: `Bearer ${securityData.accessToken}`,
      },
    };
  }
  return {};
};

export const api = new Api({
  baseURL: dest_api,
  securityWorker,
});

export interface CostRequestInfo {
  request_id: number;
  item_count: number;
}