"use client";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";

type Props = {
  onClick?: () => void;
};

function BackButton({ onClick }: Props) {
  const router = useRouter();
  return (
    <Button
      variant={"outline"}
      size={"icon"}
      className='size-10 shadow-none'
      onClick={() => (onClick ? onClick() : router.back())}
    >
      <ChevronLeft />
    </Button>
  );
}

export default BackButton;
