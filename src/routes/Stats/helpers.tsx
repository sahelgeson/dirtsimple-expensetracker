import { format, sub, isWithinInterval, endOfMonth, isAfter, startOfMonth, subMonths } from 'date-fns';
import { IExpense } from 'interfaces';
import { useGlobalState } from 'contexts';
import { ONE_MONTH } from 'lib/constants';

interface IGetExpensesProps {
  selectedExpenses: IExpense[];
  selectedTimePeriod: number; 
  numOfPeriodsAgo?: number; // e.g. 0 for this past week/month, 1 for the week/month before last, etc.
  isByCalendarMonthSelected?: boolean;
}

interface IStartEndProps {
  selectedTimePeriod: number; 
  numOfPeriodsAgo?: number; // e.g. 0 for this past week/month, 1 for the week/month before last, etc.
  isByCalendarMonthSelected?: boolean;
}

interface IStartEndValue {
  startCutoff: Date;
  endCutoff: Date;
}

const getStartAndEndCutoff = ({ selectedTimePeriod, numOfPeriodsAgo = 0, isByCalendarMonthSelected }: IStartEndProps): IStartEndValue => {
  const now = useGlobalState().getGlobalNow();

  let endCutoff = sub(now, { days: (selectedTimePeriod * numOfPeriodsAgo) });
  // start is just end minus the selectedTimePeriod
  let startCutoff = sub(endCutoff, { days: selectedTimePeriod });

  if (isByCalendarMonthSelected && selectedTimePeriod === ONE_MONTH) {
    // numOfPeriodsAgo will be total # of calendar months to show (includes current month)
    // isByCalendarMonthSelected should only be used with one month selectedTimePeriod
    // endcutoff is EOM or now
    // startcutoff is FOM
    const calendarMonth = subMonths(now, numOfPeriodsAgo);
    endCutoff = endOfMonth(calendarMonth);
    if (isAfter(endCutoff, now)) { endCutoff = now; }
    startCutoff = startOfMonth(calendarMonth);
  } 
  return { startCutoff, endCutoff };
}

// TODO make this function more reusable, particularly with function in routes/Stats/Total
export const getTimeFrameExpenses = ({ selectedExpenses, selectedTimePeriod, numOfPeriodsAgo = 0, isByCalendarMonthSelected = false }: IGetExpensesProps): IExpense[] => {

  // first get start and end cutoff dates
  const { startCutoff, endCutoff } = getStartAndEndCutoff({ selectedTimePeriod, numOfPeriodsAgo, isByCalendarMonthSelected });
  // then filter expenses between start and end cutoff
  const timeFrameExpenses = selectedExpenses.filter((expense: IExpense) => {
    return isWithinInterval(
      new Date(expense.datetime),
      { start: startCutoff, end: endCutoff }
    );
  });

  return timeFrameExpenses;
}

interface IGetChartDataArrayProps {
  numOfTimePeriodsToShow: number;
  selectedExpenses: IExpense[];
  selectedTimePeriod: number;
  isByCalendarMonthSelected?: boolean;
}

// TODO move this somewhere more appropriate?
export interface IChartData {
  dateLabel: number;
  amount: number;
}

export const getChartDataArray = ({ 
  numOfTimePeriodsToShow,
  selectedExpenses,
  selectedTimePeriod,
  isByCalendarMonthSelected = false,
}: IGetChartDataArrayProps): IChartData[] => { 
  const chartData = new Map();

  for (let i = 0; i < numOfTimePeriodsToShow; i++) {
    const reversedIndex = numOfTimePeriodsToShow - i;
    const numOfPeriodsAgo = i;

    const timeFrameExpenses = getTimeFrameExpenses({ selectedExpenses, selectedTimePeriod, numOfPeriodsAgo, isByCalendarMonthSelected });

    const sum = timeFrameExpenses.reduce((sum, expense) => {
      return sum + expense.amount;
    }, 0);

    let label: number | string = reversedIndex;

    if (isByCalendarMonthSelected) {
      const now = useGlobalState().getGlobalNow();
      const labelMonth = sub(now, { months: i });
      label = format(labelMonth, 'MMM');
    }
    chartData.set(label, sum);
  }
  // TODO add typing, dateLabel: number, amount: number
  return Array.from(chartData, ([dateLabel, amount]) => ({ dateLabel, amount })).reverse();
}
