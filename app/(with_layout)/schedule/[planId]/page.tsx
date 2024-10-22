import CreatePlanSchedule from "@/components/schedule/CreatePlanSchedule";
import { GET_TEMPLATE } from "@/utils/supabase/services";
import { notFound } from "next/navigation";

type Props = {
  searchParams: { template?: string };
};

type PropsToPass = {
  showBooks: boolean;
  selected: string[][];
  books: string[];
  perDay: number;
  customizable: boolean;
  userMade: boolean;
  template?: Template;
};

async function Page({ searchParams }: Props) {
  let template: Template | undefined;
  //do not fetch template if there is no template Id found
  //happens when user creates custom plan rather than choosing from templates

  if (searchParams.template) {
    const parsedTemplateId = parseInt(searchParams.template);
    if (parsedTemplateId) {
      template = await GET_TEMPLATE(parseInt(searchParams.template));
    }
    if (!template) {
      return notFound();
    }
  }

  let props = {};

  if (template) {
    props = {
      showBooks: template.templateType === "PORTION" ? false : true,
      selected: template.schedules.items, //this is nested array
      books: template.books,
      perDay: template.schedules.perDay, //TODO fix this bcz not needed on "PORTION"
      customizable: template.schedules.customizable,
      userMade: template.schedules.userMade,
      template: template,
    };
  } else
    props = {
      showBooks: true,
      selected: [], //this is nested array
      books: [],
      perDay: 1, //TODO fix this bcz not needed on "PORTION"
      customizable: true,
      userMade: true,
    };

  return <CreatePlanSchedule {...(props as PropsToPass)} />;
}

export default Page;
