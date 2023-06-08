import { Chart } from './Chart';
import { useGlobalState } from 'contexts';
import { Box, Grid, GridItem, Text } from '@chakra-ui/react'
import { ONE_WEEK, ONE_MONTH, WEEKS_IN_A_MONTH } from 'lib/constants';
import { formatUsd } from 'helpers';
import { transformToChartDataArray, IChartData } from './transformToChartDataArray';
import { getStartAndEndCutoff } from './getStartAndEndCutoff';
import { getTimeFrameExpenses } from './getTimeFrameExpenses';
import { calculateAverage } from './calculateAverage';
import { timePeriodData, WEEKLY, MONTHLY, YTD_SPECIAL_CASE, DAILY_SPECIAL_CASE } from './context';
import { calculateActualSavingsRate } from './calculateActualSavingsRate';


interface IProps {
  selectedPastPeriod: timePeriodData;
}

export const TotalChart = (props: IProps): JSX.Element => {
  const { selectedPastPeriod } = props;
  const { numberOfTimePeriods, timePeriod, specialCase } = selectedPastPeriod;
  const { allExpensesFiltered, monthlyBudgetLimit, savingsPercentRateGoal } = useGlobalState();
  const now = useGlobalState().getGlobalNow();

  const { startCutoff, endCutoff } = getStartAndEndCutoff({ now, selectedPastPeriod })
  const timeFrameExpenses = getTimeFrameExpenses({ selectedExpenses: allExpensesFiltered, startCutoff, endCutoff });

  const chartDataArray: IChartData[] = transformToChartDataArray({
    now,
    selectedPastPeriod,
    selectedExpenses: allExpensesFiltered,
  });

  let displayTimePeriod = 'week';
  if (selectedPastPeriod.timePeriod === MONTHLY) {
    displayTimePeriod = 'month';
  } else if (selectedPastPeriod?.specialCase === YTD_SPECIAL_CASE) {
    displayTimePeriod = 'calendar month';
  }

  // get savings rate
  let actualSavingsRate = 0;
  let actualSavingsRateFormatted = '';
  let isPositive = false;
  if (monthlyBudgetLimit) {
    actualSavingsRate = calculateActualSavingsRate({ 
      selectedPastPeriod,
      expenses: timeFrameExpenses, 
      monthlyBudgetLimit, 
    })
    actualSavingsRateFormatted = (actualSavingsRate * 100).toFixed(2);
    isPositive = actualSavingsRate > 0;
  }

  const dailySpecialCase = specialCase === DAILY_SPECIAL_CASE;
  
  const average = calculateAverage({ 
    selectedPastPeriod, 
    expenses: timeFrameExpenses,
  });


  let goalAverage;
  if (monthlyBudgetLimit && savingsPercentRateGoal) {
    const monthlyGoalAverage = monthlyBudgetLimit * (1 - (savingsPercentRateGoal / 100));
    if (dailySpecialCase) {
      goalAverage = monthlyGoalAverage / ONE_MONTH;
    } else if (timePeriod === MONTHLY) {
      goalAverage = monthlyGoalAverage;
    } else if (timePeriod === WEEKLY) {
      goalAverage = monthlyGoalAverage / WEEKS_IN_A_MONTH;
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
                  {dailySpecialCase ? (
                    <>Daily Avg: </>
                  ) : (
                    (timePeriod === WEEKLY) ? (
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
              <Text as={'div'} fontSize={'xs'} color={'gray'} fontStyle={'italic'}>  
                {dailySpecialCase ? (
                  <>Total per day for each {(timePeriod === WEEKLY) ? ONE_WEEK : ONE_MONTH} days</>
                ) : (
                  <div>
                    {(timePeriod === WEEKLY)  ? (
                      <>Total per week for past {numberOfTimePeriods} weeks</>
                    ) : (                   
                      <>Total per month for past {numberOfTimePeriods} months</>
                    )}
                  </div>
                )}
              </Text> 
            </GridItem>
          </Grid>
        </>
      )}   
    </div>
  );
}
