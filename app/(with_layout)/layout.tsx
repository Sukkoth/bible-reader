import React, { ReactNode } from "react";

function layout({ children }: { children: ReactNode }) {
  return (
    <section className='max-w-[768px] shadow-lg p-3 px-5 mx-auto min-h-[100dvh] grid grid-[1fr] bg-background'>
      {children}
    </section>
  );
}

export default layout;
