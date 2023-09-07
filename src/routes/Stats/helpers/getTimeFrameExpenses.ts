import { isWithinInterval } from 'date-fns';
import { IExpense } from 'interfaces';

/* 
  Filters given expenses that were made within selected time frame
*/
export const getTimeFrameExpenses = ({ 
  selectedExpenses, 
  startCutoff,
  endCutoff,
}: {
  selectedExpenses: IExpense[],
  startCutoff: Date,
  endCutoff: Date,
}): IExpense[] => {
  // filter expenses between start and end cutoff
  const timeFrameExpenses = selectedExpenses.filter((expense: IExpense) => {
    // isWithinInterval is inclusive
    //console.log({ startCutoff, endCutoff })
    //console.count('xkcd')
    return isWithinInterval(
      new Date(expense.datetime),
      { start: startCutoff, end: endCutoff }
    );
  });

  return timeFrameExpenses;
}
