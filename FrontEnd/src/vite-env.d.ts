/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL: string;
  readonly VITE_APP_SECRET: string;
  readonly VITE_SALT: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
