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
          <div className='my-3' key={category}>
            <h1>{category}</h1>
            <div className='grid grid-cols-3 xxs:grid-cols-5 sm:grid-cols-6 md:grid-cols-8 gap-2 py-2'>
              {books.map((book) => {
                return (
                  <Button
                    onClick={() => router.push(`/bible-tracker/${book.book}`)}
                    variant={
                      completed.includes(book.book) ? "default" : "secondary"
                    }
                    key={book.book}
                    className='w-full h-full aspect-square text-xs px-3 hover:scale-110 duration-500 transition-transform'
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
