import { Chart } from './Chart';
import { IExpense } from 'interfaces';
import { ONE_DAY, ONE_MONTH } from 'lib/constants';
import { getChartDataArray } from './helpers';
import { ChartTitle } from './styles';

interface IProps {
  selectedExpenses: IExpense[];
  selectedTimePeriod: number;
}

export const TotalChart = (props: IProps): JSX.Element => {
  const { selectedExpenses, selectedTimePeriod } = props;

  const chartDataArray = getChartDataArray({
    numOfTimePeriodsToShow: selectedTimePeriod, /* matching to get daily figures */
    selectedExpenses,
    selectedTimePeriod: ONE_DAY,
  });

  let displayTimePeriod = 'week';
  if (selectedTimePeriod === ONE_MONTH) {
    displayTimePeriod = 'month';
  }

  return (
    <div style={{ paddingTop: '0.5rem' }}>   
      {chartDataArray.length === 0 ? (
        <>No expenses for the past {displayTimePeriod}</>
      ) : (
        <>
          <Chart chartDataArray={chartDataArray} color={'#1b8e1b'} />
          <ChartTitle>Total per day for {selectedTimePeriod.toString()} days</ChartTitle>    
        </>
      )}   
    </div>
  );
}
