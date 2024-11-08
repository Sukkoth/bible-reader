import { books } from "@/lib/bible_books_list";
import { CreatePlanSchedule } from "@/utils/supabase/services";
import { addDays, format, isPast, isSameDay } from "date-fns";

type ArgProps = {
  selectedBooks: string[];
  chapterCount: number;
  startDate: Date;
  endDate: Date;
  planId: string;
  totalBooks: number;
  totalChapters: number;
  markPreviousAsComplete?: boolean;
};

export function forUserMade({
  selectedBooks: selected,
  chapterCount,
  startDate,
  endDate,
  planId,
  totalBooks,
  totalChapters,
  markPreviousAsComplete,
}: ArgProps) {
  //get books along with chapters
  const today = new Date();
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
    const date = format(currentDate, "yyyy-MM-dd");
    const markPrevious =
      markPreviousAsComplete && isPast(date) && !isSameDay(date, today);

    plan.push({
      date: date,
      items: markPrevious
        ? booksWithChapters.slice(i, i + chapterCount).map((item) => {
            return { ...item, status: "COMPLETED" };
          })
        : booksWithChapters.slice(i, i + chapterCount),
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
    markPreviousAsComplete,
  }: ArgProps
) {
  const planItems = planItemsData.flat(1);
  const perSession = chapterCount;

  const plan = [];
  let currentDate = startDate;
  const today = new Date();

  for (let i = 0; i < planItems.length; i += perSession) {
    const date = format(currentDate, "yyyy-MM-dd");
    const markPrevious =
      markPreviousAsComplete && isPast(date) && !isSameDay(date, today);

    plan.push({
      date,
      items: planItems.slice(i, i + perSession).map((plan) => {
        return {
          goal: plan,
          status: markPrevious ? "COMPLETED" : "PENDING",
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
    perDay: perSession,
    userMade: false,
    customizable: true,
    schedules: plan,
  };
}

// * plan that CANNOT be customized
export function forUnCustomized(
  planItems: string[][],
  {
    startDate,
    endDate,
    planId,
    totalBooks,
    totalChapters,
    markPreviousAsComplete,
  }: ArgProps
) {
  const currentDate = startDate;
  const today = new Date();
  return {
    planId,
    startDate: format(startDate!, "yyyy-MM-dd"),
    endDate: format(endDate!, "yyyy-MM-dd"),
    totalBooks,
    totalChapters,
    userMade: false,
    customizable: false,
    schedules: planItems.map((plans, i) => {
      const date = format(addDays(currentDate, i), "yyyy-MM-dd");
      const markPrevious =
        markPreviousAsComplete && isPast(date) && !isSameDay(date, today);
      return {
        userPlanId: 1,
        date,
        items: plans.map((plan) => {
          return {
            goal: plan,
            status: markPrevious ? "COMPLETED" : "PENDING",
            notes: "",
          };
        }),
      };
    }),
  };
}
