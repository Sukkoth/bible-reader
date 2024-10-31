"use client";

import React, { useTransition } from "react";
import Link from "next/link";
import { useTheme } from "next-themes";
import {
  LogOutIcon,
  BookMarked,
  BookOpenCheck,
  Sun,
  MoonStar,
} from "lucide-react";

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "./ui/button";
import { logout } from "@/actions";
import { cn } from "@/lib/utils";

function DrawerMenu() {
  const { setTheme, theme } = useTheme();
  const [isLoggingOut, startTransition] = useTransition();

  function handleSetTheme() {
    setTheme(theme === "light" ? "dark" : "light");
  }

  function handleLogout() {
    startTransition(async () => {
      await logout();
    });
  }
  return (
    <div>
      {drawerItems.map((item) => (
        <DrawerItem {...item} key={item.label} />
      ))}
      <DrawerItem
        label='Switch Theme'
        icon={
          theme === "dark" ? (
            <MoonStar className='size-4 text-stone-500' />
          ) : (
            <Sun className='size-4 text-stone-500' />
          )
        }
        onClick={() => handleSetTheme()}
      />
      <AlertDialog>
        <AlertDialogTrigger className='w-full'>
          <DrawerItem
            icon={<LogOutIcon className='size-5 text-stone-500' />}
            label='Logout'
            stickToBottom
          />
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              By continuing, you logout from your current session in use
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <Button
              disabled={isLoggingOut}
              onClick={handleLogout}
              className='bg-red-700 hover:bg-red-600'
            >
              {isLoggingOut ? "Logging out" : "Continue"}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

const drawerItems = [
  {
    icon: <BookMarked className='size-5 text-stone-500' />,
    label: "My Plans",
    to: "/plans",
  },
  // {
  //   icon: <User className='size-5' />,
  //   label: "Profile",
  //   to: "/profile",
  // },
  {
    icon: <BookOpenCheck className='size-5 text-stone-500' />,
    label: "Bible Tracker",
    to: "/bible-tracker",
  },
  // {
  //   icon: <Settings className='size-5' />,
  //   label: "Settings",
  //   to: "/settings",
  // },
];

type ItemProps = {
  icon: React.ReactNode;
  label: string;
  to?: string;
  onClick?: () => void;
  stickToBottom?: boolean;
};
function DrawerItem({ icon, label, to, onClick, stickToBottom }: ItemProps) {
  return (
    <li
      className={cn(
        "flex gap-3 items-center py-3 px-8 md:px-2 cursor-pointer dark:hover:bg-secondary hover:bg-stone-200 transition-colors duration-300 mx-2 rounded-md text-sm",
        {
          "md:absolute md:bottom-2 md:inset-x-2 md:dark:bg-card md:border-stone-200 md:dark:border-stone-700 md:hover:bg-destructive/80 md:my-2  md:hover:text-white":
            stickToBottom,
        }
      )}
      onClick={onClick && onClick}
    >
      {icon}
      {to ? <Link href={to}>{label}</Link> : label}
    </li>
  );
}

export default DrawerMenu;
