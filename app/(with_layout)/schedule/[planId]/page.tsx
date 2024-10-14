import CreatePlanSchedule from "@/components/schedule/CreatePlanSchedule";
import { GET_TEMPLATE } from "@/utils/supabase/services";

type Props = {
  searchParams: { template?: string };
};

async function Page({ searchParams }: Props) {
  let template: Template | undefined;
  //do not fetch template if there is no template Id found
  //happens when user creates custom plan rather than choosing from templates

  if (searchParams.template) {
    const parsedTemplateId = parseInt(searchParams.template);
    if (!parsedTemplateId) {
      return (
        <div>
          <h1>404! No such page</h1>
        </div>
      );
    }
    template = await GET_TEMPLATE(parseInt(searchParams.template));
  }

  if (!template) {
    return (
      <div>
        <h1>404! No such page</h1>
      </div>
    );
  }

  const props = {
    showBooks: template.templateType === "PORTION" ? false : true,
    selected: template.schedules.items, //this is nested array
    books: template.books,
    perDay: template.schedules.perDay, //TODO fix this bcz not needed on "PORTION"
    customizable: template.schedules.customizable,
    userMade: template.schedules.userMade,
    template: template,
  };

  return <CreatePlanSchedule {...props} />;
}

export default Page;
