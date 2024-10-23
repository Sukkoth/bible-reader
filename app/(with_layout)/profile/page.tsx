import BackButton from "@/components/BackButton";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { GET_USER } from "@/utils/supabase/services";
import Image from "next/image";
import { redirect } from "next/navigation";
import React, { ReactNode } from "react";
import {
  ChevronRight,
  User,
  Settings,
  Bell,
  Moon,
  BookOpen,
  Shield,
  LogOut,
  CheckCircle,
  XCircle,
  Calendar,
  TrendingUp,
} from "lucide-react";
import Link from "next/link";
import PlanDetailItem from "@/components/PlanDetailItem";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Bible Reader | Profile",
};
async function Profile() {
  const { user, profile } = await GET_USER();

  if (user?.id && (!profile || !profile?.first_name)) {
    redirect("/profile/complete-profile");
  }

  return (
    <div>
      <BackButton />
      <div className='pb-10 pt-50 mt-5'>
        <div
          className={cn(
            `size-[7rem] rounded-full overflow-hidden mx-auto border-4 border-stone-400 mt-5`,
            {
              relative: profile?.avatar,
              "flex items-center justify-center bg-card": !profile?.avatar,
            }
          )}
        >
          {profile?.avatar ? (
            <Image src={profile.avatar} alt='avatar' fill />
          ) : (
            <h1 className='text-4xl font-bold'>{profile?.first_name[0]}</h1>
          )}
        </div>
        <div className='text-center pt-5 text-lg font-medium'>
          <h2>
            {profile?.first_name} {profile?.last_name}
          </h2>
          <p className='dark:text-stone-500 text-stone-300 text-sm'>
            {user?.email}
          </p>
        </div>
      </div>

      <div className='my-5 grid grid-cols-3 gap-2'>
        {stats.map((statItem) => (
          <PlanDetailItem {...statItem} key={statItem.header} />
        ))}
      </div>

      <Card className='mt-8 shadow-none overflow-hidden'>
        <CardContent className='flex flex-col px-1 py-0 divide-y-2'>
          {items.map((menuItem) => (
            <MenuItem {...menuItem} key={menuItem.title} />
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

export default Profile;

type Props = {
  icon: ReactNode;
  title: string;
  href: string;
};
function MenuItem({ icon, title, href }: Props) {
  return (
    <Link
      href={href}
      className='inline-flex justify-between items-center w-fill py-4 text-sm cursor-pointer px-3 hover:bg-stone-100 dark:hover:bg-stone-800'
    >
      <div className='inline-flex gap-3 items-center'>
        {icon}
        <p>{title}</p>
      </div>
      <ChevronRight className='size-5' />
    </Link>
  );
}

const items: Props[] = [
  {
    icon: <User className='size-5' />, // Lucide icon for user profile
    title: "Profile",
    href: "/profile", // Link to user profile page
  },
  {
    icon: <Settings className='size-5' />, // Lucide icon for general settings
    title: "Account Settings",
    href: "/settings/account", // Link to account settings page
  },
  {
    icon: <Bell className='size-5' />, // Lucide icon for notifications
    title: "Notifications",
    href: "/settings/notifications", // Link to notification settings
  },
  {
    icon: <Moon className='size-5' />, // Lucide icon for dark mode toggle
    title: "Theme",
    href: "/settings/theme", // Link to theme settings (dark/light mode)
  },
  {
    icon: <BookOpen className='size-5' />, // Lucide icon for Bible reading plans
    title: "Reading Plans",
    href: "/plans", // Link to Bible reading plans section
  },
  {
    icon: <Shield className='size-5' />, // Lucide icon for security settings (2FA, password)
    title: "Security",
    href: "/settings/security", // Link to security settings
  },
  {
    icon: <LogOut className='size-5' />, // Lucide icon for logging out
    title: "Logout",
    href: "/logout", // Link for logging out
  },
];

const stats = [
  {
    icon: <BookOpen />, // Icon representing total plans
    header: "Total Plans",
    subText: "10 plans created", // Example total plans
    // Default variant
  },
  {
    icon: <CheckCircle />, // Icon representing completed plans
    header: "Completed Plans",
    subText: "7 plans completed", // Example completed plans
  },
  {
    icon: <XCircle />, // Icon representing pending or incomplete plans
    header: "Pending Plans",
    subText: "3 plans pending", // Example pending plans
  },
  {
    icon: <Calendar />, // Icon representing the date the user started using the app
    header: "Started On",
    subText: "October 16, 2023", // Example date the user started using the app
  },
  {
    icon: <TrendingUp />, // Icon representing the longest streak
    header: "Longest Streak",
    subText: "15 days in a row", // Example streak for staying consistent
  },
  {
    icon: <Calendar />, // Icon representing the next plan due date
    header: "Next Plan Due",
    subText: "October 20, 2024", // Example of when the next plan is due
  },
];
