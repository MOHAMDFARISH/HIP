// FIX: Manually defined types for Vite's environment variables.
// This resolves errors where `import.meta.env` was not recognized by TypeScript
// due to a project configuration issue preventing `vite/client` types from loading.
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


export enum Page {
  Home = 'Home',
  AboutTheBook = 'About the Book',
  MeetHawlaRiza = 'Meet Hawla Riza',
  PoetrySamples = 'Poetry Samples',
  PreOrder = 'Pre-Order',
  OrderTracking = 'Track Your Order',
  Contact = 'Contact',
  FAQ = 'FAQ',
}
