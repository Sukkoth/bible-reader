"use client";

import { X as CloseIcon, MenuIcon } from "lucide-react";

import { useState } from "react";
import Image from "next/image";
import DrawerMenu from "./DrawerMenu";

type Props = {
  avatar?: string;
};

function Drawer({ avatar }: Props) {
  const [showDrawer, setShowDrawer] = useState(false);

  return (
    <>
      <div className='flex items-center gap-2 w-fit h-fit'>
        <div
          className='text-primary hover:opacity-80 cursor-pointer md:hidden'
          onClick={() => setShowDrawer(true)}
        >
          {avatar ? (
            <Image
              src={avatar}
              width={38}
              height={38}
              alt='avatar'
              className='rounded-full object-cover dark:border-stone-500 border-stone-400 border-2 mt-2'
            />
          ) : (
            <MenuIcon className='text-3xl' />
          )}
        </div>
      </div>
      <div
        className={`absolute top-0 bottom-0 border-l bg-background z-30 w-[20rem] py-5 flex flex-col ${
          showDrawer ? "right-0" : "-right-80"
        } transition-all duration-300 opacity-100`}
      >
        <div
          className='text-primary hover:opacity-80 cursor-pointer self-end me-7 mt-5'
          onClick={() => setShowDrawer(false)}
        >
          <CloseIcon className='text-3xl' />
        </div>
        <DrawerMenu />
      </div>
      {showDrawer && (
        <div className='absolute inset-0 backdrop-blur-[2px] z-10'></div>
      )}
    </>
  );
}

export default Drawer;
