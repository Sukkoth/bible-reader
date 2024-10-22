import React from "react";
import { categorizedBooks } from "@/lib/bible_books_list";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";

type Displaying = "stats" | "old" | "new";
type Props = {
  displaying: Displaying;
  completed: string[]; //array of completed books
};

function ListBooks({ displaying, completed }: Props) {
  const router = useRouter();

  const allCategories = Object.keys(categorizedBooks);
  const categoryToDisplay =
    displaying === "old" ? allCategories.slice(0, 4) : allCategories.slice(4);
  return (
    <div>
      {categoryToDisplay.map((category: string) => {
        const books = categorizedBooks[category];
        return (
          <div className='my-5' key={category}>
            <h1>{category}</h1>
            <div className='grid grid-cols-2 xs:grid-cols-4 sm:grid-cols-5 gap-2 p-3'>
              {books.map((book) => {
                return (
                  <Button
                    onClick={() => router.push(`/bible-tracker/${book.book}`)}
                    variant={
                      completed.includes(book.book) ? "default" : "secondary"
                    }
                    key={book.book}
                    className='size-20 text-xs px-3'
                  >
                    {book.bookShort}
                  </Button>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default ListBooks;
