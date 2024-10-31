import React from "react";
import StatProgressItem from "./StatProgressItem";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import PlanDetailItem from "../PlanDetailItem";
import { Book, BookOpen } from "lucide-react";

type StatItemProp = {
  oldTestament: number;
  newTestament: number;
  wholeBible: number;
};
type Props = {
  stats: {
    chapters: StatItemProp;
    books: StatItemProp;
  };
};
function Stats({ stats }: Props) {
  const progressItems = [
    {
      progress: stats.chapters.oldTestament,
      target: 929,
      label: "Old Testament",
    },
    {
      progress: stats.chapters.newTestament,
      target: 260,
      label: "New Testament",
    },
    {
      progress: stats.chapters.wholeBible,
      target: 1189,
      label: "Whole Bible",
    },
  ];

  const bookStats = [
    {
      header: "OT Books",
      subText: `${stats.books.oldTestament}/39`,
      icon: <Book className='size-5' />,
    },
    {
      header: "NT Books",
      subText: `${stats.books.newTestament}/27`,
      icon: <Book className='size-5' />,
    },
    {
      header: "Total Books",
      subText: `${stats.books.wholeBible}/66`,
      icon: <Book className='size-5' />,
    },
  ];

  const chapterStats = [
    {
      header: "OT Chapters",
      subText: `${stats.chapters.oldTestament}/929`,
      icon: <BookOpen className='size-5' />,
    },
    {
      header: "NT Chapters",
      subText: `${stats.chapters.newTestament}/260`,
      icon: <BookOpen className='size-5' />,
    },
    {
      header: "Total Chapters",
      subText: `${stats.chapters.wholeBible}/1189`,
      icon: <BookOpen className='size-5' />,
    },
  ];

  return (
    <>
      <Card className='bg-card pt-3'>
        <CardContent className='grid grid-cols-3 gap-4 mx-auto'>
          {progressItems.map((item) => (
            <StatProgressItem {...item} key={item.label} />
          ))}
        </CardContent>
      </Card>

      <Card className='mt-5'>
        <CardHeader>
          <CardTitle>Books</CardTitle>
        </CardHeader>
        <CardContent className='grid grid-cols-3 gap-3'>
          {bookStats.map((book) => (
            <PlanDetailItem {...book} key={book.header} />
          ))}
        </CardContent>
      </Card>

      <Card className='mt-5'>
        <CardHeader>
          <CardTitle>Chapters</CardTitle>
        </CardHeader>
        <CardContent className='grid grid-cols-3 gap-3'>
          {chapterStats.map((chapter) => (
            <PlanDetailItem {...chapter} key={chapter.header} />
          ))}
        </CardContent>
      </Card>
    </>
  );
}

export default Stats;
