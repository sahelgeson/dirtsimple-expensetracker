import React from "react";
import { PropTypes } from "prop-types";

function HistoryListing(props){
  const expense = props.expense;
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div 
      className={(expense.id === props.active) ? 
          "ftable__row phs editing"
          : "ftable__row phs" }
      key={expense.id}
    >
      <div 
        className="ftable__cell ftable__cell--amount text-right pvm phxs"
        data-qa="history-amount"   
      >
        <span className="dollar inline-block">$</span>
        <span className="inline-block">
          {expense.amount}
        </span>
      </div>
      <div 
        className={(props.thisCategory.id !== null) ?
            "ftable__cell pvm phs"
          : "ftable__cell pvm phs italic gray-777" }
        data-qa="history-category"   
      >
        {props.thisCategory.name}
      </div>
      <div className="ftable__cell ftable__cell--date pvm prxs"> 
        {days[new Date(expense.datetime).getDay()]},&nbsp; 
        {new Date(expense.datetime).getMonth() + 1}/                  
        {new Date(expense.datetime).getDate()}
      </div>
      <div className="ftable__cell ftable__cell--edit text-right">
        <button
          className="btn btn--outline btn--edit paxs"
          onClick={props.handleClick}                  
          value={expense.id} 
          data-qa="history-edit-btn"     
        >
          Edit 
        </button>
      </div>
    </div>
  );
}

HistoryListing.propTypes = {
  expense: PropTypes.object.isRequired,
  active: PropTypes.bool.isRequired,
  thisCategory: PropTypes.object.isRequired,
  handleClick: PropTypes.func.isRequired,
};

export default HistoryListing;
