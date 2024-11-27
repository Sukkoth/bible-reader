// src/types/telegram.d.ts
export {};

declare global {
  interface Window {
    Telegram?: {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      WebApp?: any; // You can replace 'any' with more specific types if known
    };
  }
}
