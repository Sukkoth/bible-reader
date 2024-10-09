import {
  GET_USER,
  HANDLE_NOTIFICATION_SUBSCRIPTION,
} from "@/utils/supabase/services";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  const { subscription } = await req.json();
  const { user, profile } = await GET_USER({ withRedirect: false });
  if (!user) {
    throw new Error("No user");
  }
  try {
    const notification = profile.notification;
    const found = notification.subscriptions.filter(
      (sub) => sub.endpoint === subscription.endpoint
    );
    console.log({ found });
    if (found.length === 0) {
      console.log("registering sub");
      notification.subscriptions.push(subscription);
      const notificationSubcription = await HANDLE_NOTIFICATION_SUBSCRIPTION(
        notification,
        user.id
      );
      return Response.json(
        {
          subscription: notificationSubcription,
        },
        { status: 201 }
      );
    }

    console.log("NOTIFICATION ALREADY SUBBED");
    return Response.json(
      { message: "Subscription already exists" },
      { status: 200 }
    );
  } catch {
    return Response.json(
      {
        message: "Could not create notification subscription",
      },
      {
        status: 500,
      }
    );
  }
}
