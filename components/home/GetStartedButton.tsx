"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

function GetStartedButton() {
  const router = useRouter();
  return (
    <Button
      className='h-12 px-3 xxs:px-16 bg-transparent border border-white mt-5 hover:bg-stone-500/30 hover:px-20 transition-all duration-500'
      size={"lg"}
      onClick={() => router.push("/home")}
    >
      Get started
    </Button>
  );
}

export default GetStartedButton;
