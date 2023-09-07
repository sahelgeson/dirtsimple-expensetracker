import { IExpense } from 'interfaces';
import { formatUsd } from 'helpers';
import { calculateTotal } from '../helpers';

export const getTotalAndDifference = ({ 
  timeFrameExpenses, 
  prevTimeFrameExpenses,
}: {
  timeFrameExpenses: IExpense[],
  prevTimeFrameExpenses: IExpense[],
}) => {
  const total = calculateTotal(timeFrameExpenses);
  const prevTotal = calculateTotal(prevTimeFrameExpenses);
  const difference = total - prevTotal;   // TODO xkcd check for IEEE floating point errors
  const isPositiveDifference = difference > 0;
  let formatDifference = formatUsd(difference, { noPrefix: true });
  formatDifference = `${isPositiveDifference ? '+' : ''}${formatDifference}`;

  return { total, isPositiveDifference, formatDifference };
}
