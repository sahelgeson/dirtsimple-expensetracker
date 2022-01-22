import React from 'react';
import { 
  Uuid,
  ICategory,
  IExpense,
} from 'interfaces';

interface IProps {
  expense: IExpense;
  thisCategory: ICategory;
  isBeingEditedId: Uuid;
  handleClick: () => void;
}

// TODO: move this or see if we can use date-fns instead
const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export const HistoryListing = (props: IProps) => {
  const { expense, thisCategory, isBeingEditedId, handleClick } = props;

  return (
    <div 
      className={(expense.id === isBeingEditedId) ? 
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
        className={(thisCategory.id !== null) ?
            "ftable__cell pvm phs"
          : "ftable__cell pvm phs italic gray-777" }
        data-qa="history-category"   
      >
        {thisCategory.name}
      </div>
      <div className="ftable__cell ftable__cell--date pvm prxs"> 
        {days[new Date(expense.datetime).getDay()]},&nbsp; 
        {new Date(expense.datetime).getMonth() + 1}/                  
        {new Date(expense.datetime).getDate()}
      </div>
      <div className="ftable__cell ftable__cell--edit text-right">
        <button
          className="btn btn--outline btn--edit paxs"
          onClick={handleClick}                  
          value={expense.id} 
          data-qa="history-edit-btn"     
        >
          Edit 
        </button>
      </div>
    </div>
  );
}
