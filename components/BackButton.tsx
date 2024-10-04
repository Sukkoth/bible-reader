"use client";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";

function BackButton() {
  const router = useRouter();
  return (
    <Button
      variant={"outline"}
      size={"icon"}
      className='size-10 shadow-none'
      onClick={() => router.back()}
    >
      <ChevronLeft />
    </Button>
  );
}

export default BackButton;
