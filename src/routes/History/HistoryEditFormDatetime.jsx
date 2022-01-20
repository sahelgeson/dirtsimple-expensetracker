import React from "react";
import { PropTypes } from "prop-types";
const { format } = require('date-fns');

function HistoryEditFormDatetime(props){
  /* The HTML input type="datetime-local" takes a custom format that is only part of the standard ISO format */
  //const TEST = parse(props.datetime);
  //console.log(TEST);
  //const formattedDatetime = format(parse(props.datetime), 'YYYY-MM-DDTHH:mm');

  /* TODO xkcd infinite loop, this changes value which triggers onChange
    s/b 2018-06-12T19:30 */

  const formattedDatetime = format(new Date(props.datetime), "yyyy-MM-dd'T'HH:mm");

  console.log(formattedDatetime);

  return( 
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
        onChange={props.handleDateChange}
        value={formattedDatetime}
      ></input>
    </div>
  );
}

HistoryEditFormDatetime.propTypes = {
  datetime: PropTypes.string.isRequired,  
  handleDateChange: PropTypes.func.isRequired,
};

export default HistoryEditFormDatetime;
