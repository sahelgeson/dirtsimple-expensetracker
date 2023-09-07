import { WEEKS_IN_A_MONTH } from 'lib/constants';
import { Dollar, IExpense } from 'interfaces';
import { MONTHLY, timePeriodData, WEEKLY, YTD_SPECIAL_CASE } from '../context';
import { getNumberOfYtdTimePeriods } from 'routes/Stats/helpers';

export const calculateActualSavingsRate = ({
  now,
  selectedPastPeriod,
  expenses,
  monthlyBudgetLimit,
}: {
  now: Date,
  selectedPastPeriod: timePeriodData,
  expenses: IExpense[],
  monthlyBudgetLimit: Dollar,
}): number => {
  const { timePeriod, numberOfTimePeriods, specialCase } = selectedPastPeriod;

  // get total of expenses over selectedPastPeriod
  const total = expenses.reduce((sum, total) => {
    return sum + Number(total.amount);
  }, 0);

  // divisor to normalize weekly timePeriods to monthly to match 'monthly'BudgetLimit
  let divisor = (timePeriod === WEEKLY) ? WEEKS_IN_A_MONTH : 1;
  let numberOfPeriods = numberOfTimePeriods;

  // YTD savings rate will be different b/w weekly and monthly since
  // weekly will have the rate for e.g. 8.5 months while monthly will have it for 8 months
  // that looks weird so just use the more accurate weekly YTD calc for monthly YTD
  if (specialCase === YTD_SPECIAL_CASE && timePeriod === MONTHLY) {
    numberOfPeriods = getNumberOfYtdTimePeriods({ now, timePeriod: WEEKLY });
    divisor = WEEKS_IN_A_MONTH;
  }

  // get total of set monthlyBudget over selectedPastPeriod (this is amount if savingsRate was 0%)
  const selectedPastPeriodBudget = monthlyBudgetLimit * (numberOfPeriods / divisor);

  const actualSavingsRate = (selectedPastPeriodBudget - total) / (selectedPastPeriodBudget);

  return actualSavingsRate;
}
