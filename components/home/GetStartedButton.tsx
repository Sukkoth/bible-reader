"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

type Props = {
  isAuth: boolean;
};

function GetStartedButton({ isAuth }: Props) {
  const router = useRouter();
  return (
    <Button
      className='mt-5'
      size={"lg"}
      onClick={() => router.push(isAuth ? "/home" : "/login")}
    >
      Let&apos;s get started
    </Button>
  );
}

export default GetStartedButton;
