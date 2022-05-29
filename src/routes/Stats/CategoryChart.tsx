import { Chart } from './Chart';
import { IExpense } from 'interfaces';
import { getChartDataArray } from './helpers';
import { ChartTitle } from './styles';
import { ONE_MONTH } from 'lib/constants';

interface IProps {
  selectedExpenses: IExpense[];
  allExpenses: IExpense[];
  selectedTimePeriod: number;
}

const NUM_OF_TIME_PERIODS = 4;

export const CategoryChart = (props: IProps): JSX.Element => {
  const { selectedExpenses, selectedTimePeriod } = props;

  const chartDataArray = getChartDataArray({
    numOfTimePeriodsToShow: NUM_OF_TIME_PERIODS,
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
          <ChartTitle>Total for prev {NUM_OF_TIME_PERIODS.toString()} sets of {selectedTimePeriod.toString()} days</ChartTitle>  
        </>
      )}     
    </div>
  );
}
