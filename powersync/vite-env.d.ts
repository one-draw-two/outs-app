/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_POWERSYNC_URL: string
  readonly VITE_POWERSYNC_APIKEY: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
