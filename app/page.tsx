import GetStartedButton from "@/components/home/GetStartedButton";
import Benefits from "@/components/Landing/Benefits";
import FrequentQuestions from "@/components/Landing/FrequentQuestions";
import Features from "@/components/Landing/Features";
import { interFont } from "@/lib/fonts";
import { GET_USER } from "@/utils/supabase/services";
import { redirect } from "next/navigation";
import LearnMore from "@/components/Landing/LearnMore";

export default async function Home() {
  const authData = await GET_USER({
    withRedirect: false,
  });

  if (authData.user) {
    redirect("/home");
  }
  return (
    <main className={`h-full w-full overflow-y-scroll ${interFont.className}`}>
      <div className='absolute inset-0 -z-10 h-full w-full bg-stone-800/10 bg-[linear-gradient(to_right,#27bc591c_1px,transparent_1px),linear-gradient(to_bottom,#27bc591c_1px,transparent_1px)] bg-[size:6rem_4rem]'>
        <div className='absolute bottom-0 left-0 right-0 top-0 bg-[radial-gradient(circle_500px_at_50%_200px,#8bc0915f,transparent)]'></div>
      </div>
      <section className='center-all flex-col h-full relative'>
        <h1 className={`text-4xl xs:text-6xl lg:text-8xl font-bold text-white`}>
          Bible Reader
        </h1>
        <h2
          className={`pt-2 text-center px-7 text-sm text-stone-300 md:w-[40rem]`}
        >
          Easily follow your daily Bible reading with Bible Reader, an app
          designed to help you stay on track with your reading goals and grow in
          faith.
        </h2>
        <GetStartedButton />
        <LearnMore />
      </section>
      <Features />
      <Benefits />
      <FrequentQuestions />
    </main>
  );
}
