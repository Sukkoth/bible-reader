import GetStartedButton from "@/components/home/GetStartedButton";
import { GET_USER } from "@/utils/supabase/services";
import Image from "next/image";

export default async function Home() {
  const { user } = await GET_USER();
  return (
    <main className='h-full w-full center-all flex-col'>
      <Image
        src='/background.jpg'
        alt='bg'
        layout='fill'
        objectFit='cover'
        className='-z-10'
      />

      <h1 className='text-4xl font-bold'>Bible Reader</h1>
      <h2 className='pt-2 text-center px-7'>
        Track your daily Bible reading journey with ease.
      </h2>
      <GetStartedButton isAuth={!!user?.id} />
    </main>
  );
}
