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
import { getStartAndEndCutoff } from './getStartAndEndCutoff';
import { getTimeFrameExpenses } from './getTimeFrameExpenses';
import { IExpense } from 'interfaces';

import { timePeriodData } from './context';

interface IProps {
  selectedPastPeriod: timePeriodData;
}

/* helper function */
const getTotal = (timeFrameExpenses: IExpense[]): number => {
  const total = timeFrameExpenses.reduce((sum, expense) => {
    return sum + expense.amount;
  }, 0);
  return total;
} 

export const TotalStats = (props: IProps): JSX.Element => {
  const { allExpensesFiltered } = useGlobalState();
  const now = useGlobalState().getGlobalNow();
  const { selectedPastPeriod } = props;

  const { startCutoff, endCutoff } = getStartAndEndCutoff({ now, selectedPastPeriod });
  const timeFrameExpenses = getTimeFrameExpenses({ selectedExpenses: allExpensesFiltered, startCutoff, endCutoff });
  const total = getTotal(timeFrameExpenses);

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

        <AccordionPanel px={0}>
          <TotalChart 
            selectedPastPeriod={selectedPastPeriod}
          />
        </AccordionPanel>
      </AccordionItem>
    </Accordion>
  );
}

