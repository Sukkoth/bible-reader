"use client";

import { createClient } from "@/utils/supabase/client";
import SubmitButton from "./SubmitButton";

function GoogleAuth() {
  const supabase = createClient();
  async function handleLoginGoogle() {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: process.env.NEXT_APP_URL,
      },
    });
  }

  return (
    <form action={handleLoginGoogle}>
      <SubmitButton
        variant={"outline"}
        className='w-full'
        size='lg'
        pendingText='Processing . . .'
      >
        Google
      </SubmitButton>
    </form>
  );
}

export default GoogleAuth;
