import webpush, { PushSubscription, WebPushError } from "web-push";

webpush.setVapidDetails(
  "mailto:suukootj@gmail.com",
  process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY ?? "",
  process.env.VAPID_PRIVATE_KEY ?? ""
);

export const sendNotification = async (
  subscription: PushSubscription,
  title: string,
  message: string,
  url?: string
): Promise<{ statusCode: number }> => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const pushPayload: any = {
    title: title,
    body: message,
    //image: "/logo.png", if you want to add an image
    icon: "/pwa-192x192.png",
    url: url ?? process.env.NOTIFICATION_URL ?? "/",
    badge: "/pwa-192x192.png",
  };

  try {
    await webpush.sendNotification(subscription, JSON.stringify(pushPayload));
    console.log(new Date().toISOString(), "Notification sent", pushPayload);
    return {
      statusCode: 200,
    };
  } catch (error: unknown) {
    console.error(
      new Date().toISOString(),
      "Error sending notification",
      error
    );
    return {
      statusCode: (error as WebPushError).statusCode,
    };
  }
};
