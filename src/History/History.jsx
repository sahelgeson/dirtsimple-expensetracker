import React, { Component} from "react";
import { PropTypes } from "prop-types";
import HistoryEditForm from "./HistoryEditForm.jsx";

class History extends Component{
  constructor(props) {
    super(props);
  
    this.state = {
      isBeingEditedId: null,    /* this is the id of the expense being edited, only allow one at a time */
    }

    /* Sort expenses by date by default only for initial load. Setting this up in the constructor so we're
      not sorting in edit form because we don't want state to update and rerender which could
      yoink stuff around */
    const allExpensesSorted = [...this.props.allExpenses];
    // TODO: should replace with one sorted by id, or just assume they are already sorted and remove entirely
    allExpensesSorted.sort(function(a, b) {
      var dateA = new Date(a.datetime), dateB = new Date(b.datetime);
      return dateB - dateA;
    });

    this.props.handleHoistedExpensesChange(allExpensesSorted);
    this.handleClick = this.handleClick.bind(this);
  }

  componentDidUpdate(prevProps, prevState) {
    /* In case user deletes an expense, close the edit form. */
    if (prevProps.allExpenses.length !== this.props.allExpenses.length) {
      this.setState({isBeingEditedId: null});
    }
  }

  handleClick(event) {
    const thisId = parseInt(event.target.value, 10);
    (this.state.isBeingEditedId === thisId)
      ? this.setState({isBeingEditedId: null})
      : this.setState({isBeingEditedId: thisId})
  }

  render(){
    const allExpenses = this.props.allExpenses; 
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const active = this.state.isBeingEditedId;

    return(
      <div className="container margin-0-auto phs">
        {(!allExpenses.length) 
          ? <div className="text-center">No expenses entered yet</div>
          : <div className="ftable font-16">
          {/* TODO consider a limit on this with a "View more" button */}
          {allExpenses.map((expense) => 
              <div 
                className={(expense.id === active) ? 
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
                  className="ftable__cell pvm phs"
                  data-qa="history-category"   
                >
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
                    value={expense.id} 
                    data-qa="history-edit-btn"     
                  >
                    Edit 
                  </button>
                </div>

                {/* Adds visibility hidden to element instead of returning null so the space doesn't
                    collapse and have text move a pixel or two */}
                <div className={(expense.id !== active - 1) && (expense.id !== active) ?
                      "full-width divider divider--dotted mvn"
                    : "full-width divider divider--dotted mvn visibility-hidden" }
                >
                </div>

                {(expense.id === active) ?
                  <HistoryEditForm 
                    thisExpense={expense} 
                    categories={this.props.categories} 
                    allExpenses={this.props.allExpenses}
                    isBeingEditedId={this.state.isBeingEditedId}
                    handleClick={this.handleClick}
                    handleHoistedExpensesChange={this.props.handleHoistedExpensesChange}
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
  handleHoistedExpensesChange: PropTypes.func.isRequired,
};

export default History;
