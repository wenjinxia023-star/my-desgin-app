/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_COZE_API_TOKEN: string
  readonly VITE_COZE_API_URL: string
  readonly VITE_WORKFLOW_ID: string
  readonly VITE_PASSWORD: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}


