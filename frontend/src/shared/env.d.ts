/// <reference types="vite/client" />
/// <reference types="vite-plugin-svgr/client" />
declare module "virtual:pwa-register";
declare module "virtual:pwa-register/react";

interface ImportMetaEnv {
  readonly VITE_FRONTEND_PORT: string;
  readonly VITE_BASE_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
