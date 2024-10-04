"use client";
import React, { useState } from "react";
import { Button } from "../ui/button";
import CreateYourOwnPlan from "../CreateYourOwnPlan";
import { Separator } from "@radix-ui/react-dropdown-menu";
import { Compass, Plus } from "lucide-react";
import NewPlanItem from "../NewPlanItem";

function ListTemplates({ templates }: { templates: Template[] }) {
  const [showCreatePlanForm, setShowCreatePlanForm] = useState(false);

  return (
    <div className='pt-5'>
      <Button
        variant={!showCreatePlanForm ? "default" : "outline"}
        className='w-full'
        size='lg'
        onClick={() => setShowCreatePlanForm((prev) => !prev)}
      >
        {!showCreatePlanForm ? (
          <Plus className='mr-2 h-4 w-4' />
        ) : (
          <Compass className='mr-2 h-4 w-4' />
        )}{" "}
        {showCreatePlanForm ? "Pick from templates" : "Make your own"}
      </Button>
      <Separator className='my-5' />
      {showCreatePlanForm && <CreateYourOwnPlan />}

      {!showCreatePlanForm && (
        <div>
          <h1 className='text-3xl'>Templates</h1>
          <p className='text-sm pt-2 text-stone-500 dark:text-stone-300'>
            You can also pick from these pre made templates. These templates are
            made based on the most reading possibilities you can make on your
            own and if you can&apos;t find one, you can make your own.
          </p>

          <div>
            {templates?.map((template) => {
              // if template is ALL_IN_ONE
              const queryParam = `${template.plans.id}?type=${
                template.schedules.listType
              }&perDay=${template.schedules.perDay || 1}&books=${JSON.stringify(
                template.schedules.items
              )}`;

              return (
                <NewPlanItem
                  queryParam={queryParam}
                  title={template.plans.name}
                  description={template.plans.description}
                  quantifier={`${template.schedules.perDay}`}
                  duration={template.plans.suggestedDuration}
                  key={template.id}
                  img={template.plans.coverImg}
                />
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

export default ListTemplates;
