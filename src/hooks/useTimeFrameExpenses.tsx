import { sub } from 'date-fns';
import { getStartAndEndCutoff, getTimeFrameExpenses } from '../routes/Stats/helpers';
import { timePeriodData, YTD_SPECIAL_CASE } from '../routes/Stats/context';
import { IExpense } from 'interfaces';

/* 
  Given a selected time period, this finds all the expenses in that time period
  and in the previous time period of that length  
*/
export const useTimeFrameExpenses = ({ 
  selectedExpenses, 
  selectedPastPeriod, 
  now 
}: {
  selectedExpenses: IExpense[]; 
  selectedPastPeriod: timePeriodData;
  now: Date;
}) => {

  const { 
    startCutoff: startCutoffSelected, 
    endCutoff: endCutoffSelected, 
  } = getStartAndEndCutoff({ now, selectedPastPeriod });
  
  const timeFrameExpenses = getTimeFrameExpenses({ 
    selectedExpenses, 
    startCutoff: startCutoffSelected, 
    endCutoff: endCutoffSelected,
  });
  
  const startCutoffSelectedDayBefore = sub(startCutoffSelected, { days: 1 });
  let { 
    startCutoff: startCutoffPrev,
    endCutoff: endCutoffPrev,
  } = getStartAndEndCutoff({ now, selectedPastPeriod, newEndDate: startCutoffSelectedDayBefore })
  
  // for YTD compare previous YTD not full year, e.g. Jan 1 2022 - Aug 6 2022 compared to Jan 1 2023 - Aug 6 2023
  if (selectedPastPeriod.specialCase === YTD_SPECIAL_CASE) {
    const ytdEndCutoff = sub(endCutoffSelected, { years: 1 });
    ({
      startCutoff: startCutoffPrev,
      endCutoff: endCutoffPrev,
    } = getStartAndEndCutoff({ now, selectedPastPeriod, newEndDate: ytdEndCutoff }));
  }
  
  const prevTimeFrameExpenses = getTimeFrameExpenses({ 
    selectedExpenses, 
    startCutoff: startCutoffPrev, 
    endCutoff: endCutoffPrev,
  });
  
  return { timeFrameExpenses, prevTimeFrameExpenses };
}
