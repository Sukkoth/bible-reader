"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createClient } from "@/utils/supabase/server";
import { LoginSchema } from "@/lib/schemas/authSchema";

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

export async function googleAuth() {
  const supabase = createClient();

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: process.env.APP_URL + "/home",
    },
  });

  if (!error) redirect(data.url);
}

export async function logout() {
  const supabase = createClient();
  await supabase.auth.signOut();
  revalidatePath("/", "layout");
  redirect("/");
}
