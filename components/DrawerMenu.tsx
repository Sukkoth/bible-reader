'use client';

import {
  BookMarked,
  BookOpenCheck,
  Copy,
  KeyRound,
  ListChecks,
  LogOutIcon,
  MoonStar,
  Sun,
} from 'lucide-react';
import { useTheme } from 'next-themes';
import Link from 'next/link';
import React, { useState, useTransition } from 'react';

import { logout } from '@/actions';
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { cn } from '@/lib/utils';
import { Button } from './ui/button';

function DrawerMenu({ otp }: { otp: string | null }) {
  const { setTheme, theme } = useTheme();
  const [isLoggingOut, startTransition] = useTransition();

  function handleSetTheme() {
    setTheme(theme === 'light' ? 'dark' : 'light');
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
      <DrawerItem label="Switch Theme" icon={<ThemeIcons />} onClick={() => handleSetTheme()} />
      {otp && <OTPViewer otp={otp} />}
      <AlertDialog>
        <AlertDialogTrigger className="w-full">
          <DrawerItem
            icon={<LogOutIcon className="size-5 text-stone-500" />}
            label="Logout"
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
              className="bg-red-700 hover:bg-red-600"
            >
              {isLoggingOut ? 'Logging out' : 'Continue'}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

const drawerItems = [
  {
    icon: <BookMarked className="size-5 text-stone-500" />,
    label: 'My Plans',
    to: '/plans',
  },
  // {
  //   icon: <User className='size-5' />,
  //   label: "Profile",
  //   to: "/profile",
  // },
  {
    icon: <BookOpenCheck className="size-5 text-stone-500" />,
    label: 'Bible Tracker',
    to: '/bible-tracker',
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
        'flex gap-3 items-center py-3 px-8 md:px-2 cursor-pointer dark:hover:bg-secondary hover:bg-stone-200 transition-colors duration-300 mx-2 rounded-md text-sm',
        {
          'md:absolute md:bottom-2 md:inset-x-2 md:dark:bg-card md:border-stone-200 md:dark:border-stone-700 md:hover:bg-destructive/80 md:my-2  md:hover:text-white':
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

function ThemeIcons() {
  return (
    <>
      <Sun className="size-4 text-stone-500 dark:hidden" />
      <MoonStar className="size-4 text-stone-500 hidden dark:block" />
    </>
  );
}

function OTPViewer({ otp }: { otp: string }) {
  const [isCopied, setIsCopied] = useState(false);

  async function handleCopy() {
    await navigator.clipboard.writeText(`OTP${otp}`);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  }
  return (
    <AlertDialog>
      <AlertDialogTrigger className="w-full">
        <DrawerItem
          icon={<KeyRound className="size-5 text-stone-500" />}
          label="Get telegram OTP"
        />
      </AlertDialogTrigger>
      <AlertDialogContent
        className={`after:content-['Copied'] after:right-5 after:top-5 after:px-3 after:py-1 after:border after:dark:border-white after:border-black after:rounded-md after:bg-card after:text-xs ${
          isCopied ? 'after:absolute' : 'after:hidden'
        }`}
      >
        <AlertDialogHeader>
          <AlertDialogTitle>OTP for telegram</AlertDialogTitle>
          <AlertDialogDescription>
            Copy the following otp to verify your telegram account so that you can use Bible Reader
            bot
            <div className="text-center text-xs bg-secondary py-2 w-full mt-2 flex justify-between items-center px-4">
              <span>OTP{otp}</span>
              <Button variant="outline" size={'icon'} onClick={handleCopy}>
                {isCopied ? <ListChecks className="size-4" /> : <Copy className="size-4" />}
              </Button>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Close</AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default DrawerMenu;
