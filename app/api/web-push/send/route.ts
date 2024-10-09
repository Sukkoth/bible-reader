import { sendNotification } from "@/notifications/NotificationSender";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  const { subscription, title, message } = await req.json();
  console.log("recieved subscription");
  await sendNotification(subscription, title, message);
  return new Response(JSON.stringify({ message: "Push sent." }), {});
}
