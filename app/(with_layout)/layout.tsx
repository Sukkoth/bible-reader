import { Toaster } from "@/components/ui/toaster";
import { NotificationProvider } from "@/notifications/useNotification";
import React, { ReactNode } from "react";

function layout({ children }: { children: ReactNode }) {
  return (
    <NotificationProvider>
      <section className='max-w-[480px] shadow-md dark:shadow-lg dark:shadow-gray-700 p-3 px-5 mx-auto min-h-[100dvh] grid grid-[1fr] bg-background'>
        {children}
      </section>
      <Toaster />
    </NotificationProvider>
  );
}

export default layout;
