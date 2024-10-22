import BackButton from "@/components/BackButton";
import BibleTracker from "@/components/BibleTracker";
import { GET_COMPLETED_BOOKS } from "@/utils/supabase/services";
import React from "react";

async function Page() {
  const completedBooks = (await GET_COMPLETED_BOOKS()) as string[];
  return (
    <div>
      <BackButton />
      <div className='py-5'>
        <h1 className='text-sm xxs:text-xl xs:text-2xl'>Bible Tracker</h1>
      </div>
      <BibleTracker completed={completedBooks} />
    </div>
  );
}

export default Page;
