import { getDaysInMonth } from 'date-fns';
import CalendarStatItem from './CalendarStatItem';

type Props = {
  mapped: {
    index: number;
    date: Date;
    items: ScheduleItem[];
  }[];
};

function DailyStats({ mapped }: Props) {
  const today = new Date();
  return Array.from({ length: getDaysInMonth(new Date()) }, (_, index) => {
    const dailyData = mapped.filter((data) => data.index === index + 1);

    const target = dailyData?.[0]?.items?.length;
    const progress = dailyData?.[0]?.items?.filter(
      (daily: ScheduleItem) => daily.status === 'COMPLETED'
    ).length;
    return (
      <CalendarStatItem
        target={target}
        progress={progress}
        text={index + 1}
        key={index}
        rangeColor
        startWithRed={target > 0 && today.getDate() > index}
      />
    );
  });
}

export default DailyStats;
