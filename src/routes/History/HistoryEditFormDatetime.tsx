import { ChangeEvent } from 'react';
import { Input } from '@chakra-ui/react';
import { Datetime } from 'interfaces';
import { DATETIME_FORMAT } from 'lib/constants';
import { format } from 'date-fns';

interface IProps {
  datetime: Datetime;
  handleDateChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

export const HistoryEditFormDatetime = (props: IProps): JSX.Element => {
  /* The HTML input type="datetime-local" takes a custom format that is a truncated part of the standard ISO format */
  /* e.g. 2018-06-12T19:30 */

  const { datetime, handleDateChange } = props;
  const formattedDatetime = format(new Date(datetime), DATETIME_FORMAT);

  return ( 
    <div className="mvm">
      <label 
        htmlFor="datetime"
        className="edit-label pvm"           
      >
        Date   
      </label>
  
      {/* using datetime-local to avoid issues with manipulating/formatting Dates */}
      <Input
        placeholder="Edit Date and Time"
        size="lg"
        type="datetime-local"
        onChange={handleDateChange}
        value={formattedDatetime}
        width="75%"
        sx={{ 
          '&::-webkit-date-and-time-value': {
            textAlign: 'left',
          },
        }}
      />
    </div>
  );
}
