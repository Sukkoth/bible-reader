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
  startDate: string;
  endDate: string;
  totalChapters: number;
  totalBooks: number;
  perDay: number;
  type?: string;
  userMade: boolean;
  customizable: boolean;
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
  if (!scheduleId) return;
  const supabase = createClient();

  const { data, error } = await supabase
    .from("userPlans")
    .select("*, plans(*), schedules(*)")
    .order("id", { referencedTable: "schedules" })
    .eq("id", scheduleId)
    .single();

  if (error) {
    if (error.code === "PGRST116") {
      return null;
    } else {
      throw new Error(error.message || "Something went wrong");
    }
  }
  return data as UserPlan;
}

export async function GET_PLANS(userId: string, filter: string) {
  const supabase = createClient();
  let query = supabase
    .from("userPlans")
    .select("*, plans(*), schedules(*)")
    .eq("userId", userId)
    .order("id", { referencedTable: "schedules" });

  if (filter === "In Progress") {
    query = query.is("completedAt", null);
  } else if (filter === "Paused") {
    query = query.not("pausedAt", "is", null);
  } else if (filter === "Completed") {
    query = query.not("completedAt", "is", null);
  } else {
    //All
    query = query.order("completedAt", {
      nullsFirst: true,
    }); //display completedAt = null plans first
  }

  const { data, error } = await query;
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
    .is("completedAt", null)
    .eq("schedules.date", format(new Date(), "yyyy-MM-dd"))
    .is("pausedAt", null);

  if (error) {
    throw new Error(error.message || "Something went wrong");
  }

  console.log(data);

  return (data as UserPlan[])?.filter(
    (dataItem) => dataItem.schedules.length > 0
  );
}

export async function MARK_PLAN_AS_COMPLETE(userPlanId: number) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("userPlans")
    .update({ completedAt: format(new Date(), "yyyy-MM-dd") })
    .eq("id", userPlanId)
    .select();

  if (error) {
    throw new Error(error?.message || "Something went wrong");
  }
  return data;
}

type CatchUpArgs = {
  daysToAdd: number;
  lastInCompleteDate: string;
  scheduleId: number;
};

export async function CATCHUP_SCHEDULE(args: CatchUpArgs) {
  const supabase = createClient();

  const { error } = await supabase.rpc("rescheduleforcatchup", {
    daystoadd: args.daysToAdd,
    lastincompletedate: args.lastInCompleteDate,
    scheduleid: args.scheduleId,
  });

  if (!error) {
    await supabase.rpc("extend_user_plan", {
      userplanid: args.scheduleId,
      daystoadd: args.daysToAdd,
    });
  }

  if (error)
    return {
      error: error.message,
    };

  return {
    success: true,
  };
}

//* TEMPLATES
type GetTemplateProps =
  | {
      userMade: boolean;
    }
  | undefined;
export async function GET_TEMPLATES(args: GetTemplateProps) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("templates")
    .select("*, plans(*)")
    .eq("schedules -> userMade", args?.userMade ?? true);

  if (error) {
    throw new Error(error.message || "Something went wrong");
  }

  return data;
}

export async function GET_TEMPLATE(templateId: number) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("templates")
    .select("*, plans(*)")
    .eq("id", templateId)
    .single();
  if (error) {
    throw new Error(error.message || "Something went wrong");
  }

  return data as Template;
}

export async function GET_CURRENT_MONTH_DAILY_PROGRESS(
  userId: string,
  userTimezone: string = "Africa/Nairobi"
) {
  const supabase = createClient();

  // Get the start and end dates for the current month in the user's timezone
  const startDate = new Date(
    new Date().toLocaleString("en-US", { timeZone: userTimezone })
  );
  startDate.setDate(1); // Set to the first day of the month

  const endDate = new Date(startDate);
  endDate.setMonth(endDate.getMonth() + 1); // Move to the first day of the next month
  endDate.setDate(1); // Set to the first day of the next month

  const { data, error } = await supabase
    .from("userPlans")
    .select("schedules(*)")
    .eq("userId", userId)
    .filter("schedules.date", "gte", startDate.toISOString())
    .filter("schedules.date", "lt", endDate.toISOString()) // Use 'lt' for exclusive end date
    .order("date", { ascending: true, referencedTable: "schedules" });

  if (error) {
    throw new Error(error?.message || "Something went wrong");
  }

  return data as { schedules: Schedule[] }[];
}

export async function DELETE_USER_PLAN(userPlanId: number) {
  const supabase = createClient();
  const { error } = await supabase
    .from("userPlans")
    .delete()
    .eq("id", userPlanId);

  return { error };
}

//* BOOK TRACKER

export async function GET_BOOK_PROGRESS(book: string) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data, error } = await supabase
    .from("bibleTracker")
    .select("*")
    .eq("userId", user!.id)
    .eq("book", book);
  if (error) {
    throw new Error(error?.message || "Something went wrong");
  }

  return data;
}

export async function GET_BOOKS_PROGRESS() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data } = await supabase
    .from("bibleTracker")
    .select("*")
    .eq("userId", user!.id);

  return data;
}

export type MarkChapterBook = {
  id?: number;
  book: string;
  progress: BookProgressItem[];
  markAsComplete: boolean;
};
export async function MARK_BOOK_CHAPTER({
  book,
  progress,
  id,
  markAsComplete,
}: MarkChapterBook) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user || !user.id) {
    throw new Error("Not authenticated");
  }
  const { data, error } = await supabase
    .from("bibleTracker")
    .upsert({
      id,
      userId: user.id,
      book,
      progress: progress,
      completedAt: markAsComplete ? format(new Date(), "yyyy-MM-dd") : null,
    })
    .eq("userId", user.id)
    .eq("book", book)
    .single();

  if (error) {
    throw new Error(error?.message || "Something went wrong");
  }

  return data;
}

export async function MARK_ALL_CHAPTERS_IN_BOOK(
  data: Pick<BookProgress, "book" | "progress"> & { id?: number }
) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { error } = await supabase
    .from("bibleTracker")
    .upsert({
      ...data,
      userId: user!.id,
      completedAt: format(new Date(), "yyyy-MM-dd"),
    })
    .eq("userId", user!.id)
    .eq("book", data.book)
    .single();

  return { error };
}

export async function GET_COMPLETED_BOOKS() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data } = await supabase
    .from("bibleTracker")
    .select("book")
    .eq("userId", user!.id)
    .not("completedAt", "is", null);

  const parsed = data ? data.map((book) => book.book) : [];
  return parsed as string[];
}

export async function RESET_BIBLE_READING_PROGRESS() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { error } = await supabase
    .from("bibleTracker")
    .delete()
    .eq("userId", user!.id);

  return { error };
}

export type ContactArgs = {
  fullName: string;
  email: string;
  message: string;
};
export async function SAVE_MESSAGE(args: ContactArgs) {
  const supabase = createClient();

  const { error } = await supabase
    .from("contactMessages")
    .insert(args)
    .single();

  if (error) {
    return { error: error.message || "Could not send message!" };
  }

  return { error: null };
}
