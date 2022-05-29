import styled from 'styled-components';
import { Bar, BarChart, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';
import { IChartData } from './helpers';

/* 
  Note: remember chartDataArray needs an entry for every date, parent is in charge of
  possibly padding an array with date/value entries of zero dollars
*/
interface IProps {
  chartDataArray: IChartData[];
  color?: string;
}

interface IBarLabel {
  x: number;
  y: number;
  width: number;
  value: number;
}

const renderCustomBarLabel = ({ x, y, width, value }: IBarLabel) => {
  return <text x={x + width / 2} y={y} fill="#666" textAnchor="middle" dy={-6}>{`${value}`}</text>;
};

const BarChartStyled = styled(BarChart)`
  font-size: 12px;
`

export const Chart = (props: IProps): JSX.Element => {
  const { chartDataArray, color } = props;

  return (
    <ResponsiveContainer width="100%" height={200}>
      <BarChartStyled width={500} height={450} margin={{ top: 20, right: 0, bottom: 0, left: 0 }} data={chartDataArray}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="dateIndex" />
        <YAxis dataKey="amount" width={40} />
        <Bar dataKey="amount" fill={color || '#8884d8'} label={renderCustomBarLabel} />
      </BarChartStyled>
    </ResponsiveContainer>
  );
}
