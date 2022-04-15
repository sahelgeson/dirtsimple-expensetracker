import { useState } from 'react';
import styled, { css } from 'styled-components';
import { sub, isAfter } from 'date-fns';
import { useGlobalState } from 'contexts';
import { ICategory, IExpense } from 'interfaces';

const ButtonBox = styled.div`
  display: flex;
  justify-content: space-around;
`;

const Total = styled.h4`
  font-size: 1rem;
  text-align: right;
  margin: 1.5rem;
  margin-right: 0;

  span {
    margin-left: 1rem;
  }
`;

const TimeFrameButton = styled.button`
  padding: 0.5rem;
  width: 100%;
  color: #777;
  border-bottom: 2px solid transparent;
  &.active {
    border-bottom: 2px solid #999;
  }
`;

const ListItemGrid = css`
  display: grid;
  grid-template-columns: 50% 25% 25%;
`;

const ListHeader = styled.h4`
  ${ListItemGrid}
`;

const ListItem = styled.li`
  margin-top: 0.75rem;
  margin-bottom: 0.75rem;
  width: 100%;
  ${ListItemGrid}
`;

// TODO improve this
const formatUsd = (dollars: number) => {
  return dollars ? `$${dollars.toFixed(2)}` : '---';
}

export const Stats = (): JSX.Element => {

  const { allExpenses, allCategories } = useGlobalState();

  const DEFAULT_TIME_FRAME_IN_DAYS = 30;

  const [selectedTimeFrame, setSelectedTimeFrame] = useState(DEFAULT_TIME_FRAME_IN_DAYS);

  // first get all expenses in the last timeframe (30 days)
  const timeFrameExpenses = allExpenses.filter((expense: IExpense) => {
    const now = new Date();
    const cutoff = sub(now, { days: selectedTimeFrame });

    return (isAfter(new Date(expense.datetime), cutoff));
  });

  // TODO change var name more generic/reusable
  const totalPastTimeFrame = timeFrameExpenses.reduce((sum, expense) => {
    return sum + Number(expense.amount);
  }, 0);


  // filter any categories out (currently none filtered out)
  // TODO remember to handle case if there are no categories in timeFrameExpenses
  // show zero for those cases
  const filteredCategories = allCategories;

  // get total


  // add these two to filteredCategories?

  const getCategoryTotal = (category: ICategory): number => {
    const total = timeFrameExpenses.reduce((sum, expense) => {
      if (expense.categoryId === category.id) {
        return sum + Number(expense.amount);
      }
      return sum;    
    }, 0);
    return total;
  } 

  const getCategoryAvg = (category: ICategory): number => {
    const total = getCategoryTotal(category);
    return (total / selectedTimeFrame);
  }

  return (
    <div className="container margin-0-auto phl">
      <h2 className="mtl text-center bold">
        Stats
      </h2>

      <ButtonBox>
        <TimeFrameButton
          className={selectedTimeFrame === 30 ? 'active' : ''}
          onClick={() => setSelectedTimeFrame(30)}
        >
          Past 30 days
        </TimeFrameButton>
        <TimeFrameButton
          className={selectedTimeFrame === 7 ? 'active' : ''}
          onClick={() => setSelectedTimeFrame(7)}
        >
          Past week
        </TimeFrameButton>
      </ButtonBox>
      
      <Total>Total spending: <span>{formatUsd(totalPastTimeFrame)}</span></Total>

      <ListHeader>
        <span>Category</span>
        <span className="text-right">Avg. per day</span>
        <span className="text-right">Total</span>
      </ListHeader>
      <ul>
        {filteredCategories.map((category) => {
          const avg = getCategoryAvg(category);
          const total = getCategoryTotal(category);
          return (
            <ListItem key={category.id}>
              <span>{category.name}:</span>
              <span className="text-right">{formatUsd(avg)}</span>
              <span className="text-right">{formatUsd(total)}</span>
            </ListItem>
          )
        })}
      </ul>

    </div>
  );
}
