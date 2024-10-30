/* eslint-disable @typescript-eslint/no-explicit-any */
interface umami {
  track(): Promise<string> | undefined;
  track(
    event_name: string,
    event_data?: { [key: string]: any }
  ): Promise<string> | undefined;
  track(custom_payload: {
    website: string;
    [key: string]: any;
  }): Promise<string> | undefined;
  track(
    callback: (props: {
      hostname: string;
      language: string;
      referrer: string;
      screen: string;
      title: string;
      url: string;
      website: string;
    }) => { website: string; [key: string]: any }
  ): Promise<string> | undefined;
}

declare global {
  interface Window {
    umami: umami;
  }
}

export {};
