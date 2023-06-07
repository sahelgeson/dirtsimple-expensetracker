import styled from 'styled-components';
import { 
  Accordion,
  AccordionButton,
  AccordionItem,
  AccordionPanel,
} from '@chakra-ui/react';
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
`;

interface IProps {
  category: ICategory;
  selectedTimePeriod: number;
}

export const CategoryStats = (props: IProps): JSX.Element => {
  // TODO currently can only filter by Category which is why this uses allExpensesUnfiltered
  const { allExpensesUnfiltered } = useGlobalState();
  const { category, selectedTimePeriod } = props;

  const timeFrameExpenses = getTimeFrameExpenses({ selectedExpenses: allExpensesUnfiltered, selectedTimePeriod });

  const getCategoryTotal = (category: ICategory, timeFrameExpenses: IExpense[]): number => {
    const total = timeFrameExpenses.reduce((sum, expense) => {
      if (expense.categoryId === category.id) {
        return sum + expense.amount;
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
  const difference = getDifference(category, timeFrameExpenses, allExpensesUnfiltered);
  const isPositiveDifference = difference > 0;
  let formatDifference = formatUsd(difference, { noPrefix: true });
  formatDifference = `${isPositiveDifference ? '+' : ''}${formatDifference}`;


  const selectedExpenses: IExpense[] = allExpensesUnfiltered.filter((expense) => {
    return expense.categoryId === category.id;
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
            selectedExpenses={selectedExpenses} 
            selectedTimePeriod={selectedTimePeriod}
          />
        </AccordionPanel>
      </AccordionItem>
    </Accordion>
  );
}
