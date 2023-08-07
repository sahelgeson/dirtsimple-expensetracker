import { sub, startOfDay, endOfDay, startOfYear } from 'date-fns';
import { ONE_WEEK, ONE_MONTH } from 'lib/constants';
import { WEEKLY, YTD_SPECIAL_CASE, timePeriodData } from './context';

interface IStartEndValue {
  startCutoff: Date;
  endCutoff: Date;
}

export const getStartAndEndCutoff = ({
  now,
  selectedPastPeriod,
  newEndDate = undefined,  
}: {
  now: Date,
  selectedPastPeriod: timePeriodData,
  newEndDate?: Date,
}): IStartEndValue => {
  const { numberOfTimePeriods, timePeriod, specialCase } = selectedPastPeriod;

  const endCutoff = newEndDate ?? endOfDay(now);
  // start is just end minus timePeriodData except for YTD which is Jan. 1
  let startCutoff = now;
  let daysInPast;

  const daysMultiplier = (timePeriod === WEEKLY) ? ONE_WEEK : ONE_MONTH;
  daysInPast = numberOfTimePeriods * daysMultiplier;
  /* 
    have to subtract one day, for example: if today is Monday, we want to start on Tuesday:
    Tues Wed Thu Fri Sat Sun Mon -- that's 7 days including today 
    if date-fns sub is { days: 1 }, it returns Sun, so you can extrapolate from there
  */
  daysInPast = daysInPast - 1;

  startCutoff = startOfDay(sub(endCutoff, { days: daysInPast }));

  if (specialCase === YTD_SPECIAL_CASE) {
    let jan1thisYear = startOfYear(now);

    if (newEndDate) {
      jan1thisYear = startOfYear(endCutoff);
    }
    startCutoff = startOfDay(jan1thisYear);
  }
  startCutoff = startOfDay(startCutoff);

  return { startCutoff, endCutoff };
}
