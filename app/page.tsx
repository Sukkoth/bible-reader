import GetStartedButton from "@/components/home/GetStartedButton";
import { GET_USER } from "@/utils/supabase/services";
import { redirect } from "next/navigation";

export default async function Home() {
  const authData = await GET_USER({
    withRedirect: false,
  });

  if (authData.user) {
    redirect("/home");
  }
  return (
    <main className='h-full w-full center-all flex-col'>
      <div className='absolute top-0 z-[-2] h-screen w-screen bg-[#000000] bg-[radial-gradient(#ffffff33_1px,#00091d_1px)] bg-[size:20px_20px]'></div>

      <h1 className='text-6xl font-bold text-white'>Bible Reader</h1>
      <h2 className={`pt-2 text-center px-7 text-white text-sm`}>
        Track your daily Bible reading journey with ease.
      </h2>
      <GetStartedButton />
    </main>
  );
}
