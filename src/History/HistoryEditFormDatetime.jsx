import React from "react";
import { PropTypes } from "prop-types";
const { format } = require('date-fns');

function HistoryEditFormDatetime(props){
  /* The HTML input type="datetime-local" takes a custom format that is only part of the standard ISO format */
  const formattedDatetime = format(props.datetime, 'YYYY-MM-DDTHH:mm');

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
