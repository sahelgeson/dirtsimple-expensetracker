import { Chart } from './Chart';
import { IExpense } from 'interfaces';
import { getChartDataArray, IChartData } from './helpers';
import { ChartTitle } from './styles';
import { ONE_MONTH, DEFAULT_NUM_OF_TIME_PERIODS } from 'lib/constants';
import { ChartAverage } from './ChartAverage';

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

  return (
    <div style={{ paddingTop: '0.25rem' }}>    
      {chartDataArray.length === 0 ? (
        <>No expenses for the past {displayTimePeriod}</>
      ) : (
        <>
          <Chart chartDataArray={chartDataArray} />
          <div>
            <ChartAverage numOfPeriods={chartDataArray.length} totals={chartDataArray}>Avg per {displayTimePeriod}:</ChartAverage>
            <ChartTitle>Total for prev {DEFAULT_NUM_OF_TIME_PERIODS.toString()} sets of {selectedTimePeriod.toString()} days</ChartTitle>  
          </div>
        </>
      )}     
    </div>
  );
}
