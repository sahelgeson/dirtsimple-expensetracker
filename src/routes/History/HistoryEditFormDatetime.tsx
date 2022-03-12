import React from 'react';
import { Datetime } from 'interfaces';
import { DATETIME_FORMAT } from 'lib/constants';
import { format } from 'date-fns';

interface IProps {
  datetime: Datetime;
  handleDateChange: () => void;
}

export const HistoryEditFormDatetime = (props: IProps) => {
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
      <input 
        type="datetime-local" 
        id="datetime"
        className="edit-input select-css gray-border inline-block font-16 plm pvs prxs"
        onChange={handleDateChange}
        value={formattedDatetime}
      ></input>
    </div>
  );
}
