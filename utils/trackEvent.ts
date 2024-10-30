// utils/trackEvent.ts
export const trackEvent = (
  eventName: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  eventData?: Record<string, any>
) => {
  if (window.umami) {
    console.log("register event", eventName, window.umami);
    window.umami.track(eventName, eventData);
  }
};
