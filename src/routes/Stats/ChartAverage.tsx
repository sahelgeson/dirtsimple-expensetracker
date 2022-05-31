import { ReactNode } from 'react';
import styled from 'styled-components';
import { formatUsd } from 'helpers';

const Average = styled.div`
  color: #777;
  font-size: 12px;

  strong {
    color: inherit;
  }
`

interface IProps {
  children?: ReactNode;
  numOfPeriods: number;
  // eslint-disable-next-line
  totals: any[]; // TODO type this better, must be array of objects with .amount property
}

export const ChartAverage = (props: IProps): JSX.Element => {
  const { numOfPeriods, totals } = props;

  const total = totals.reduce((sum, total) => {
    return sum + Number(total.amount);
  }, 0);

  const avg = Number((total / numOfPeriods).toFixed(0)); // to nearest full dollar

  return (
    <Average>{props.children} <strong>{formatUsd(avg)}</strong></Average>
  );
}
