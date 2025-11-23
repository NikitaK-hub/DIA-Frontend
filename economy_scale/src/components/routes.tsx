export const ROUTES = {
  HOME: "/",
  STAGES: "/costs",
  STAGE: "/costs/:id",
};

export type RouteKeyType = keyof typeof ROUTES;

export const ROUTE_LABELS: { [key in RouteKeyType]: string } = {
  HOME: "Главная",
  STAGES: "Издкржки",
  STAGE: "Издержка",
};