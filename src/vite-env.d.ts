/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** `'true'` activa la autenticación simulada (cuenta demo e identidades de ejemplo). */
  readonly VITE_AUTH_SIMULADA?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
