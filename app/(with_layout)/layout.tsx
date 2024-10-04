import React, { ReactNode } from "react";

function layout({ children }: { children: ReactNode }) {
  return (
    <section className='max-w-[480px] p-3 px-5 mx-auto min-h-[100dvh] grid grid-[1fr]'>
      {children}
    </section>
  );
}

export default layout;
