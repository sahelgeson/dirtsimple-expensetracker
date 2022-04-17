import { useState } from 'react';
import styled from 'styled-components';
import { useGlobalState } from 'contexts';
import { TotalChart } from './TotalChart';
import { formatUsd } from 'helpers';
import { getTimeFrameExpenses } from './helpers';
import { IExpense } from 'interfaces';

const ListItemWrapper = styled.ul`
  margin-top: 0.5rem;
`;

const ListItemTotal = styled.li`
  padding-top: 0.75rem;
  padding-bottom: 0.75rem;
  width: 100%;
  display: flex;
  border-bottom: 1px solid #ccc;

  font-weight: bold;
  h4 {
    font-weight: bold;
  }
  span {
    margin-left: auto;
  }
`;

interface IProps {
  selectedTimePeriod: number;
}

export const TotalStats = (props: IProps): JSX.Element => {
  const { allExpenses } = useGlobalState();
  const { selectedTimePeriod } = props;

  const [open, setOpen] = useState(false);

  const timeFrameExpenses = getTimeFrameExpenses({ selectedExpenses: allExpenses, selectedTimePeriod });

  const getTotal = (timeFrameExpenses: IExpense[]): number => {
    const total = timeFrameExpenses.reduce((sum, expense) => {
      return sum + Number(expense.amount);
    }, 0);
    return total;
  } 

  const total = getTotal(timeFrameExpenses);

  const openChart = () => {
    setOpen((prev) => !prev);
  }

  return (
    <>
      <ListItemWrapper>
        <ListItemTotal onClick={openChart}>
          <h4>Total</h4>
          <span>{formatUsd(total, { noPrefix: true })}</span>
        </ListItemTotal>
      </ListItemWrapper>
      
      {open && (    
        <TotalChart 
          selectedExpenses={timeFrameExpenses} 
          selectedTimePeriod={selectedTimePeriod}
        />
      )}
    </>
  );
}
