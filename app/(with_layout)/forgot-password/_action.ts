"use server";
import { createClient } from "@/utils/supabase/server";

export async function checkEmailAndRequestReset(email: string) {
  console.log("Resetting email for ", email)
  const supabase = createClient();
  const redirectTo = `${process.env.NEXT_APP_URL}/api/auth?to=reset-password`;

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo,
  });

  if (error) {
    console.error(`Error resetting password for email of ${email}`, error)
    return {
      error: "Something went wrong",
    };
  }

  return {
    success: true,
  };
}
