import { formatUsd } from 'helpers';

interface IProps {
  numOfPeriods: number;
  // eslint-disable-next-line
  totals: any[]; // TODO type this better, must be array of objects with .amount property
}

export const getChartAverage = (props: IProps): string => {
  const { numOfPeriods, totals } = props;

  const total = totals.reduce((sum, total) => {
    return sum + Number(total.amount);
  }, 0);

  const avg = Number((total / numOfPeriods).toFixed(0)); // to nearest full dollar

  return formatUsd(avg);
}
