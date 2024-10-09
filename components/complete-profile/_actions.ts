"use server";
import { CompleteProfileSchemaType } from "@/lib/schemas/completeProfileSchema";
import { UPDATE_PROFILE } from "@/utils/supabase/services";

export async function completeProfileAction(
  userId: string,
  data: CompleteProfileSchemaType,
  profileId?: number
) {
  try {
    await UPDATE_PROFILE(data, userId, profileId);
    return {
      id: userId,
    };
  } catch (error) {
    console.error("Could not update profile", error);
    return {
      error: "Could not update profile",
    };
  }
}
