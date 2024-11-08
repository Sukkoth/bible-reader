import CreatePlanSchedule from "@/components/schedule/CreatePlanSchedule";
import { GET_TEMPLATE } from "@/utils/supabase/services";
import { Metadata } from "next";
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

export const metadata: Metadata = {
  title: "Bible Reader | Schedule",
  description: "Create schedule for your plan.",
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
      showBooks:
        template.schedules.userMade && template.templateType === "CHAPTER"
          ? true
          : false,
      selected: template.schedules.items, //this is nested array
      books: template.books,
      perDay: template.schedules.perDay,
      customizable: template.schedules.customizable,
      userMade: template.schedules.userMade,
      template: template,
    };
  } else
    props = {
      showBooks: true,
      selected: [], //this is nested array
      books: [],
      perDay: 1,
      customizable: true,
      userMade: true,
    };

  return <CreatePlanSchedule {...(props as PropsToPass)} />;
}

export default Page;
