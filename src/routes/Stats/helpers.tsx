import { sub, isWithinInterval } from 'date-fns';
import { IExpense } from 'interfaces';

interface IGetExpensesProps {
  selectedExpenses: IExpense[];
  selectedTimePeriod: number; 
  numOfPeriodsAgo?: number; // e.g. 0 for this past week/month, 1 for the week/month before last, etc.
}

// TODO make this function more reusable, particularly with function in routes/Stats/Total
export const getTimeFrameExpenses = ({ selectedExpenses, selectedTimePeriod, numOfPeriodsAgo = 0 }: IGetExpensesProps): IExpense[] => {
  const now = new Date();

  const endCutoff = sub(now, { days: (selectedTimePeriod * numOfPeriodsAgo) });
  // start is just end minus the selectedTimePeriod
  const startCutoff = sub(endCutoff, { days: selectedTimePeriod });

  const timeFrameExpenses = selectedExpenses.filter((expense: IExpense) => {
    return isWithinInterval(
      new Date(expense.datetime),
      { start: startCutoff, end: endCutoff }
    );
  });

  return timeFrameExpenses;
}

interface IGetChartDataArrayProps {
  numOfTimePeriodsToShow: number,
  selectedExpenses: IExpense[],
  selectedTimePeriod: number,
}

export interface IChartData {
  dateIndex: number;
  amount: number;
}

export const getChartDataArray = ({ 
  numOfTimePeriodsToShow,
  selectedExpenses,
  selectedTimePeriod,
}: IGetChartDataArrayProps): IChartData[] => { 
  const chartData = new Map();

  for (let i = 0; i < numOfTimePeriodsToShow; i++) {
    const reversedIndex = numOfTimePeriodsToShow - i;
    const numOfPeriodsAgo = i;
    const timeFrameExpenses = getTimeFrameExpenses({ selectedExpenses, selectedTimePeriod, numOfPeriodsAgo });

    const sum = timeFrameExpenses.reduce((sum, expense) => {
      return sum + Number(expense.amount);
    }, 0);

    // TODO change this to be datetime for axis labeling?
    chartData.set(reversedIndex, sum);
  }
  // TODO add typing, dateIndex: number, amount: number
  return Array.from(chartData, ([dateIndex, amount]) => ({ dateIndex, amount })).reverse();
}
