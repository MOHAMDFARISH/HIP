// FIX: Manually defined types for Vite's environment variables.
// This resolves errors where `import.meta.env` was not recognized by TypeScript
// due to a project configuration issue preventing `vite/client` types from loading.
// FIX: Wrap interfaces in `declare global` to make them available project-wide from this module.
declare global {
  interface ImportMetaEnv {
    readonly VITE_CONTACT_EMAIL: string;
    readonly VITE_RECAPTCHA_SITE_KEY: string;
    readonly VITE_BANK_NAME: string;
    readonly VITE_ACCOUNT_HOLDER_NAME: string;
    readonly VITE_USD_ACCOUNT_NUMBER: string;
    readonly VITE_MVR_ACCOUNT_NUMBER: string;
    readonly VITE_PRICE_DETAILS: string;
  }

  interface ImportMeta {
    readonly env: ImportMetaEnv;
  }
}

// FIX: Add an empty export to treat this file as a module.
// This is necessary for `declare global` to work correctly and augment the global scope.
export {};
