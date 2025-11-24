export const ROUTES = {
  HOME: "/",
  COSTS: "/costs",
  COST: "/costs/:id",
};

export type RouteKeyType = keyof typeof ROUTES;

export const ROUTE_LABELS: { [key in RouteKeyType]: string } = {
  HOME: "Главная",
  COSTS: "Издкржки",
  COST: "Издержка",
};