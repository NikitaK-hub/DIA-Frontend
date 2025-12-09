export const ROUTES = {
  HOME: "/",
  COSTS: "/costs",
  COST: "/costs/:id",
  LOGIN: "/login",
  REGISTER: "/register",
  COSTREQUEST: "/cost_request/:requestId",
  PROFILE: "/profile",
};

export type RouteKeyType = keyof typeof ROUTES;

export const ROUTE_LABELS: { [key in RouteKeyType]: string } = {
  HOME: "Главная",
  COSTS: "Издкржки",
  COST: "Издержка",
  LOGIN: "Авторизация",
  REGISTER: "Регистрация",
  COSTREQUEST: "Заявка",
  PROFILE: "Профиль",
};