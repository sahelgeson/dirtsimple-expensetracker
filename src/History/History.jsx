import React, { Component} from "react";
import { PropTypes } from "prop-types";
import HistoryEditForm from "./HistoryEditForm.jsx";

class History extends Component{
  constructor(props) {
    super(props);
  
    this.state = {
      isBeingEditedIndex: null,    /* this is the id of the expense being edited, only allow one at a time */
    }

    /* Sort expenses by date by default only for initial load. Setting this up in the constructor so we're
      not sorting in edit form because we don't want state to update and rerender which could
      yoink stuff around */
    const allExpensesSorted = [...this.props.allExpenses];
    allExpensesSorted.sort(function(a, b) {
      var dateA = new Date(a.datetime), dateB = new Date(b.datetime);
      return dateB - dateA;
    });

    this.props.handleHoistedExpenseChange(allExpensesSorted);
    this.handleClick = this.handleClick.bind(this);
  }

  componentDidUpdate(prevProps, prevState) {
    /* In case user deletes an expense, close the edit form. */
    if (prevProps.allExpenses.length !== this.props.allExpenses.length) {
      this.setState({isBeingEditedIndex: null});
    }
  }

  handleClick(event) {
    const indexNumber = parseInt(event.target.value, 10);
    (this.state.isBeingEditedIndex === indexNumber)
      ? this.setState({isBeingEditedIndex: null})
      : this.setState({isBeingEditedIndex: indexNumber})
  }

  render(){
    const allExpenses = this.props.allExpenses; 
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const active = this.state.isBeingEditedIndex;

    return(
      <div className="container-smaller">
        <div className="text-center gray-777 mtm mbs">
          All Expenses
        </div>
        {(!allExpenses.length) 
          ? <div className="text-center">No expenses entered yet</div>
          : <div className="ftable font-16">
          {/* TODO consider a limit on this with a "View more" button */}
          {allExpenses.map((expense, i) => 
              <div 
                className={(i === active) ? 
                    "ftable__row phs editing"
                    : "ftable__row phs" }
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
                    className="btn btn--outline btn--edit paxs"
                    onClick={this.handleClick}                  
                    value={i} 
                    data-qa="history-edit-btn"     
                  >
                    Edit 
                  </button>
                </div>

                {/* Adds visibility hidden to element instead of returning null so the space doesn't
                    collapse and have text move a pixel or two */}
                <div className={(i !== active - 1) && (i !== active) ?
                      "full-width divider divider--dotted mvn"
                    : "full-width divider divider--dotted mvn visibility-hidden" }
                >
                </div>

                {(i === active) ?
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
        </div>}
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
