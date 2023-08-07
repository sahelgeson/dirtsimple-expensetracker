import styled from 'styled-components';
import { sub } from 'date-fns';
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
import { getStartAndEndCutoff } from './getStartAndEndCutoff';
import { getTimeFrameExpenses } from './getTimeFrameExpenses';
import { ICategory, IExpense } from 'interfaces';
import { timePeriodData, YTD_SPECIAL_CASE } from './context';

const ListItem = styled.li`
  padding-top: 0.75rem;
  padding-bottom: 0.75rem;
  width: 100%;
  ${ListItemGrid}
`;

interface IProps {
  category: ICategory;
  selectedPastPeriod: timePeriodData;
}

const getCategoryTotal = (category: ICategory, timeFrameExpenses: IExpense[]): number => {
  const total = timeFrameExpenses.reduce((sum, expense) => {
    if (expense.categoryId === category.id) {
      return sum + expense.amount;
    }
    return sum;    
  }, 0);
  return total;
}

const getDifference = (category: ICategory, timeFrameExpenses: IExpense[], prevTimeFrameExpenses: IExpense[]): number => {
  return getCategoryTotal(category, timeFrameExpenses) - getCategoryTotal(category, prevTimeFrameExpenses);
}

export const CategoryStats = (props: IProps): JSX.Element => {
  // TODO currently can only filter by Category which is why this uses allExpensesUnfiltered
  // as a result it still shows Category data if filtering is on for that category
  // might want to rethink if that makes seems intuitive
  const { allExpensesUnfiltered } = useGlobalState();
  const now = useGlobalState().getGlobalNow();
  const { category, selectedPastPeriod } = props;

  const { startCutoff: startCutoffSelected, endCutoff: endCutoffSelected } = getStartAndEndCutoff({ now, selectedPastPeriod });
  const timeFrameExpenses = getTimeFrameExpenses({ 
    selectedExpenses: allExpensesUnfiltered, 
    startCutoff: startCutoffSelected, 
    endCutoff: endCutoffSelected,
  });

  let startCutoffPrev = getStartAndEndCutoff({ now, selectedPastPeriod, newEndDate: startCutoffSelected }).startCutoff;
  let endCutoffPrev = getStartAndEndCutoff({ now, selectedPastPeriod, newEndDate: startCutoffSelected }).endCutoff;

  // for YTD compare previous YTD not full year, e.g. Jan 1 2022 - Aug 6 2022 compared to Jan 1 2023 - Aug 6 2023
  if (selectedPastPeriod.specialCase === YTD_SPECIAL_CASE) {
    const ytdEndCutoff = sub(endCutoffSelected, { years: 1 });
    startCutoffPrev = getStartAndEndCutoff({ now, selectedPastPeriod, newEndDate: ytdEndCutoff }).startCutoff;
    endCutoffPrev = getStartAndEndCutoff({ now, selectedPastPeriod, newEndDate: ytdEndCutoff }).endCutoff;
  }

  const prevTimeFrameExpenses = getTimeFrameExpenses({ 
    selectedExpenses: allExpensesUnfiltered, 
    startCutoff: startCutoffPrev, 
    endCutoff: endCutoffPrev,
  });

  const total = getCategoryTotal(category, timeFrameExpenses);
  const difference = getDifference(category, timeFrameExpenses, prevTimeFrameExpenses);
  const isPositiveDifference = difference > 0;
  let formatDifference = formatUsd(difference, { noPrefix: true });
  formatDifference = `${isPositiveDifference ? '+' : ''}${formatDifference}`;

  const selectedExpenses: IExpense[] = timeFrameExpenses.filter((expense) => {
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
            selectedPastPeriod={selectedPastPeriod}
          />
        </AccordionPanel>
      </AccordionItem>
    </Accordion>
  );
}
