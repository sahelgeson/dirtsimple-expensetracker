import styled from 'styled-components';
import { useGlobalState } from 'contexts';
import { ListItemGrid } from './styles';
import { sub, isWithinInterval } from 'date-fns';
import { formatUsd } from 'helpers';
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

  interface IProps {
    allExpenses: IExpense[];
    selectedTimePeriod: number; 
    isPrev?: boolean;
  }

  // TODO make this function more reusable, particularly with function in routes/Stats/Total
  const getTimeFrameExpenses = ({ allExpenses, selectedTimePeriod, isPrev }: IProps): IExpense[] => {
    const now = new Date();
    const endCutoff = isPrev ? sub(now, { days: (selectedTimePeriod * 2) }) : now;
    const startCutoff = sub(endCutoff, { days: selectedTimePeriod });

    const timeFrameExpenses = allExpenses.filter((expense: IExpense) => {
      return isWithinInterval(
        new Date(expense.datetime),
        { start: startCutoff, end: endCutoff }
      );
    });

    return timeFrameExpenses;
  }

  const timeFrameExpenses = getTimeFrameExpenses({ allExpenses, selectedTimePeriod });

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
    const prevTimeFrameExpenses = getTimeFrameExpenses({ allExpenses, selectedTimePeriod, isPrev: true });
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

  return (
    <ListItem 
      key={category.id}
    >
      <span>{category.name}</span>

      <span className="text-right italic">
        <span className={isPositiveDifference ? `bad`: `good`}>{formatDifference}</span>
      </span>
      <span className="text-right">{formatUsd(total, { noPrefix: true })}</span>
    </ListItem>
  );
}
