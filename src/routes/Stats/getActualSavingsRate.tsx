import { ONE_DAY, ONE_WEEK } from 'lib/constants';
import { Dollar } from 'interfaces';

interface IProps {
  selectedTimePeriod: number;
  numOfPeriods: number;
  // eslint-disable-next-line
  totals: any[]; // TODO type this better, must be array of objects with .amount property // not "must" be in this case
  monthlyBudgetLimit: Dollar;
}

export const getActualSavingsRate = (props: IProps): number => {
  const { selectedTimePeriod, numOfPeriods, totals, monthlyBudgetLimit } = props;

  let actualSavingsRate = 0;

  const total = totals.reduce((sum, total) => {
    return sum + Number(total.amount);
  }, 0);
  const averageTotal = total / numOfPeriods;

  const isOnePeriod = selectedTimePeriod === numOfPeriods;
  // default is for monthly
  // there is a slight discrepancy between 30 for month and 4 * 7 but don't care
  let budgetForTimePeriod = monthlyBudgetLimit;
  if (selectedTimePeriod === ONE_DAY || isOnePeriod) { // want daily when just ONE_PERIOD is selected
    budgetForTimePeriod = monthlyBudgetLimit / 30;
  } else if (selectedTimePeriod === ONE_WEEK) {
    budgetForTimePeriod = monthlyBudgetLimit / 4;
  }
  actualSavingsRate = (budgetForTimePeriod - averageTotal) / (budgetForTimePeriod);

  return actualSavingsRate;
}
