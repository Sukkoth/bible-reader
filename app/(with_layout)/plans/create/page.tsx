import BackButton from "@/components/BackButton";
import { Siren } from "lucide-react";
import { GET_TEMPLATES } from "@/utils/supabase/services";
import ListTemplates from "@/components/plans/ListTemplates";

async function CreatePlan() {
  const templates = await GET_TEMPLATES();
  return (
    <div>
      <BackButton />
      <div className='text-sm border p-3 rounded-md mt-5 text-stone-500 dark:text-stone-300 flex gap-8 items-center'>
        <div className='text-2xl animate-pulse text-primary'>
        <Siren />
        </div>
        <p>
          <strong className='text-primary'>Create a plan</strong> of your own or
          pick from the given{" "}
          <strong className='text-primary'>templates</strong>. Then you will
          move on to <strong className='text-primary'>create a schedule</strong>{" "}
          for your plan.
        </p>
      </div>
      <ListTemplates templates={templates} />
    </div>
  );
}

export default CreatePlan;
