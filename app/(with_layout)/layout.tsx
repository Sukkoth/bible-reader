import { NotificationProvider } from "@/notifications/useNotification";
import React, { ReactNode } from "react";

function layout({ children }: { children: ReactNode }) {
  return (
    <NotificationProvider>
      <section className='max-w-[480px] shadow-md md:border p-3 px-5 mx-auto min-h-[100dvh] grid grid-[1fr] bg-background relative overflow-hidden'>
        {children}
      </section>
    </NotificationProvider>
  );
}

export default layout;
