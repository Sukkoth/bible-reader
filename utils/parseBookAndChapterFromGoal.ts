import { books } from "@/lib/bible_books_list";
export function parseBookAndChapterFromGoal(
  planItem: string
): { book: string; chapter: number } | null {
  // Ignore items with ":" or "-"
  if (planItem.includes(":") || planItem.includes("-")) return null;

  // Split by space and take last part as chapter
  const parts = planItem.split(" ");
  const chapter = parseInt(parts.pop() || "", 10);

  // Ensure the chapter is a valid number
  if (isNaN(chapter)) return null;

  // Join remaining parts as book name
  const book = parts.join(" ");
  if (
    books.filter(
      (bibleBook) => bibleBook.book.toLowerCase() === book.toLowerCase()
    ).length !== 1
  ) {
    return null;
  }

  return { book, chapter };
}
