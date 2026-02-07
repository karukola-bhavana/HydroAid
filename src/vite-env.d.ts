/// <reference types="vite/client" />
declare module 'framer-motion';

interface ImportMetaEnv {
  readonly VITE_GOOGLE_MAPS_API_KEY: string
  // more env variables...
}

interface ImportMeta {
  readonly env: ImportMetaEnv
} 