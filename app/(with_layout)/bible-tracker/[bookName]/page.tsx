import BackButton from "@/components/BackButton";
import Chapters from "@/components/BibleTracker/Chapters";
import { books } from "@/lib/bible_books_list";
import { GET_BOOK_PROGRESS } from "@/utils/supabase/services";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import React from "react";

export const metadata: Metadata = {
  title: "Bible Reader | Tracker",
  description: "Track your bible reading progress.",
};

//generate bookName params since they are already known
export async function generateStaticParams() {
  return books.map((book) => ({
    bookName: book.book,
  }));
}

type Props = {
  params: { bookName: string };
};
type Progress = Pick<BookProgress, "progress">;

async function Page({ params }: Props) {
  const bookName = params.bookName.replace("%20", " ");

  const foundBook = books.filter(
    (bibleBook) =>
      bibleBook.book.toLocaleLowerCase() ===
      bookName.replace("%20", " ").toLocaleLowerCase()
  );

  if (!foundBook.length || foundBook.length > 1) {
    return notFound();
  }
  const book = foundBook[0];
  const data = (await GET_BOOK_PROGRESS(book.book)) as BookProgress[];
  let bookProgress: Progress;
  if (data.length) {
    bookProgress = { progress: data[0].progress };
  } else {
    bookProgress = { progress: [] };
  }

  return (
    <div>
      <BackButton />
      <div className='py-5'>
        <h1 className='text-sm xxs:text-xl xs:text-2xl'>{bookName}</h1>
      </div>
      <div>
        <Chapters
          book={book.book}
          length={book.chapters}
          progress={bookProgress.progress}
          id={data[0]?.id}
        />
      </div>
    </div>
  );
}

export default Page;
