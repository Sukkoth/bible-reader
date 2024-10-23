import BackButton from "@/components/BackButton";
import BibleTracker from "@/components/BibleTracker";
import ResetStatsButton from "@/components/BibleTracker/ResetStatsButton";
import { books as bibleBooks } from "@/lib/bible_books_list";
import {
  GET_BOOKS_PROGRESS,
  GET_COMPLETED_BOOKS,
} from "@/utils/supabase/services";
import React from "react";

type BibleBook = {
  book: string;
  bookShort: string;
  verses: number;
  chapters: number;
};
async function Page() {
  const completedBooks = (await GET_COMPLETED_BOOKS()) as string[];
  const stats = await GET_BOOKS_PROGRESS();

  //categorize to OT and NT
  const oldTestamentItems: BookProgress[] = [];
  const newTestamentItems: BookProgress[] = [];
  stats?.forEach((book: BookProgress) => {
    const index = bibleBooks.findIndex(
      (bibleBook: BibleBook) => bibleBook.book === book.book
    );
    if (index !== -1 && index < 39) {
      oldTestamentItems.push(book);
    } else if (index >= 39) {
      newTestamentItems.push(book);
    } else {
      console.log(book.book, " is not assignable to categories");
    }
  });

  //chapter stats
  const oldTestamentChapters = oldTestamentItems.reduce((acc, curr) => {
    return (acc += curr.progress.length);
  }, 0);
  const newTestamentChapters = newTestamentItems.reduce((acc, curr) => {
    return (acc += curr.progress.length);
  }, 0);

  const chapters = {
    oldTestament: oldTestamentChapters,
    newTestament: newTestamentChapters,
    wholeBible: oldTestamentChapters + newTestamentChapters,
  };

  // book stats
  const oldTestamentBooks = oldTestamentItems.reduce((acc, curr) => {
    return (acc += curr.completedAt !== null ? 1 : 0);
  }, 0);

  const newTestamentBooks = newTestamentItems.reduce((acc, curr) => {
    return (acc += curr.completedAt !== null ? 1 : 0);
  }, 0);

  const books = {
    oldTestament: oldTestamentBooks,
    newTestament: newTestamentBooks,
    wholeBible: oldTestamentBooks + newTestamentBooks,
  };

  const fullStats = { chapters, books };
  return (
    <div>
      <BackButton />
      <div className='py-5'>
        <h1 className='text-sm xxs:text-xl xs:text-2xl'>Bible Tracker</h1>
      </div>
      <BibleTracker completed={completedBooks} stats={fullStats} />
      <div className='mt-5'>
        <ResetStatsButton />
      </div>
    </div>
  );
}

export default Page;
