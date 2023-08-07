import { differenceInCalendarWeeks, differenceInCalendarMonths, getDay, startOfYear } from 'date-fns';
import { WEEKLY, MONTHLY } from './context';

type timePeriodType = typeof WEEKLY | typeof MONTHLY;

export const getNumberOfYtdTimePeriods = ({ 
  now, 
  timePeriod 
}: { 
  now: Date, 
  timePeriod: timePeriodType 
}) => {
  let numberOfTimePeriods = 0;
  const jan1thisYear = startOfYear(now);

  if (timePeriod === WEEKLY) {
    const jan1day = getDay(jan1thisYear);
    numberOfTimePeriods = differenceInCalendarWeeks(
      now,
      jan1thisYear,
      { weekStartsOn: jan1day }
    )
  } else if (timePeriod === MONTHLY) {
    numberOfTimePeriods = differenceInCalendarMonths(now, jan1thisYear) ;
  }
  // minimum 1 numberOfTimePeriods, want + 1 in all cases
  numberOfTimePeriods = numberOfTimePeriods + 1;

  return numberOfTimePeriods;
}

