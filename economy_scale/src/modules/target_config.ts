const target: "local" | "ghpages" | "tauri" = "local";
// const target: "local" | "ghpages" | "tauri" = "tauri";
// const target: "local" | "ghpages" | "tauri" = "ghpages";
export const api_addr = "http://localhost:8080";
// export const api_addr = "https://192.168.56.1:3000/api";

export const dest_api = {
  local: "/api",
  ghpages: api_addr,
  tauri: api_addr,
}[target];
export const dest_root = { local: "", ghpages: "/DIA-Frontend", tauri: "" }[
  target
];
