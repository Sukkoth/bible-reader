"use server";

import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { z } from "zod";

export async function resetPassword(password: string) {
  const passwordValidation = z.object({
    password: z
      .string()
      .min(6, "Password must be atleast 6 charactors")
      .max(20),
  });

  const validated = passwordValidation.safeParse({ password });
  if (!validated.success) {
    return {
      error:
        validated.error.flatten().fieldErrors.password?.[0] ||
        validated?.error?.flatten().formErrors?.[0] ||
        "Check your password",
    };
  }

  const supabase = createClient();
  const { data, error } = await supabase.auth.updateUser({ password });
  if (error || !data.user.id) {
    return {
      error: error?.message || "Something went wrong",
    };
  }

  return redirect("/home");
}
