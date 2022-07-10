import { Chart } from './Chart';
import { useGlobalState } from 'contexts';
import { DEFAULT_NUM_OF_TIME_PERIODS, ONE_DAY, ONE_WEEK, ONE_MONTH } from 'lib/constants';
import { getChartDataArray, IChartData } from './helpers';
import { ChartAverage } from './ChartAverage';
import { ChartTitle } from './styles';
import { SelectedChartFilter } from './types';


interface IProps {
  selectedTimePeriod: number;
  selectedOption?: SelectedChartFilter;
}

export const TotalChart = (props: IProps): JSX.Element => {
  const { selectedTimePeriod, selectedOption } = props;
  const { allExpenses } = useGlobalState();

  const isByCalendarMonthSelected = selectedOption === SelectedChartFilter.CALENDAR_PERIOD;

  let chartDataArray: IChartData[] = [];

  if (selectedOption === SelectedChartFilter.ONE_PERIOD) {
    /* show Daily totals */
    chartDataArray = getChartDataArray({
      numOfTimePeriodsToShow: selectedTimePeriod, /* matching to get daily figures */
      selectedExpenses: allExpenses,
      selectedTimePeriod: ONE_DAY,
      isByCalendarMonthSelected
    });
  } else {
    chartDataArray = getChartDataArray({
      numOfTimePeriodsToShow: DEFAULT_NUM_OF_TIME_PERIODS,
      selectedExpenses: allExpenses,
      selectedTimePeriod: selectedTimePeriod,
      isByCalendarMonthSelected,
    });
  }

  let displayTimePeriod = 'week';
  if (selectedTimePeriod === ONE_MONTH) {
    displayTimePeriod = 'month';
  } else if (isByCalendarMonthSelected) {
    displayTimePeriod = 'calendar month';
  }

  return (
    <div style={{ paddingTop: '0.5rem' }}>   
      {chartDataArray.length === 0 ? (
        <>No expenses for the past {displayTimePeriod}</>
      ) : (
        <>
          <Chart chartDataArray={chartDataArray} color={'#1b8e1b'} />
          <ChartAverage numOfPeriods={chartDataArray.length} totals={chartDataArray}>
            {selectedTimePeriod === ONE_MONTH ? (
              <>Monthly Avg:</>
            ) : (
              <>Daily Avg:</>
            )}
          </ChartAverage>

          {selectedOption === SelectedChartFilter.ONE_PERIOD && (
            <ChartTitle>                  
              Total per day for each {selectedTimePeriod.toString()} days
            </ChartTitle>
          )}
          
          {selectedOption === SelectedChartFilter.PAST_PERIODS && (
            <>
              {selectedTimePeriod === ONE_WEEK ? (
                <ChartTitle>                  
                  Total per week for past {DEFAULT_NUM_OF_TIME_PERIODS} weeks
                </ChartTitle>
              ) : (
                <ChartTitle>                  
                  Total per month for past {DEFAULT_NUM_OF_TIME_PERIODS} months
                </ChartTitle>
              )}
            </>
          )}
          
          {selectedOption === SelectedChartFilter.CALENDAR_PERIOD && (
            <ChartTitle>Total per month by past calendar month</ChartTitle>
          )}
        </>
      )}   
    </div>
  );
}
