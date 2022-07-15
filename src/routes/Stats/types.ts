export const SelectedChartFilter = {
  ONE_PERIOD: 'one-period',
  PAST_PERIODS: 'past-periods',
  CALENDAR_PERIOD: 'calendar',
} as const;
// eslint-disable-next-line
export type SelectedChartFilter = typeof SelectedChartFilter[keyof typeof SelectedChartFilter];
