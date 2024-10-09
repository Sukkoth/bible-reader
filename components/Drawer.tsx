"use client";

import {
  Settings,
  X as CloseIcon,
  User,
  MenuIcon,
  LogOutIcon,
  BookMarked,
  SunMoon,
} from "lucide-react";
import Link from "next/link";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useState, useTransition } from "react";
import { useTheme } from "next-themes";
import { logout } from "@/actions";
import { Button } from "./ui/button";

function Drawer() {
  const [showDrawer, setShowDrawer] = useState(false);
  const [isLoggingOut, startTransition] = useTransition();
  const { setTheme, theme } = useTheme();

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
      <div className='flex items-center gap-2 w-fit h-fit'>
        <div
          className='text-primary hover:opacity-80 cursor-pointer'
          onClick={() => setShowDrawer(true)}
        >
          <MenuIcon className='text-3xl' />
        </div>
      </div>
      <div
        className={`absolute top-0 bottom-0 border bg-background z-30 w-[20rem] py-5 flex flex-col ${
          showDrawer ? "right-0" : "-right-80"
        } transition-all duration-300 opacity-100`}
      >
        <div
          className='text-primary hover:opacity-80 cursor-pointer self-end me-5'
          onClick={() => setShowDrawer(false)}
        >
          <CloseIcon className='text-3xl' />
        </div>
        <ul>
          {drawerItems.map((item) => (
            <DrawerItem {...item} key={item.label} />
          ))}
          <DrawerItem
            label='Switch Theme'
            icon={<SunMoon className='size-4' />}
            onClick={() => handleSetTheme()}
          />
          <AlertDialog>
            <AlertDialogTrigger className='w-full'>
              <DrawerItem
                icon={<LogOutIcon className='size-5' />}
                label='Logout'
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
        </ul>
      </div>
      {showDrawer && (
        <div className='absolute inset-0 backdrop-blur-[2px] z-10'></div>
      )}
    </div>
  );
}

const drawerItems = [
  {
    icon: <BookMarked className='size-5' />,
    label: "My Plans",
    to: "/plans",
  },
  // {
  //   icon: <User className='size-5' />,
  //   label: "Profile",
  //   to: "/profile",
  // },
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
};
function DrawerItem({ icon, label, to, onClick }: ItemProps) {
  return (
    <li
      className='flex gap-3 items-center py-3 px-8 cursor-pointer hover:bg-secondary transition-colors duration-300'
      onClick={onClick && onClick}
    >
      {icon}
      {to ? <Link href={to}>{label}</Link> : label}
    </li>
  );
}

export default Drawer;
