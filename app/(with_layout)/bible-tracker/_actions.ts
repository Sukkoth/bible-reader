"use server";
import { books } from "@/lib/bible_books_list";
import {
  GET_BOOK_PROGRESS,
  MARK_ALL_CHAPTERS_IN_BOOK,
  MARK_BOOK_CHAPTER,
  MarkChapterBook,
  RESET_BIBLE_READING_PROGRESS,
} from "@/utils/supabase/services";
import { revalidatePath } from "next/cache";

export async function markChapter(args: MarkChapterBook) {
  try {
    await MARK_BOOK_CHAPTER(args);
    revalidatePath("/bible-tracker/" + args.book);
    return {
      success: true,
    };
  } catch (error) {
    return {
      success: false,
      error: typeof error === "string" ? error : "Could not update progress",
    };
  }
}

type Progress = Pick<BookProgress, "progress">;
export async function handleAddItemToReadList(book: string, chapter: number) {
  const bookLength = books.filter((bibleBook) => bibleBook.book === book)?.[0]
    .chapters;
  if (!bookLength) {
    return;
  }
  //fetch the row using user id and book name
  const data = (await GET_BOOK_PROGRESS(book)) as BookProgress[];
  let bookProgress: Progress;
  if (data.length) {
    bookProgress = { progress: data[0].progress };
  } else {
    bookProgress = { progress: [] };
  }
  const progress = bookProgress.progress;

  const foundChapter = progress.findIndex(
    (progressItem) => progressItem.chapter === chapter
  );
  //if it's not found it means that it is not read, so add it
  if (foundChapter === -1) {
    const dataToPass: MarkChapterBook = {
      id: data[0]?.id,
      book,
      progress: [...progress, { chapter, status: "COMPLETED" }],
      markAsComplete: false,
    };

    dataToPass.markAsComplete = dataToPass.progress.length === bookLength;

    const result = await markChapter(dataToPass);

    return result;
  }
  //
}

export async function resetBibleReadingStats(): Promise<{
  success: boolean;
  error?: string;
}> {
  const { error } = await RESET_BIBLE_READING_PROGRESS();
  if (error) {
    return { success: false, error: error?.message || "Something went wrong!" };
  }
  revalidatePath("/bible-tracker");
  return { success: true };
}

export async function markAllChaptersInBook({
  bookName,
  progressId,
}: {
  bookName: string;
  progressId?: number;
}): Promise<{
  success: boolean;
  error?: string;
}> {
  const book = books.find((bibleBook) => bibleBook.book === bookName);
  if (!book) {
    return {
      success: false,
      error: "No book found",
    };
  }

  const dataToInsert: Pick<BookProgress, "book" | "progress"> & {
    id?: number;
  } = {
    id: progressId,
    book: bookName,
    progress: Array.from(
      { length: book.chapters },
      (_, index) => index + 1
    ).map((chapter) => ({
      chapter,
      status: "COMPLETED",
    })),
  };

  const result = await MARK_ALL_CHAPTERS_IN_BOOK(dataToInsert);
  if (result?.error) {
    return {
      success: false,
      error: result?.error?.message || "Something went wrong!",
    };
  }
  revalidatePath("/bible-tracker/" + bookName);
  return { success: true };
}
