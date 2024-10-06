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

export function GenerateScheduleDataForDb({
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

  for (let i = 0; i < booksWithChapters.length; i += chapterCount) {
    plan.push({
      date: format(addDays(startDate!, i), "yyyy-MM-dd HH:mm:ss"),
      items: booksWithChapters.slice(i, i + chapterCount),
    });
  }

  const finalDataToInsert: CreatePlanSchedule = {
    planId: parseInt(planId!),
    startDate: startDate!,
    endDate: endDate!,
    schedules: plan,
    totalBooks,
    totalChapters,
    perDay: chapterCount,
  };

  return finalDataToInsert;
}
