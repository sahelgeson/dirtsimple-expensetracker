import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Divider } from '@chakra-ui/react';
import { useGlobalState } from 'contexts';
import { TotalChart } from './TotalChart';
import { formatUsd } from 'helpers';
import { getTimeFrameExpenses } from './helpers';
import { IExpense } from 'interfaces';
import { ONE_MONTH, DEFAULT_NUM_OF_TIME_PERIODS } from 'lib/constants';
import { SelectedChartFilter } from './types';
import { ButtonBox, TimeFrameButton } from './styles';

const ListItemWrapper = styled.ul`
  margin-top: 0.5rem;
`;

const ListItemTotal = styled.li`
  padding-top: 0.75rem;
  padding-bottom: 0.75rem;
  width: 100%;
  display: flex;
  align-items: end;

  font-weight: bold;
  h4 {
    font-weight: bold;
  }
  .right {
    margin-left: auto;
  }
`;

const TimeFrameButtonStyled = styled(TimeFrameButton)`
  font-size: 12px;
`;

interface IProps {
  selectedTimePeriod: number;
}

/* helper functions */
const getTotal = (timeFrameExpenses: IExpense[]): number => {
  const total = timeFrameExpenses.reduce((sum, expense) => {
    return sum + Number(expense.amount);
  }, 0);
  return total;
} 

export const TotalStats = (props: IProps): JSX.Element => {
  const { allExpensesFiltered } = useGlobalState();
  const { selectedTimePeriod } = props;

  const [selectedOption, setSelectedOption] = useState<SelectedChartFilter>(SelectedChartFilter.ONE_PERIOD);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    /* whenever user switches selectedTimePeriod reset selectedOption to ONE_PERIOD */
    setSelectedOption(SelectedChartFilter.ONE_PERIOD);
  }, [selectedTimePeriod]);

  const timeFrameExpenses = getTimeFrameExpenses({ selectedExpenses: allExpensesFiltered, selectedTimePeriod });
  const total = getTotal(timeFrameExpenses);

  const handleSelectPeriod = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    setSelectedOption(event?.currentTarget?.value as SelectedChartFilter);
  } 

  const openChart = () => {
    setOpen((prev) => !prev);
  }

  let displayTimePeriod = 'week';
  if (selectedTimePeriod === ONE_MONTH) {
    displayTimePeriod = 'month';
  }

  return (
    <>
      <ListItemWrapper>
        <ListItemTotal onClick={openChart}>
          <h4>Total</h4>
          <span className="right">{formatUsd(total, { noPrefix: true })}</span>
        </ListItemTotal>
        <Divider />
      </ListItemWrapper>
      
      {open && (    
        <>
          <ButtonBox>
            <TimeFrameButtonStyled
              className={selectedOption === SelectedChartFilter.ONE_PERIOD ? 'active' : ''}
              value={SelectedChartFilter.ONE_PERIOD}
              onClick={handleSelectPeriod}
            >
              This {displayTimePeriod}
            </TimeFrameButtonStyled>
            <TimeFrameButtonStyled
              className={selectedOption === SelectedChartFilter.PAST_PERIODS ? 'active' : ''}
              value={SelectedChartFilter.PAST_PERIODS}
              onClick={handleSelectPeriod}
            >
              Past {DEFAULT_NUM_OF_TIME_PERIODS?.toString()} {`${displayTimePeriod}s`}
            </TimeFrameButtonStyled>
            {selectedTimePeriod === ONE_MONTH && (
              <TimeFrameButtonStyled
                className={selectedOption === SelectedChartFilter.CALENDAR_PERIOD ? 'active' : ''}
                value={SelectedChartFilter.CALENDAR_PERIOD}
                onClick={handleSelectPeriod}
              >
                Calendar month
              </TimeFrameButtonStyled>
            )}
          </ButtonBox>
          <TotalChart 
            selectedTimePeriod={selectedTimePeriod}
            selectedOption={selectedOption}
          />
        </>
      )}
    </>
  );
}
