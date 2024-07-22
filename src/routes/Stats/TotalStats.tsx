import { 
  Accordion,
  AccordionButton,
  AccordionItem,
  AccordionPanel,
  Box,
  Heading,
} from '@chakra-ui/react';
import { TotalChart } from './TotalChart';
import { ListItemGrid } from './styles';
import { formatUsd } from 'helpers';
import { getTotalAndDifference } from './helpers';
import { IExpense } from 'interfaces';
import { timePeriodData } from './context';

export const TotalStats = ({
  selectedPastPeriod,
  timeFrameExpenses,
  prevTimeFrameExpenses,
}: {
  selectedPastPeriod: timePeriodData;
  timeFrameExpenses: IExpense[];
  prevTimeFrameExpenses: IExpense[];
}): JSX.Element => {

  const { 
    total, 
    isPositiveDifference, 
    formatDifference 
  } = getTotalAndDifference({ timeFrameExpenses, prevTimeFrameExpenses });

  return (
    <Accordion allowToggle>
      <AccordionItem sx={{ borderWidth: '2px 0 2px!important', borderColor: 'gray.400' }}>
        <AccordionButton sx={{ all: 'unset', width: '100%', '&:hover': { background: 'unset' } }}>
          <Box 
            sx={{
              py: 3,
              width: '100%',
              alignItems: 'center',
              ...ListItemGrid,
            }}
          >
            <Heading as="h4" size="sm">Total</Heading>
            <span className="text-right italic bold">
              <span className={isPositiveDifference ? `bad`: `good`}>{formatDifference}</span>
            </span>
            <span className="text-right bold">{formatUsd(total, { noPrefix: true })}</span>
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

