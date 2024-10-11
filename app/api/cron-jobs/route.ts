import { sendNotification } from "@/notifications/NotificationSender";
import { createClient } from "@/utils/supabase/server";
import { PushSubscription } from "web-push";

export async function GET() {
  const supabase = createClient();
  const { data: profiles, error } = await supabase
    .from("profiles")
    .select("notification")
    .eq("user_id", process.env.NOTIFICATION_TEST_ID);
  if (error) {
    return Response.json(
      {
        message: "Could not fetch profiles",
        error,
      },
      {
        status: 500,
      }
    );
  }
  const allSubs: PushSubscription[] = [];

  profiles.map(({ notification }: { notification: Notification }) => {
    allSubs.push(...notification.subscriptions);
  });

  allSubs.forEach(async (item) => {
    const response = await sendNotification(
      item,
      "Bible Reader",
      "Bible reader is testing push notification"
    );
    if (response.statusCode === 404 || response.statusCode === 410) {
      console.log("Delete item", item.keys.auth);
    }
  });

  return Response.json({
    subscriptions: allSubs,
  });
}
