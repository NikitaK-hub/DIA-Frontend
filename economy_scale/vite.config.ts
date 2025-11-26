import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";
import mkcert from 'vite-plugin-mkcert'
import fs from 'fs';
import path from 'path';
import { dest_root } from './src/modules/target_config';

const vitePWA = VitePWA({
  registerType: "autoUpdate",
  devOptions: {
    enabled: true,
  },
  manifest: {
    name: "Economy scale",
    short_name: "Economy scale",
    start_url: dest_root,
    scope: dest_root,
    display: "standalone",
    background_color: "#fdfdfd",
    theme_color: "#90da54ff",
    orientation: "portrait-primary",
    icons: [
      {
        src: `${dest_root}/public/logo.png`,
        type: "image/png",
        sizes: "any",
      },
      {
        src: `${dest_root}/public/logo.png`,
        type: "image/png",
        sizes: "512x512",
      },
    ],
  },
});

export default defineConfig({
  plugins: [react(), mkcert(), vitePWA,],
  base: dest_root,
  server: {
    https: {
      key: fs.readFileSync(path.resolve(__dirname, 'cert.key')),
      cert: fs.readFileSync(path.resolve(__dirname, 'cert.crt')),
    },
    port: 3000,
    proxy: {
      "/api": {
        target: "http://localhost:8080",
        changeOrigin: true,
        //rewrite: (path) => path.replace(/^\/api/, ""),
        secure: false,
      },
    },
    watch: {
      usePolling: true,
    },
    host: true,
    strictPort: true,
  },
});
