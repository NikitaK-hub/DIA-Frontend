import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";
import { dest_root, api_addr } from "./src/modules/target_config";
import fs from "fs";
import path from "path";
import mkcert from "vite-plugin-mkcert";

export default defineConfig({
  server: {
    https: {
      key: fs.readFileSync(path.resolve(__dirname, "cert.key")),
      cert: fs.readFileSync(path.resolve(__dirname, "cert.crt")),
    },
    port: 3000,
    proxy: {
      "/api": {
        target: api_addr,
        changeOrigin: true,
        secure: false,
      },
    },
    watch: {
      usePolling: true,
    },
    host: true,
    strictPort: true,
  },
  plugins: [
    react(),
    mkcert(),
    VitePWA({
      registerType: "autoUpdate",
      devOptions: { enabled: true },
      manifest: {
        name: "Economy Scale calculator",
        short_name: "Economy Scale",
        start_url: "/DIA-Frontend/",
        display: "standalone",
        background_color: "#fdfdfd",
        theme_color: "#db4938",
        orientation: "portrait-primary",
        icons: [
          {
            src: "logo192.png",
            type: "image/png",
            sizes: "192x192",
          },
          {
            src: "logo512.png",
            type: "image/png",
            sizes: "512x512",
          },
        ],
        screenshots: [
          {
            src: "stock.jpg",
            sizes: "612x612",
            type: "image/jpeg",
            form_factor: "wide",
            label: "stock",
          },
        ],
      },
    }),
  ],
  base: dest_root,
});
