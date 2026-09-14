import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Amaan's Bakery — Vite config.
// base matches the GitHub Pages project URL (/Amaans-Bakery/) so built assets
// resolve when the site is hosted there.
// Dev server binds to 0.0.0.0 so the Arena live-preview proxy can reach it,
// and allows any host so the proxied preview origin is accepted.
export default defineConfig({
  base: "/Amaans-Bakery/",
  plugins: [react()],
  server: {
    host: "0.0.0.0",
    allowedHosts: true,
  },
  preview: {
    host: "0.0.0.0",
    allowedHosts: true,
  },
});
