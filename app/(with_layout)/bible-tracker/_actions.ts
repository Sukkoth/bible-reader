"use server";
import { books } from "@/lib/bible_books_list";
import {
  GET_BOOK_PROGRESS,
  MARK_BOOK_CHAPTER,
  MarkChapterBook,
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
