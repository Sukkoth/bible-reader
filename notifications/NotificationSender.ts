import webpush, { PushSubscription } from "web-push";

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
) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const pushPayload: any = {
    title: title,
    body: message,
    //image: "/logo.png", if you want to add an image
    icon: "/pwa-192x192.png",
    url: url ?? process.env.NOTIFICATION_URL ?? "/",
    // badge: "/google-icon.svg",
  };

  webpush
    .sendNotification(subscription, JSON.stringify(pushPayload))
    .then(() => {
      console.log("Notification sent", pushPayload);
    })
    .catch((error) => {
      console.error("Error sending notification", error);
    });
};
