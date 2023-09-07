import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { ListItemGrid } from './styles';
import { useGlobalState } from 'contexts';
import { Button, ButtonGroup, HStack, Tabs, TabList, Tab } from '@chakra-ui/react'
import { CategoryFilter } from './CategoryFilter';
import { CategoryStats } from './CategoryStats';
import { TotalStats } from './TotalStats';
import { WEEKLY, MONTHLY, timePeriodData } from './context';
import { useStatsState, MainTimeScales } from './context';
import { useTimeFrameExpenses } from '../../hooks';

const ListHeader = styled.h4`
  ${ListItemGrid}
  color: #777;
  margin-top: 1rem;
  margin-bottom: 0.5rem;
`;

const buttonHoverStyles = { 
  bg: 'blue.50',
  borderColor: 'blue.300'
};

export const Stats = (): JSX.Element => {
  const { allExpensesFiltered } = useGlobalState();
  const now = useGlobalState().getGlobalNow();
  const { filteredCategories } = useGlobalState();
  const { chartTimeScale } = useStatsState();
  const [selectedMainTimeScale, setSelectedMainTimeScale] = useState<MainTimeScales>(WEEKLY);
  const [selectedPastPeriod, setSelectedPastPeriod] = useState<timePeriodData>(chartTimeScale[WEEKLY][0]);

  useEffect(() => {
    /* whenever user switches selectedMainTimeScale reset selectedPastPeriod to default first period */
    if (selectedMainTimeScale === MONTHLY) {
      setSelectedPastPeriod(chartTimeScale[MONTHLY][0]);
    } else if (selectedMainTimeScale === WEEKLY) {
      setSelectedPastPeriod(chartTimeScale[WEEKLY][0]); 
    }
  }, [selectedMainTimeScale]);

  const allPossibleTimePeriods = chartTimeScale[selectedMainTimeScale];

  const { timeFrameExpenses, prevTimeFrameExpenses } = useTimeFrameExpenses({ 
    selectedExpenses: allExpensesFiltered,
    selectedPastPeriod,
    now,
  });

  return (
    <div className="container margin-0-auto phl">

      <CategoryFilter />

      {/* not used to show TabPanels, just used for Tab styling */}
      <Tabs isFitted>
        <TabList>
          <Tab onClick={() => setSelectedMainTimeScale(WEEKLY)}>Week view</Tab>
          <Tab onClick={() => setSelectedMainTimeScale(MONTHLY)}>Month view</Tab>
        </TabList>    
      </Tabs>      

      <ButtonGroup variant='outline' size='md' sx={{ width: '100%' }}>
        <HStack justifyContent="space-evenly" px={0} py={4} sx={{ width: '100%' }}>
          {allPossibleTimePeriods.map((timePeriodData: timePeriodData) => {
            const isActiveSelection = selectedPastPeriod.displayName === timePeriodData.displayName;
            return (
              <Button 
                key={timePeriodData.displayName}
                colorScheme='gray' 
                variant='outline'
                onClick={() => setSelectedPastPeriod(timePeriodData)}
                fontSize='sm'
                sx={{
                  borderRadius: 24,                
                  color: 'gray.600',
                  borderColor: 'gray.200',
                  boxShadow: 'rgba(27, 31, 35, 0.04) 0 1px 0, rgba(255, 255, 255, 0.25) 0 1px 0 inset',
                  ...(isActiveSelection && buttonHoverStyles),
                }}
                _hover={buttonHoverStyles}
              >
                {timePeriodData.displayName}
              </Button>
            )            
          })}
        </HStack>
      </ButtonGroup>
 
 {/* TODO xkcd style this better with grid in components below */}
      <ListHeader>
        <span>Category</span>
        <span className="text-right">Amt change</span>
        <span className="text-right">Total</span>
      </ListHeader>

      <TotalStats 
        selectedPastPeriod={selectedPastPeriod} 
        timeFrameExpenses={timeFrameExpenses}
        prevTimeFrameExpenses={prevTimeFrameExpenses}
      />

      <ul className="mobile-margin-bottom">
        {filteredCategories.map((category) => {
          return (
            <CategoryStats 
              key={category.id}
              category={category}
              selectedPastPeriod={selectedPastPeriod}
              timeFrameExpenses={timeFrameExpenses}
              prevTimeFrameExpenses={prevTimeFrameExpenses}
            />
          )
        })}
      </ul>

    </div>
  );
}
