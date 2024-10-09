import { PushSubscription } from "web-push";

declare global {
  declare type ScheduleStatus = "PENDING" | "COMPLETE";
  declare type PlanType = "BOOK" | "BIBLE";

  interface Notification {
    allowed: boolean;
    subscriptions: PushSubscription[];
  }

  interface Profile {
    id: number;
    created_at: string;
    updated_at: string;
    first_name: string;
    last_name: string;
    gender: string;
    avatar?: string;
    user_id: string;
    notification: Notification;
  }

  // Plan interface
  interface Plan {
    id: number;
    name: string;
    description: string;
    createdBy?: string | null; // null if created by admin
    coverImg?: string | null;
    suggestedDuration: number;
    userPlans?: UserPlan[];
    created_at: string;
    updatedAt: string;
  }

  // Schedule Item interface
  interface ScheduleItem {
    goal: string;
    notes: string;
    status: "PENDING" | "COMPLETED";
    completedAt?: string;
  }

  // Schedule interface
  interface Schedule {
    id: string;
    date: string;
    items: ScheduleItem[];
  }

  // UserPlan interface
  interface UserPlan {
    id: number;
    planId: number;
    userId: string;
    startDate: string;
    endDate: string;
    type?: string | null;
    schedules: Schedule[];
    totalChapters: number;
    totalBooks: number;
    perDay: number;
    plans: Plan;
  }

  interface Template {
    id: number;
    books: string[];
    chaptersCount: number;
    planId: number;
    showTime: boolean;
    schedules: {
      items: string[];
      perDay: number;
      listType: string;
    };
    created_at: Date;
    updated_at: Date;
    plans: Plan;
  }
}
