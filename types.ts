// FIX: Added a triple-slash directive to include Vite's client types.
// This provides TypeScript with type definitions for `import.meta.env`,
// resolving errors where environment variables were reported as non-existent.
/// <reference types="vite/client" />

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