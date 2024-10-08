"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

function GetStartedButton() {
  const router = useRouter();
  return (
    <Button className='mt-5' size={"lg"} onClick={() => router.push("/home")}>
      Let&apos;s get started
    </Button>
  );
}

export default GetStartedButton;
