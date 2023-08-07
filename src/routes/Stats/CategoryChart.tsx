import { Chart } from './Chart';
import { IExpense } from 'interfaces';
import { useGlobalState } from 'contexts';
import { Box } from '@chakra-ui/react';
import { ONE_WEEK, ONE_MONTH } from 'lib/constants';
import { timePeriodData, WEEKLY, MONTHLY } from './context';
import { calculateAverage } from './calculateAverage';
import { transformToChartDataArray, IChartData } from './transformToChartDataArray';

interface IProps {
  selectedExpenses: IExpense[];
  selectedPastPeriod: timePeriodData;
}

export const CategoryChart = (props: IProps): JSX.Element => {
  const { selectedExpenses, selectedPastPeriod } = props;
  const { numberOfTimePeriods, timePeriod } = selectedPastPeriod;
  const now = useGlobalState().getGlobalNow();

  let displayTimePeriod = ONE_WEEK;
  if (timePeriod === WEEKLY) {
    displayTimePeriod = ONE_WEEK;
  }
  if (timePeriod === MONTHLY) {
    displayTimePeriod = ONE_MONTH;
  }

  const chartDataArray: IChartData[] = transformToChartDataArray({
    now,
    selectedPastPeriod,
    selectedExpenses,
  });

  const average = calculateAverage({ 
    selectedPastPeriod, 
    expenses: selectedExpenses, 
  });

  return (
    <div style={{ paddingTop: '0.25rem' }}>      
      <Chart chartDataArray={chartDataArray} />

      <Box fontSize={'xs'} color={'gray'}>
        <div>Avg per {displayTimePeriod}: <strong>{average}</strong></div>
        <div>Total for prev {numberOfTimePeriods.toString()} sets of {displayTimePeriod} days</div>  
      </Box>
    </div>
  );
}
