import styled from 'styled-components';
import { 
  Accordion,
  AccordionButton,
  AccordionItem,
  AccordionPanel,
} from '@chakra-ui/react';
import { ListItemGrid } from './styles';
import { CategoryChart } from './CategoryChart';
import { formatUsd } from 'helpers';
import { getTotalAndDifference } from './helpers';
import { ICategory, IExpense } from 'interfaces';
import { timePeriodData } from './context';

const ListItem = styled.li`
  padding-top: 0.75rem;
  padding-bottom: 0.75rem;
  width: 100%;
  ${ListItemGrid}
`;

export const CategoryStats = ({
  category,
  selectedPastPeriod,
  timeFrameExpenses,
  prevTimeFrameExpenses,
}: {
  category: ICategory;
  selectedPastPeriod: timePeriodData;
  timeFrameExpenses: IExpense[];
  prevTimeFrameExpenses: IExpense[];
}): JSX.Element => {
  // TODO currently can only filter by Category which is why this uses allExpensesUnfiltered
  // as a result it still shows Category data if filtering is on for that category
  // might want to rethink if that makes seems intuitive

  const selectedTimeFrameExpenses: IExpense[] = timeFrameExpenses.filter((expense) => {
    return expense.categoryId === category.id;
  });
  const prevSelectedTimeFrameExpenses: IExpense[] = prevTimeFrameExpenses.filter((expense) => {
    return expense.categoryId === category.id;
  });

  const { 
    total, 
    isPositiveDifference, 
    formatDifference 
  } = getTotalAndDifference({ 
    timeFrameExpenses: selectedTimeFrameExpenses,
    prevTimeFrameExpenses: prevSelectedTimeFrameExpenses, 
  });

  return (
    <Accordion allowToggle>
      <AccordionItem borderTop={0}>
        <AccordionButton sx={{ all: 'unset', width: '100%', '&:hover': { background: 'unset' } }}>
          <ListItem>
            <span>{category.name}</span>

            <span className="text-right italic">
              <span className={isPositiveDifference ? `bad`: `good`}>{formatDifference}</span>
            </span>
            <span className="text-right">{formatUsd(total, { noPrefix: true })}</span>
          </ListItem>
        </AccordionButton>

        <AccordionPanel px={0}>
          <CategoryChart 
            selectedExpenses={selectedTimeFrameExpenses} 
            selectedPastPeriod={selectedPastPeriod}
          />
        </AccordionPanel>
      </AccordionItem>
    </Accordion>
  );
}
