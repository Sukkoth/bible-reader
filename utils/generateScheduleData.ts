import { books } from "@/lib/bible_books_list";
import { CreatePlanSchedule } from "@/utils/supabase/services";
import { addDays, format } from "date-fns";

type ArgProps = {
  selectedBooks: string[];
  chapterCount: number;
  startDate: Date;
  endDate: Date;
  planId: string;
  totalBooks: number;
  totalChapters: number;
};

export function forUserMade({
  selectedBooks: selected,
  chapterCount,
  startDate,
  endDate,
  planId,
  totalBooks,
  totalChapters,
}: ArgProps) {
  //get books along with chapters
  const booksWithChapters = selected
    .map((selectedBook) => {
      const selectedBookDetail = books.filter(
        ({ book: bibleBook }) => bibleBook === selectedBook
      )[0];
      const mappedDatesAndChapters: {
        status: string;
        goal: string;
        notes: string;
      }[] = Array.from({ length: selectedBookDetail.chapters }, (_, index) => {
        return {
          status: "PENDING",
          goal: `${selectedBookDetail.book} ${index + 1}`,
          notes: "",
        };
      });
      return mappedDatesAndChapters;
    })
    .flat(2);

  //distribute chapters on date
  const plan = [];
  let currentDate = startDate;

  for (let i = 0; i < booksWithChapters.length; i += chapterCount) {
    plan.push({
      date: format(currentDate, "yyyy-MM-dd"),
      items: booksWithChapters.slice(i, i + chapterCount),
    });
    currentDate = addDays(currentDate, 1);
  }

  const finalDataToInsert: CreatePlanSchedule = {
    planId: parseInt(planId!),
    startDate: format(startDate!, "yyyy-MM-dd"),
    endDate: format(endDate!, "yyyy-MM-dd"),
    schedules: plan,
    totalBooks,
    totalChapters,
    perDay: chapterCount,
    userMade: true,
    customizable: true,
  };

  return finalDataToInsert;
}

// * plan that CAN be customized
export function forCustomized(
  planItemsData: string[][],
  {
    chapterCount,
    startDate,
    endDate,
    planId,
    totalBooks,
    totalChapters,
  }: ArgProps
) {
  const planItems = planItemsData.flat(1);
  const perSession = chapterCount;

  const plan = [];
  let currentDate = startDate;

  for (let i = 0; i < planItems.length; i += perSession) {
    plan.push({
      date: format(currentDate, "yyyy-MM-dd"),
      items: planItems.slice(i, i + perSession).map((plan) => {
        return {
          goal: plan,
          status: "PENDING",
          notes: "",
        };
      }),
    });
    currentDate = addDays(currentDate, 1);
  }
  return {
    planId,
    startDate: format(startDate!, "yyyy-MM-dd"),
    endDate: format(endDate!, "yyyy-MM-dd"),
    totalBooks,
    totalChapters,
    perSession,
    userMade: false,
    customizable: true,
    schedules: plan,
  };
}

// * plan that CANNOT be customized
export function forUnCustomized(
  planItems: string[][],
  { startDate, endDate, planId, totalBooks, totalChapters }: ArgProps
) {
  const currentDate = startDate;
  return {
    planId,
    startDate: format(startDate!, "yyyy-MM-dd"),
    endDate: format(endDate!, "yyyy-MM-dd"),
    totalBooks,
    totalChapters,
    userMade: false,
    customizable: false,
    schedules: planItems.map((plans, i) => {
      return {
        userPlanId: 1,
        date: format(addDays(currentDate, i), "yyyy-MM-dd"),
        items: plans.map((plan) => {
          return {
            goal: plan,
            status: "PENDING",
            notes: "",
          };
        }),
      };
    }),
  };
}
