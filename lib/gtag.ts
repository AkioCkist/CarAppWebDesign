// src/lib/gtag.ts
declare global {
  interface Window {
    gtag: (...args: any[]) => void;
  }
}
export const GA_TRACKING_ID = 'G-M6FED393ST';

export const pageview = (url: string) => {
  window.gtag('config', GA_TRACKING_ID, {
    page_path: url,
  });
};
