import { LoginSchemaType } from "@/lib/schemas/authSchema";
import { CompleteProfileSchemaType } from "@/lib/schemas/completeProfileSchema";
import { CreatePlanSchemaType } from "@/lib/schemas/createPlanSchema";
import { format } from "date-fns";
import { createClient } from "./server";
import { redirect } from "next/navigation";

type GetUserArgs = {
  withRedirect: boolean;
};
export async function GET_USER(args: GetUserArgs = { withRedirect: true }) {
  const supabase = createClient();
  const { data, error } = await supabase.auth.getUser();
  if (error) {
    if (args.withRedirect) {
      redirect("/login");
    } else {
      return { user: null };
    }
  }

  const profileData = await GET_PROFILE(data.user.id);
  return { user: data.user, profile: profileData };
}

export async function LOGOUT() {
  const supabase = createClient();
  const { error } = await supabase.auth.signOut();
  if (error) {
    throw new Error("Could not logout");
  }
}

export async function LOGIN(formData: LoginSchemaType) {
  const supabase = createClient();

  const { data, error: authError } = await supabase.auth.signInWithPassword(
    formData
  );
  if (authError) {
    throw new Error(authError.message || "Something went wrong");
  }

  const userId = data.user.id;
  const profileData = await GET_PROFILE(userId);
  return { user: data.user, profile: profileData };
}

export async function REGISTER(formData: LoginSchemaType) {
  const supabase = createClient();

  const { data, error } = await supabase.auth.signUp(formData);
  if (error) {
    throw new Error(error.message || "Something went wrong");
  }
  return data;
}

async function GET_PROFILE(userId: string): Promise<Profile> {
  const supabase = createClient();

  const { data: profileData } = await supabase
    .from("profiles")
    .select("*")
    .eq("user_id", userId)
    .single();
  return profileData;
}

export async function UPDATE_PROFILE(
  formData: CompleteProfileSchemaType,
  userId: string,
  profileId: number | undefined
) {
  const supabase = createClient();

  const dataToUpdate = {
    id: profileId || undefined,
    first_name: formData.firstName,
    last_name: formData.lastName!.length > 0 ? formData.lastName : undefined,
    avatar: formData.avatar,
    gender: formData.gender,
    user_id: userId,
  };

  const { data, error } = await supabase
    .from("profiles")
    .upsert(dataToUpdate)
    .select()
    .single();

  if (error) {
    throw new Error(error?.message || "Something went wrong");
  }

  return data;
}

export async function HANDLE_NOTIFICATION_SUBSCRIPTION(
  notification: Notification,
  userId: string
) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("profiles")
    .update({ notification })
    .eq("user_id", userId)
    .select("notification")
    .single();
  if (error) {
    console.error("Could not create notification subscription", error);
    throw new Error(error?.message || "Could not create notification");
  }
  return data.notification;
}

//* PLAN SERVICES
export async function CREATE_PLAN(
  formData: CreatePlanSchemaType,
  userId: string
) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("plans")
    .insert({
      ...formData,
      createdBy: userId,
    })
    .select()
    .single();

  if (error) {
    throw new Error(error.message || "Something went wrong");
  }

  return data as Plan;
}

export type CreatePlanSchedule = {
  planId: number;
  startDate: Date;
  endDate: Date;
  totalChapters: number;
  totalBooks: number;
  perDay: number;
  type?: string;
  schedules: {
    date: string;
    items: {
      status: string;
      goal: string;
      notes?: string;
    }[];
  }[];
};

export async function CREATE_PLAN_SCHEDULE(
  formData: CreatePlanSchedule,
  userId: string
) {
  const supabase = createClient();

  //remove the time zones from start and end dates
  //or else you will be getting different values for the startDate and
  //the first item in the schedules (mostly 1 date difference)
  const { schedules, ...otherData } = formData;
  const { data, error } = await supabase
    .from("userPlans")
    .insert({
      ...otherData,
      startDate: format(otherData.startDate, "yyyy-MM-dd HH:mm:ss"),
      endDate: format(otherData.endDate, "yyyy-MM-dd HH:mm:ss"),
      userId,
    })
    .select()
    .single();

  if (error) {
    throw new Error(error.message || "Something went wrong");
  }

  const { error: scheduleError } = await supabase.from("schedules").insert(
    schedules.map((schedule) => {
      return {
        ...schedule,
        userPlanId: data.id,
      };
    })
  );

  if (scheduleError) {
    throw new Error(scheduleError.message || "Something wenet wrong!");
  }

  return data;
}

export async function GET_PLAN_SCHEDULE(scheduleId: number) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("userPlans")
    .select("*, plans(*), schedules(*)")
    .order("id", { referencedTable: "schedules" })
    .eq("id", scheduleId)
    .single();

  if (error) {
    throw new Error(error.message || "Something went wrong");
  }
  return data as UserPlan;
}

export async function GET_PLANS(userId: string) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("userPlans")
    .select("*, plans(*), schedules(*)")
    .order("id", { referencedTable: "schedules" })
    .eq("userId", userId);
  if (error) {
    throw new Error(error.message || "Something went wrong");
  }

  return data as UserPlan[];
}

export type MarkPlanGoalData = {
  scheduleId: string;
  items: Schedule;
};

export async function UPDATE_SCHEDULE_ITEM_STATUS(formData: MarkPlanGoalData) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("schedules")
    .update({ items: formData.items.items })
    .eq("id", formData.scheduleId)
    .select()
    .single();

  if (error) {
    throw new Error(error.message || "Something went wrong");
  }

  return data as Schedule;
}

export async function GET_TODAYS_PLANS(userId: string) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("userPlans")
    .select("*, plans(*), schedules(*)")
    .eq("userId", userId)
    // .eq("schedules.date", "2024-09-27");
    .eq("schedules.date", format(new Date(), "yyyy-MM-dd"));

  if (error) {
    throw new Error(error.message || "Something went wrong");
  }

  return (data as UserPlan[])?.filter(
    (dataItem) => dataItem.schedules.length > 0
  );
}

//* TEMPLATES
export async function GET_TEMPLATES() {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("templates")
    .select("*, plans(*)");

  if (error) {
    throw new Error(error.message || "Something went wrong");
  }

  return data;
}

export async function GET_CURRENT_MONTH_DAILY_PROGRESS(userId: string) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("userPlans")
    .select("schedules(*)")
    .eq("userId", userId)
    .filter(
      "schedules.date",
      "gt",
      new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString()
    )
    .filter(
      "schedules.date",
      "lte",
      new Date(
        new Date().getFullYear(),
        new Date().getMonth() + 1,
        1
      ).toISOString()
    )
    .order("date", { ascending: true, referencedTable: "schedules" });

  if (error) {
    throw new Error(error?.message || "Something went wrong");
  }

  return data as { schedules: Schedule[] }[];
}
