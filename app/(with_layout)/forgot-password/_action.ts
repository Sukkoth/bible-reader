"use server";
import { createClient } from "@/utils/supabase/server";

export async function checkEmailAndRequestReset(email: string) {
  const supabase = createClient();
  const redirectTo = `${process.env.NEXT_APP_URL}/api/auth?to=reset-password`;

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo,
  });

  if (error) {
    return {
      error: "Something went wrong",
    };
  }

  return {
    success: true,
  };
}
