import { useState } from 'react';
import styled from 'styled-components';
import { useGlobalState } from 'contexts';
import { ListItemGrid } from './styles';
import { CategoryChart } from './CategoryChart';
import { formatUsd } from 'helpers';
import { getTimeFrameExpenses } from './helpers';
import { ICategory, IExpense } from 'interfaces';

const ListItem = styled.li`
  padding-top: 0.75rem;
  padding-bottom: 0.75rem;
  width: 100%;
  ${ListItemGrid}
  border-bottom: 1px solid #ccc;
`;

interface IProps {
  category: ICategory;
  selectedTimePeriod: number;
}

export const CategoryStats = (props: IProps): JSX.Element => {
  const { allExpenses } = useGlobalState();
  const { category, selectedTimePeriod } = props;

  const [open, setOpen] = useState(false);

  const timeFrameExpenses = getTimeFrameExpenses({ selectedExpenses: allExpenses, selectedTimePeriod });

  const getCategoryTotal = (category: ICategory, timeFrameExpenses: IExpense[]): number => {
    const total = timeFrameExpenses.reduce((sum, expense) => {
      if (expense.categoryId === category.id) {
        return sum + Number(expense.amount);
      }
      return sum;    
    }, 0);
    return total;
  } 

  // selectedTimePeriod is a hidden dep here, should expenses be filtered out before passed in here?
  // this must have the prevTimeFrame expenses though
  const getCategoryPrevTotal = (category: ICategory, allExpenses: IExpense[]): number => {
    const numOfPeriodsAgo = 1;
    const prevTimeFrameExpenses = getTimeFrameExpenses({ selectedExpenses: allExpenses, selectedTimePeriod, numOfPeriodsAgo });
    return getCategoryTotal(category, prevTimeFrameExpenses);
  }

  const getDifference = (category: ICategory, timeFrameExpenses: IExpense[], allExpenses: IExpense[]): number => {
    return getCategoryTotal(category, timeFrameExpenses) - getCategoryPrevTotal(category, allExpenses);
  }

  const total = getCategoryTotal(category, timeFrameExpenses);
  const difference = getDifference(category, timeFrameExpenses, allExpenses);
  const isPositiveDifference = difference > 0;
  let formatDifference = formatUsd(difference, { noPrefix: true });
  formatDifference = `${isPositiveDifference ? '+' : ''}${formatDifference}`;

  const openChart = () => {
    setOpen((prev) => !prev);
  }

  const selectedExpenses: IExpense[] = allExpenses.filter((expense) => {
    return expense.categoryId === category.id;
  });

  return (
    <>
      <ListItem onClick={openChart}>
        <span>{category.name}</span>

        <span className="text-right italic">
          <span className={isPositiveDifference ? `bad`: `good`}>{formatDifference}</span>
        </span>
        <span className="text-right">{formatUsd(total, { noPrefix: true })}</span>
      </ListItem>

      {open && (
        <CategoryChart 
          selectedExpenses={selectedExpenses} 
          allExpenses={allExpenses}
          selectedTimePeriod={selectedTimePeriod}
        />
      )}
    </>
  );
}
