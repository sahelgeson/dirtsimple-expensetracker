import { useState } from 'react';
import styled from 'styled-components';
import { ListItemGrid } from './styles';
import { useGlobalState } from 'contexts';
import { CategoryStats } from './CategoryStats';
import { Total } from './Total';

const ButtonBox = styled.div`
  display: flex;
  justify-content: space-around;
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

const ListHeader = styled.h4`
  ${ListItemGrid}
`;

export const Stats = (): JSX.Element => {
  const { allCategories } = useGlobalState();

  const DEFAULT_TIME_FRAME_IN_DAYS = 30;

  const [selectedTimePeriod, setSelectedTimePeriod] = useState(DEFAULT_TIME_FRAME_IN_DAYS);

  // filter any categories out (currently none filtered out)
  // TODO remember to handle case if there are no categories in timeFrameExpenses
  // show zero for those cases
  const filteredCategories = allCategories;

  // add these two to filteredCategories?

  return (
    <div className="container margin-0-auto phl">
      <ButtonBox>
        <TimeFrameButton
          className={selectedTimePeriod === 30 ? 'active' : ''}
          onClick={() => setSelectedTimePeriod(30)}
        >
          Past 30 days
        </TimeFrameButton>
        <TimeFrameButton
          className={selectedTimePeriod === 7 ? 'active' : ''}
          onClick={() => setSelectedTimePeriod(7)}
        >
          Past week
        </TimeFrameButton>
      </ButtonBox>
      
      <Total selectedTimePeriod={selectedTimePeriod} />

      <ListHeader>
        <span>Category</span>
        <span className="text-right">Amt change</span>
        <span className="text-right">Total</span>
      </ListHeader>
      <ul className="mobile-margin-bottom">
        {filteredCategories.map((category) => {
          return (
            <CategoryStats 
              key={category.id}
              category={category}
              selectedTimePeriod={selectedTimePeriod} 
            />
          )
        })}
      </ul>
    </div>
  );
}
