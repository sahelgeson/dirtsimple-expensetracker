import { format, add, sub, isWithinInterval, isAfter, startOfDay, endOfDay } from 'date-fns';
import { IExpense } from 'interfaces';
import { ONE_WEEK, ONE_MONTH } from 'lib/constants';
import { timePeriodData, DAILY_SPECIAL_CASE, WEEKLY, MONTHLY, YTD_SPECIAL_CASE } from './context';
import { getStartAndEndCutoff } from './getStartAndEndCutoff';

export interface IChartData {
  dateLabel: number;
  amount: number;
}

export const transformToChartDataArray = ({ 
  now,
  selectedPastPeriod,
  selectedExpenses,   // allExpensesFiltered for TotalChart
}: {
  now: Date,
  selectedExpenses: IExpense[],
  selectedPastPeriod: timePeriodData,
}): IChartData[] => { 
  const chartData = new Map();
  const { numberOfTimePeriods, timePeriod, specialCase } = selectedPastPeriod;
  const { startCutoff } = getStartAndEndCutoff({ now, selectedPastPeriod }); 

  let nextStartDate = startCutoff;

  let numberOfBars = numberOfTimePeriods;
  const dailySpecialCase = specialCase === DAILY_SPECIAL_CASE;
  const ytdSpecialCase = specialCase === YTD_SPECIAL_CASE;
  // if default choice of one we want to show daily totals
  if (dailySpecialCase)  {
    numberOfBars = (timePeriod === WEEKLY) ? ONE_WEEK : ONE_MONTH;
  }

  for (let i = 1; i <= numberOfBars; i++) {
    let label: string;
    let addOptions = {}; // TODO type better to date-fns add param

    if (dailySpecialCase) {
      addOptions = { days: 1 };
    } else if (timePeriod === WEEKLY) { 
      addOptions = { days: ONE_WEEK };
    } else if (timePeriod === MONTHLY) {
      if (ytdSpecialCase) {
        addOptions = { months: 1 };
      } else {
        addOptions = { days: ONE_MONTH };
      }
    }

    const thisStartDate: Date = startOfDay(nextStartDate);
    let endDate: Date = endOfDay(add(thisStartDate, addOptions));
    if (dailySpecialCase) {
      endDate = endOfDay(thisStartDate);
    }

    // isWithinInterval is inclusive so this would include the first day of the next
    // period, which we don't want. This doesn't miss the first day of the next period
    // since that is the start of the next time period
    if (!dailySpecialCase && i !== numberOfTimePeriods) {
      endDate = sub(endDate, { days: 1 });
    }

    // would only be an issue for YTD options
    if (isAfter(endDate, now)) { endDate = endOfDay(now); }

    nextStartDate = add(endDate, { days: 1 }); // not great but avoids recursion

    const sum = selectedExpenses.reduce((sum, expense) => {
      if (isWithinInterval(
        new Date(expense.datetime),
        { start: thisStartDate, end: endDate }
      )) {
        return sum + expense.amount;
      } else { 
        return sum; 
      }
    }, 0);

    if (ytdSpecialCase) {
      label = format(thisStartDate, 'MMM');
    } else {
      // TODO this should better correspond to date/day for weeks, months are tricky
      label = (i).toString(); // TODO make a day initial for label
    }

    chartData.set(label, sum);
  }

  return Array.from(chartData, ([dateLabel, amount]) => ({ dateLabel, amount }));
}
