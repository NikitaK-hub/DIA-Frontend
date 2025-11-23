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

const MOCK_STAGES: Costs[] = [
 {
			id:    1,
			title: "Аренда офиса",
			image_url:   "/stock.jpg",
			info:  "Аренда офиса относится к постоянным издержкам и не зависит об объема производства. При расчете данной издержки стоит учитывать: стоимость аренды помещения, OPEX (операционные расходы) и т.п. ",
			type_change:  true,
		},
		{
			id:    2,
			title: "Амортизация",
			image_url:   "/stock.jpg",
			info:  "Амортизация относится к постоянным издержкам и не зависит от объема производства. При расчете данной издержки стоит учитывать: первоначальную стоимость основного средства, срок его полезного использования и выбранный метод начисления амортизации.",
			type_change:  true,
		},
		{
			id:    3,
			title: "Стоимость ПО",
			image_url:   "/stock.jpg",
			info:  "Стоимость ПО относится к постоянной издержке и  не зависит от объема производства. При расчете данной издержки стоит учитывать: периодические лицензионные платежи, единовременную стоимость приобретения лицензии, затраты на обновление и техническую поддержку программного обеспечения.",
			type_change:  true,
		},
		{
			id:    4,
			title: "Расходные материалы",
			image_url:   "/stock.jpg",
			info:  "Расходные материалы относятся к переменным издержкам, так как их потребление напрямую зависит от объема производства. При расчете данных издержек стоит учитывать: стоимость закупки материалов, частоту их использования и норму расхода на единицу продукции.",
			type_change:  false,
		},
		{
			id:    5,
			title: "Заработная плата",
			image_url:   "/stock.jpg",
			info:  "Заработная плата относится к переменной издержкой и зависит от объема производства. При расчете данных издержек стоит учитывать: сдельная оплата труда производственных рабочих расценки за единицу продукции, объем выпуска, премии за перевыполнение плана. ",
			type_change:  false,
		},
		{
			id:    6,
			title: "Транспортные расходы",
			image_url:   "/stock.jpg",
			info:  "Транспортные расходы  относится к переменной издержкой и зависит от объема производства. При расчете данных издержек стоит учитывать: стоимость топлива, плата за километраж или тонно-километры при использовании сторонних перевозчиков, разовые затраты на доставку товара.",
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
        image_url: cost.image_url || "/stock.jpg",
      }));
      return {
        costsCount: resultsWithFallback.length,
        results: resultsWithFallback,
      };
    } else {
      // Ensure all costs have fallback images
      const resultsWithFallback = (data.results || []).map((cost: Costs) => ({
        ...cost,
        image_url: cost.image_url || "/stock.jpg",
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
      image_url: cost.image_url || "/stock.jpg",
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
      image_url: data.image_url || "/stock.jpg",
    };
    return costWithFallback;
  } catch (error) {
    console.error("API Error in getCostByID:", error);
    const mockCost = MOCK_STAGES.find((cost) => cost.id === id) || null;
    // Ensure mock cost also has fallback image
    if (mockCost) {
      return {
        ...mockCost,
        image_url: mockCost.image_url || "/stock.jpg",
      };
    }
    return mockCost;
  }
};