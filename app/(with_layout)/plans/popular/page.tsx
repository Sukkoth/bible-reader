import BackButton from "@/components/BackButton";
import { GET_TEMPLATES } from "@/utils/supabase/services";
import NewPlanItem from "@/components/NewPlanItem";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Bible Reader | Popular Plans",
  description: `Discover a curated selection of reading plans crafted by scholars and trusted organizations to help you achieve specific goals in your spiritual journey. These carefully designed plans offer structured, time-tested approaches to deepen your understanding of the Bible.`,
};

async function PopularPlans() {
  const templates = await GET_TEMPLATES({ userMade: false });
  return (
    <div>
      <BackButton />
      <div className='pt-5'>
        <h1 className='text-sm xxs:text-xl xs:text-2xl'>Popular Plans</h1>
      </div>
      <div>
        <p className='text-sm pt-2 text-stone-500 dark:text-stone-300'>
          Discover a curated selection of reading plans crafted by{" "}
          <strong className='text-primary'> scholars</strong> and
          <strong className='text-primary'> trusted organizations</strong> to
          help you achieve specific goals in your spiritual journey. These{" "}
          <strong className='text-primary'>carefully</strong> designed plans
          offer structured,
          <strong className='text-primary'>time-tested</strong> approaches to
          deepen your understanding of the Bible.
        </p>

        <div className='mt-5'>
          {templates?.map((template: Template) => {
            const queryParam = `${template.planId}?template=${template.id}`;
            return (
              <NewPlanItem
                userMade={false}
                customizable={template.schedules.customizable}
                queryParam={queryParam}
                title={template.plans.name}
                description={template.plans.description}
                quantifier={`${template.schedules.perDay}`}
                duration={template.schedules.items.length}
                key={template.id}
                img={template.plans.coverImg}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default PopularPlans;
