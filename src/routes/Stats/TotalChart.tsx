import { Chart } from './Chart';
import { useGlobalState } from 'contexts';
import { Box, Grid, GridItem, Text } from '@chakra-ui/react'
import { DEFAULT_NUM_OF_TIME_PERIODS, ONE_DAY, ONE_WEEK, ONE_MONTH } from 'lib/constants';
import { formatUsd } from 'helpers';
import { getChartDataArray, IChartData } from './helpers';
import { getChartAverage } from './getChartAverage';
import { SelectedChartFilter } from './types';
import { getActualSavingsRate } from './getActualSavingsRate';


interface IProps {
  selectedTimePeriod: number;
  selectedOption?: SelectedChartFilter;
}

export const TotalChart = (props: IProps): JSX.Element => {
  const { selectedTimePeriod, selectedOption } = props;
  const { allExpensesFiltered, monthlyBudgetLimit, savingsPercentRateGoal } = useGlobalState();

  const isByCalendarMonthSelected = selectedOption === SelectedChartFilter.CALENDAR_PERIOD;

  let chartDataArray: IChartData[] = [];

  const isOnePeriod = selectedOption === SelectedChartFilter.ONE_PERIOD;
  if (isOnePeriod) {
    /* show Daily totals */
    chartDataArray = getChartDataArray({
      numOfTimePeriodsToShow: selectedTimePeriod, /* matching to get daily figures */
      selectedExpenses: allExpensesFiltered,
      selectedTimePeriod: ONE_DAY,
      isByCalendarMonthSelected
    });
  } else {
    chartDataArray = getChartDataArray({
      numOfTimePeriodsToShow: DEFAULT_NUM_OF_TIME_PERIODS,
      selectedExpenses: allExpensesFiltered,
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

  let actualSavingsRate = 0;
  let actualSavingsRateFormatted = '';
  let isPositive = false;
  if (monthlyBudgetLimit) {
    actualSavingsRate = getActualSavingsRate({ 
      selectedTimePeriod, 
      numOfPeriods: chartDataArray.length, 
      totals: chartDataArray, 
      monthlyBudgetLimit, 
    })
    actualSavingsRateFormatted = (actualSavingsRate * 100).toFixed(2);
    isPositive = actualSavingsRate > 0;
  }

  const average = getChartAverage({ 
    numOfPeriods: chartDataArray.length, 
    totals: chartDataArray 
  });

  let goalAverage;
  if (monthlyBudgetLimit && savingsPercentRateGoal) {
    goalAverage = monthlyBudgetLimit * (1 - (savingsPercentRateGoal / 100));
    if (selectedTimePeriod === ONE_DAY || isOnePeriod) {
      goalAverage = goalAverage / 30;
    } else if (selectedTimePeriod === ONE_WEEK) {
      goalAverage = goalAverage / 4;
    }  
  }

  return (
    <div style={{ paddingTop: '0.5rem' }}>   
      {chartDataArray.length === 0 ? (
        <>No expenses for the past {displayTimePeriod}</>
      ) : (
        <>
          <Chart chartDataArray={chartDataArray} color={'#1b8e1b'} />

          <Grid templateColumns={'1fr 1fr'}>
            <GridItem>
              <Box fontSize={'xs'} color={'gray'}>
                <div>
                  {selectedOption === SelectedChartFilter.ONE_PERIOD ? (
                    <>Daily Avg: </>
                  ) : (
                    selectedTimePeriod === ONE_WEEK ? (
                      <>Weekly Avg: </>              
                    ) : (
                      <>Monthly Avg: </>
                    )
                  )}
                  <strong>{average}</strong>
                </div>
                {goalAverage && (
                  <div>
                    <i>(Goal max: {formatUsd(goalAverage)})</i>
                  </div>
                )}
              </Box>
            </GridItem>


            <GridItem textAlign={'right'}>
              {monthlyBudgetLimit ? (
                <Box fontSize={'xs'} color={'gray'}>
                  <div><span>Savings rate:</span> <Text as="span" fontWeight="bold" color={isPositive ? 'green.600' : 'red.600'}>{actualSavingsRateFormatted}%</Text></div>
                  <div>Goal savings rate: {savingsPercentRateGoal}%</div>
                </Box>
              ): <div></div>}
            </GridItem>
            
            <GridItem colSpan={2}>
              <Text fontSize={'xs'} color={'gray'} fontStyle={'italic'}>  
                {selectedOption === SelectedChartFilter.ONE_PERIOD && (
                  <>Total per day for each {selectedTimePeriod.toString()} days</>
                )}
                
                {selectedOption === SelectedChartFilter.PAST_PERIODS && (
                  <div>
                    {selectedTimePeriod === ONE_WEEK ? (
                      <>Total per week for past {DEFAULT_NUM_OF_TIME_PERIODS} weeks</>
                    ) : (                   
                      <>Total per month for past {DEFAULT_NUM_OF_TIME_PERIODS} months</>
                    )}
                  </div>
                )}
                
                {selectedOption === SelectedChartFilter.CALENDAR_PERIOD && (
                  <>Total per month by past calendar month</>
                )}
              </Text> 
            </GridItem>
          </Grid>
        </>
      )}   
    </div>
  );
}
