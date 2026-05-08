import path from "path";
// import { defineConfig } from "vite";
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import tsconfigPaths from "vite-tsconfig-paths";
import svgr from "vite-plugin-svgr";
import dotenv from "dotenv";
import { VitePWA } from "vite-plugin-pwa";

dotenv.config();

export default defineConfig({
  plugins: [
    tsconfigPaths(),
    react(),
    svgr(),
    tailwindcss(),
    VitePWA({
      injectRegister: process.env.NODE_ENV === "production" ? "auto" : null,
      registerType:
        process.env.NODE_ENV === "production" ? "autoUpdate" : "prompt",
      manifest: {
        name: "BrightCRM App",
        short_name: "BrightCRM",
        start_url: "/",
        display: "standalone",
        background_color: "#fff",
        theme_color: "#fff",
        lang: "ru",
        scope: "/",
        icons: [
          {
            src: "/logo.svg",
            sizes: "any",
            type: "image/svg+xml",
            purpose: "any",
          },
        ],
      },
      workbox: {
        cleanupOutdatedCaches: true,
        globPatterns: ["**/*.{js,css,html}"],
        globIgnores: ["**/manifest.webmanifest"],

        navigateFallback: "/index.html",
        navigateFallbackDenylist: [
          /^\/manifest.webmanifest$/,
          /^\/.*\.(?:png|jpg|jpeg|webp|svg|webmanifest|json|xml|ico|map|ttf|woff|woff2)$/,
          //   jpg|jpeg|gif|png|svg|js|css|mp3|ogg|mpe?g|avi|zip|gz|bz2?|rar|swf|webp|ttf|woff|woff2|webmanifest
        ],

        runtimeCaching: [
          {
            urlPattern: ({ url }) => url.pathname === "/manifest.webmanifest",
            handler: "NetworkOnly",
          },
        ],
      },

      devOptions: {
        enabled: false,
      },
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },

  preview: { port: Number(process.env.VITE_PORT) || 3000 },
  server: {
    port: Number(process.env.VITE_PORT) || 3000,
    fs: {
      strict: false,
    },
  },

  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: "./src/test/setup.tsx",
    include: ["src/**/*.{test,spec}.{ts,tsx}"],
    reporters: [
      "default",
      ["junit", { outputFile: "./test-reports/report.xml" }],
    ],
  },
});
