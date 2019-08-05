import React, { Component} from "react";
import { PropTypes } from "prop-types";
import HistoryEditForm from "./HistoryEditForm.jsx";

class History extends Component{
  constructor(props) {
    super(props);
  
    this.state = {
      isBeingEditedIndex: null,    /* this is the id of the expense being edited, only allow one at a time */
    }

    /* Sort expenses by date by default. Setting this up in the constructor and
      not sorting in edit form because we don't want state to update and rerender which could
      yoink stuff around */
    this.sortedAllExpenses = this.props.allExpenses.sort(function(a, b) {
      var dateA = new Date(a.datetime), dateB = new Date(b.datetime);
      return dateB - dateA;
    });

    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(event) {
    const indexNumber = parseInt(event.target.value, 10);
    (this.state.isBeingEditedIndex === indexNumber)
      ? this.setState({isBeingEditedIndex: null})
      : this.setState({isBeingEditedIndex: indexNumber})
  }

  render(){
    const allExpenses = this.sortedAllExpenses; 

    /* TODO: use a js date library instead of this */
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    return(
      <div className="container-smaller">
        <div className="text-center gray-777 mtm mbs">
          All Expenses
        </div>
        <div className="ftable font-14">

          {/* TODO consider a limit on this with a "View more" button */}
          {allExpenses.map((expense, i) =>
              <div 
                className="ftable__row" 
                key={i}
              >
                <div className="ftable__cell ftable__cell--amount text-right pvm phxs">
                  <span className="dollar inline-block">$</span>
                  <span className="inline-block">
                    {expense.amount}
                  </span>
                </div>
                <div className="ftable__cell pvm phs">
                  {expense.category}
                </div>
                <div className="ftable__cell ftable__cell--date pvm prxs"> 
                  {days[new Date(expense.datetime).getDay()]},&nbsp; 
                  {new Date(expense.datetime).getMonth() + 1}/                  
                  {new Date(expense.datetime).getDate()}
                </div>
                <div className="ftable__cell ftable__cell--edit text-right">
                  <button
                    className="btn btn--outline phxs pvs"
                    onClick={this.handleClick}                  
                    value={i} 
                  >
                    Edit 
                  </button>
                </div>

                {(this.state.isBeingEditedIndex !== null && this.state.isBeingEditedIndex === i) ?
                  <HistoryEditForm 
                    thisExpense={expense} 
                    categories={this.props.categories} 
                    allExpenses={this.props.allExpenses}
                    isBeingEditedIndex={this.state.isBeingEditedIndex}
                    handleClick={this.handleClick}
                    handleHoistedExpenseChange={this.props.handleHoistedExpenseChange}
                  />
                  : null }
              </div>
          )}
        
        </div>
      </div>
    );
  }
}

History.propTypes = {
  allExpenses: PropTypes.array.isRequired,
  categories: PropTypes.array.isRequired,
  handleHoistedExpenseChange: PropTypes.func.isRequired,
};

export default History;
