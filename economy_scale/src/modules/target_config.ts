const target_tauri = false;

export const api_proxy_addr = "http://localhost:8080";
export const img_proxy_addr = "http://localhost:9000";
export const dest_api = target_tauri ? api_proxy_addr : "/api";
export const dest_root = target_tauri ? "" : "/DIA-Frontend";
export const dest_img = target_tauri ? img_proxy_addr : "/costimages";
