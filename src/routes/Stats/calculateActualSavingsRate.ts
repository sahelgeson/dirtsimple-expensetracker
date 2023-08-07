import { WEEKS_IN_A_MONTH } from 'lib/constants';
import { Dollar, IExpense } from 'interfaces';
import { timePeriodData, WEEKLY } from './context';

export const calculateActualSavingsRate = ({
  selectedPastPeriod,
  expenses,
  monthlyBudgetLimit,
}: {
  selectedPastPeriod: timePeriodData,
  expenses: IExpense[],
  monthlyBudgetLimit: Dollar,
}): number => {
  const { timePeriod, numberOfTimePeriods } = selectedPastPeriod;

  // get total of expenses over selectedPastPeriod
  const total = expenses.reduce((sum, total) => {
    return sum + Number(total.amount);
  }, 0);

  // divisor to normalize weekly timePeriods to monthly to match 'monthly'BudgetLimit
  const divisor = (timePeriod === WEEKLY) ? WEEKS_IN_A_MONTH : 1;

  // get total of set monthlyBudget over selectedPastPeriod (this is amount if savingsRate was 0%)
  const selectedPastPeriodBudget = monthlyBudgetLimit * (numberOfTimePeriods / divisor);

  const actualSavingsRate = (selectedPastPeriodBudget - total) / (selectedPastPeriodBudget);

  return actualSavingsRate;
}
