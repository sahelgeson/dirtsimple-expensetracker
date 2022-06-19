import styled from 'styled-components';
import { sub, isAfter } from 'date-fns';
import { useGlobalState } from 'contexts';
//import { IExpense } from 'interfaces';
import { formatUsd } from 'helpers';
import { test_state } from 'test-state.js';

const TotalStyled = styled.h4`
  font-size: 1rem;
  text-align: right;
  margin: 1.5rem;
  margin-right: 0;

  span {
    margin-left: 1rem;
  }
`;

interface IProps {
  selectedTimePeriod: number;
}

export const Total = (props: IProps): JSX.Element => {
  const { allExpenses } = useGlobalState();
  const { selectedTimePeriod } = props;

  // TODO make this function more reusable, particularly with function in routes/Stats/CategoryStats
  const timeFrameExpenses = allExpenses.filter((expense) => {
    let now = new Date();
    // TODO centralize testing related code
    if (process.env.REACT_APP_TESTING === 'development') {
      const lastTestDate = test_state.allExpenses[0].datetime;
      now = new Date(lastTestDate);
    }
    const cutoff = sub(now, { days: selectedTimePeriod });
    return (isAfter(new Date(expense.datetime), cutoff));
  });

  // TODO change var name more generic/reusable
  const totalPastTimeFrame = timeFrameExpenses.reduce((sum, expense) => {
    return sum + Number(expense.amount);
  }, 0);

  return (
    <TotalStyled>Total spending: <span>{formatUsd(totalPastTimeFrame)}</span></TotalStyled>
  );
}
