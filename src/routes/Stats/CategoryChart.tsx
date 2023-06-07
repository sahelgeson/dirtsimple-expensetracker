import { Chart } from './Chart';
import { IExpense } from 'interfaces';
import { getChartDataArray, IChartData } from './helpers';
import { Box } from '@chakra-ui/react';
import { ONE_MONTH, DEFAULT_NUM_OF_TIME_PERIODS } from 'lib/constants';
import { getChartAverage } from './getChartAverage';

interface IProps {
  selectedExpenses: IExpense[];
  selectedTimePeriod: number;
}

/* 
export interface IChartData {
  dateIndex: number;
  amount: number;
}
*/

export const CategoryChart = (props: IProps): JSX.Element => {
  const { selectedExpenses, selectedTimePeriod } = props;

  const chartDataArray: IChartData[] = getChartDataArray({
    numOfTimePeriodsToShow: DEFAULT_NUM_OF_TIME_PERIODS,
    selectedExpenses,
    selectedTimePeriod,
  });

  let displayTimePeriod = 'week';
  if (selectedTimePeriod === ONE_MONTH) {
    displayTimePeriod = 'month';
  }

  const average = getChartAverage({ 
    numOfPeriods: chartDataArray.length, 
    totals: chartDataArray 
  });


  return (
    <div style={{ paddingTop: '0.25rem' }}>    
      {chartDataArray.length === 0 ? (
        <>No expenses for the past {displayTimePeriod}</>
      ) : (
        <>
          <Chart chartDataArray={chartDataArray} />          
          <Box fontSize={'xs'} color={'gray'}>
            <div>Avg per {displayTimePeriod}: <strong>{average}</strong></div>
            <div>Total for prev {DEFAULT_NUM_OF_TIME_PERIODS.toString()} sets of {selectedTimePeriod.toString()} days</div>  
          </Box>
        </>
      )}     
    </div>
  );
}
