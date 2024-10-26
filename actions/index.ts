"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createClient } from "@/utils/supabase/server";
import { LoginSchema } from "@/lib/schemas/authSchema";
import { Provider } from "@supabase/supabase-js";
import { sendNotification } from "@/notifications/NotificationSender";
import { PushSubscription } from "web-push";
import {
  ContactArgs,
  MARK_PLAN_AS_COMPLETE,
  SAVE_MESSAGE,
} from "@/utils/supabase/services";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function login(prevState: any, formData: FormData) {
  const supabase = createClient();

  const data = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  const validated = LoginSchema.safeParse(data);

  if (validated.error) {
    return {
      message: "Invalid data",
      formErrors: validated.error.flatten(),
    };
  }

  const { error } = await supabase.auth.signInWithPassword(data);

  if (error)
    return {
      message: error.message || "Something Went wrong!",
    };

  revalidatePath("/", "layout");
  redirect("/home");
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function register(prevState: any, formData: FormData) {
  const supabase = createClient();

  const data = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  const validated = LoginSchema.safeParse(data);

  if (validated.error) {
    return {
      message: "Invalid Data",
      formErrors: validated.error.flatten(),
    };
  }

  const { error } = await supabase.auth.signUp(data);

  if (error) return { message: error?.message || "Something went wrong" };

  revalidatePath("/", "layout");
  redirect("/");
}

export async function logout() {
  const supabase = createClient();
  await supabase.auth.signOut();
  revalidatePath("/", "layout");
  redirect("/");
}

export async function loginWithSocial(provider: Provider) {
  try {
    const supabase = createClient();

    const { data, error } = await supabase.auth.signInWithOAuth({
      provider,
      options: { redirectTo: process.env.NEXT_APP_URL + "/api/auth" },
    });

    if (error) {
      throw error;
    }
    return { error: null, url: data.url };
  } catch {
    return { error: "Error logging in" };
  }
}

type NotificationActionArgs = {
  title: string;
  message: string;
  subscription: PushSubscription;
};
export async function notificationAction(args: NotificationActionArgs) {
  console.log("sending notification to", args.subscription.endpoint);
  await fetch(`${process.env.NEXT_APP_URL}/api/web-push/send`, {
    method: "POST",
    body: JSON.stringify(args),
    headers: {
      "Content-Type": "application/json",
    },
  });
  return;
}

export async function markPlanAsComplete(planId: number) {
  try {
    await MARK_PLAN_AS_COMPLETE(planId);
    return {
      success: true,
    };
  } catch (error) {
    return {
      success: false,
      error:
        typeof error === "string"
          ? error
          : "Could not mark as complete on server",
    };
  }
}

export async function saveContactMessage(args: ContactArgs) {
  const result = await SAVE_MESSAGE(args);
  if (result?.error) {
    return { error: result.error };
  }
  return { success: true };
}
