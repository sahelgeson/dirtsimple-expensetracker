import React, { useContext, createContext, ReactNode } from 'react';
import { useGlobalState } from 'contexts';
import { getNumberOfYtdTimePeriods } from 'routes/Stats/helpers';

export const WEEKLY = 'weekly';
export const MONTHLY = 'monthly';
export const DAILY_SPECIAL_CASE = 'daily';
export const YTD_SPECIAL_CASE = 'ytd';

export type MainTimeScales = typeof WEEKLY | typeof MONTHLY;

export type timePeriodData = {
  displayName: string;
  numberOfTimePeriods: number;
  timePeriod: typeof WEEKLY | typeof MONTHLY;
  specialCase?: typeof DAILY_SPECIAL_CASE | typeof YTD_SPECIAL_CASE;
}

// TODO look into Record type for this
export type chartTimeScaleByMainTimeScale = {
  [key in MainTimeScales]: timePeriodData[];
}

interface IStatsContext {
  chartTimeScale: chartTimeScaleByMainTimeScale;
}

export const StatsContext = createContext({} as IStatsContext);

interface IProps {
  children?: ReactNode;
}

export const StatsProvider: React.FC = (props: IProps) => {
  const now = useGlobalState().getGlobalNow();
  const chartTimeScale: chartTimeScaleByMainTimeScale = {
    [WEEKLY]: [
      {
        displayName: '1W',
        numberOfTimePeriods: 1,
        timePeriod: WEEKLY,
        specialCase: DAILY_SPECIAL_CASE,
      },
      {
        displayName: '2W',
        numberOfTimePeriods: 2,
        timePeriod: WEEKLY,
        specialCase: DAILY_SPECIAL_CASE,
      },
      {
        displayName: '4W',
        numberOfTimePeriods: 4,
        timePeriod: WEEKLY,
      },
      {
        displayName: 'YTD',
        numberOfTimePeriods: getNumberOfYtdTimePeriods({ now, timePeriod: WEEKLY }),
        timePeriod: WEEKLY,
        specialCase: YTD_SPECIAL_CASE,
      },
    ],
    [MONTHLY]: [
      {
        displayName: '1M',
        numberOfTimePeriods: 1,
        timePeriod: MONTHLY,
        specialCase: DAILY_SPECIAL_CASE,
      },
      {
        displayName: '4M',
        numberOfTimePeriods: 4,
        timePeriod: MONTHLY,
      },
      {
        displayName: '12M',
        numberOfTimePeriods: 12,
        timePeriod: MONTHLY,
      },
      {
        displayName: 'YTD',
        numberOfTimePeriods: getNumberOfYtdTimePeriods({ now, timePeriod: MONTHLY }),
        timePeriod: MONTHLY,
        specialCase: YTD_SPECIAL_CASE,
      },
    ],
  }

  const context = {
    chartTimeScale, 
  };

  return (
    <StatsContext.Provider value={context}>
      {props.children}
    </StatsContext.Provider>
  );
};

export const useStatsState = (): IStatsContext => useContext(StatsContext);
