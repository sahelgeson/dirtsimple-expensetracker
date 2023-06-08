import { formatUsd } from 'helpers';
import { IExpense } from 'interfaces';
import { DAILY_SPECIAL_CASE, timePeriodData, WEEKLY } from './context';
import { ONE_WEEK, ONE_MONTH } from 'lib/constants';

export const calculateAverage = ({
  selectedPastPeriod,
  expenses,
}: {
  selectedPastPeriod: timePeriodData,
  expenses: IExpense[],
}): string => {
  const { numberOfTimePeriods, timePeriod, specialCase } = selectedPastPeriod;

  let numberOfPeriods = numberOfTimePeriods;
  if (specialCase === DAILY_SPECIAL_CASE) {
    numberOfPeriods = (timePeriod === WEEKLY) ? ONE_WEEK : ONE_MONTH;
  }

  const total = expenses.reduce((sum, expense) => {
    return sum + Number(expense.amount);
  }, 0);

  const avg = Number((total / numberOfPeriods).toFixed(0)); // to nearest full dollar

  return formatUsd(avg);
}
