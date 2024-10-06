import GetStartedButton from "@/components/home/GetStartedButton";
import { ThemeToggle } from "@/components/ThemeToggle";
import { GET_USER } from "@/utils/supabase/services";
import Image from "next/image";

export default async function Home() {
  const { user } = await GET_USER();

  return (
    <main className='relative h-full w-full center-all flex-col'>
      <Image
        src='/background.jpg'
        alt='bg'
        layout='fill'
        objectFit='cover'
        className='-z-10'
      />
      <div className='absolute top-2 right-2'>
        <ThemeToggle />
      </div>
      <h1 className='text-4xl font-bold'>Bible Reader</h1>
      <h2 className='pt-2'>
        Track your daily Bible reading journey with ease.
      </h2>
      <GetStartedButton isAuth={!!user?.id} />
    </main>
  );
}
