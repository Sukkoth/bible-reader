import GetStartedButton from "@/components/home/GetStartedButton";
import Image from "next/image";

export default async function Home() {
  return (
    <main className='h-full w-full center-all flex-col'>
      <Image
        src='/background.jpg'
        alt='bg'
        fill
        style={{ objectFit: "cover" }}
        className='-z-10'
      />

      <h1 className='text-4xl font-bold text-white'>Bible Reader</h1>
      <h2 className='pt-2 text-center px-7 text-white'>
        Track your daily Bible reading journey with ease.
      </h2>
      <GetStartedButton />
    </main>
  );
}
