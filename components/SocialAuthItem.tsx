"use client";

import { useTransition } from "react";
import { Button } from "./ui/button";
import { Provider } from "@supabase/supabase-js";
import { loginWithSocial } from "@/actions";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { cn } from "@/lib/utils";

type Props = {
  provider: Provider;
  iconPath: string;
  invertIconColor?: boolean; //for github and alike icons that are not visible on dark mode
};

function SocialAuthItem({ provider, iconPath, invertIconColor }: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function handleClickLoginButton() {
    startTransition(async () => {
      const { error, url } = await loginWithSocial(provider);
      if (!error && url) {
        router.push(url);
      } else {
        alert(error);
      }
    });
  }

  return (
    <Button
      variant={"outline"}
      className='w-full'
      size='lg'
      disabled={isPending}
      onClick={handleClickLoginButton}
    >
      <Image
        src={iconPath}
        alt={`${provider}-icon`}
        width={25}
        height={25}
        className={cn("me-5", { "dark:invert": invertIconColor })}
      />
      <span className='capitalize'>
        {" "}
        {isPending ? "Logging in . . . " : `${provider}`}
      </span>
    </Button>
  );
}

export default SocialAuthItem;
