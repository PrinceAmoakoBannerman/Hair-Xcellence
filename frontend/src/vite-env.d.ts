/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Backend base URL, e.g. https://hairxcellence-api.onrender.com */
  readonly VITE_API_URL?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
