import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { 
  Accordion,
  AccordionButton,
  AccordionItem,
  AccordionPanel,
  Box,
  Flex,
  Heading,
} from '@chakra-ui/react';
import { useGlobalState } from 'contexts';
import { TotalChart } from './TotalChart';
import { formatUsd } from 'helpers';
import { getTimeFrameExpenses } from './helpers';
import { IExpense } from 'interfaces';
import { ONE_MONTH, DEFAULT_NUM_OF_TIME_PERIODS } from 'lib/constants';
import { SelectedChartFilter } from './types';
import { ButtonBox, TimeFrameButton } from './styles';

const TimeFrameButtonStyled = styled(TimeFrameButton)`
  font-size: 12px;
`;

interface IProps {
  selectedTimePeriod: number;
}

/* helper functions */
const getTotal = (timeFrameExpenses: IExpense[]): number => {
  const total = timeFrameExpenses.reduce((sum, expense) => {
    return sum + expense.amount;
  }, 0);
  return total;
} 

export const TotalStats = (props: IProps): JSX.Element => {
  const { allExpensesFiltered } = useGlobalState();
  const { selectedTimePeriod } = props;

  const [selectedOption, setSelectedOption] = useState<SelectedChartFilter>(SelectedChartFilter.ONE_PERIOD);

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

  let displayTimePeriod = 'week';
  if (selectedTimePeriod === ONE_MONTH) {
    displayTimePeriod = 'month';
  }

  return (
    <Accordion allowToggle>
      <AccordionItem>
        <AccordionButton sx={{ all: 'unset', width: '100%', '&:hover': { background: 'unset' } }}>
          <Box>
            <Flex mt={2} py={4} sx={{ fontWeight: 'bold' }} justifyContent={'space-between'}>
              <Heading as="h4" size="sm">Total</Heading>
              <span className="right">{formatUsd(total, { noPrefix: true })}</span>
            </Flex>
          </Box>
        </AccordionButton>

        <AccordionPanel>
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
        </AccordionPanel>
      </AccordionItem>
    </Accordion>
  );
}
