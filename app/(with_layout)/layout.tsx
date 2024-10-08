import React, { ReactNode } from "react";

function layout({ children }: { children: ReactNode }) {
  return (
    <section className='max-w-[480px] shadow-lg dark:shadow-gray-600 p-3 px-5 mx-auto min-h-[100dvh] grid grid-[1fr] bg-background'>
      {children}
    </section>
  );
}

export default layout;
