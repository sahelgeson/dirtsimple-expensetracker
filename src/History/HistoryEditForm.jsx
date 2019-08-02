import React, { Component} from "react";
import { PropTypes } from "prop-types";

class HistoryEditForm extends Component{
  constructor(props) {
    super(props);
  
    const thisExpense = this.props.expense; 

    this.state = {
      isBeingEdited: null,    /* this is the id of the expense being edited, only allow one at a time */
      amount: thisExpense.amount,
      category: thisExpense.category,
      datetime: thisExpense.datetime,
    }

    //this.handleClick = this.handleClick.bind(this);
    this.handleAmountChange = this.handleAmountChange.bind(this);
    this.handleCategoryChange = this.handleCategoryChange.bind(this);
    this.handleDateChange = this.handleDateChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
  }

 
  handleAmountChange(event) {
    this.setState({amount: event.target.value});
  }

  handleCategoryChange(event) {
    console.log('Category was changed');
    //console.log('Category was changed to: ' + this.state.category);
  }

  handleDateChange(event) {
    console.log('Date was changed');
    //console.log('Date was changed to: ' + this.state.datetime);
  }

  handleDelete(event) {
    event.preventDefault();
    alert("Are you sure you want to delete this? This can't be undone.")
  }  

  handleSubmit(event) {
    /* TODO use react context api to handle this or possibly a Hook */
    event.preventDefault();

    if (!this.state.amount) { return false; }  /* TODO change this to an error message */

    console.log('An expense was edited: ' + this.state.amount);
    
    // TODO change this
    //const datetime = new Date();

    const {amount, category, datetime} = this.state;

    console.log('datetime: ' + datetime);
    console.log('amount: ' + amount);
    console.log('category: ' + category);

    const editedExpense = {
      datetime,
      amount,
      category
    }

    /* TODO, this doesn't work because it's only sent one expense and not all */
    const allExpenses = [editedExpense, ...this.state.allExpenses]

    /* Sort expenses by date in case datetime was edited */
    allExpenses.sort(function(a, b) {
      var dateA = new Date(a.datetime), dateB = new Date(b.datetime);
      return dateA - dateB;
    });

    this.setState({
      allExpenses
    })

    this.props.handleHoistedExpenseChange(allExpenses);
  }  

  render(){
    const expense = this.props.expense; 

    return( 
      <form  
        className="ftable__row card phm pbm pts mbs"
      >
        <div className="full-width pbm">
          <div>
            <label 
              htmlFor="amount"   
              className="edit-label pvm"        
            >
              Change amount  
            </label>
            <input 
              id="amount"
              className="input edit-input-number inline-block font-16 phxs pvs"
              type="number" 
              placeholder={expense.amount} 
              min="0.01" 
              step="0.01"
              pattern="\d*"
              onChange={this.handleAmountChange}
              value={expense.amount}
            />
          </div>
          <div>
            <label 
              htmlFor="category" 
              className="edit-label pvm"          
            >
              Change category  
            </label>
            <select
              id="category"
              className="input input-secondary inline-block font-16 phxs pvs"
              value={expense.category} 
              onChange={this.handleCategoryChange}
            >
              {this.props.categories.map((category, i) =>
                  <option 
                    key={i}
                    value={category}
                  >
                    {category}
                  </option>
              )}
            </select>
          </div>
          <div>
            <label 
              htmlFor="datetime"
              className="edit-label pvm"           
            >
              Change date   
            </label>
            {/* using date input to get the native iOS datepicker, hacky implementation
                until I add a proper js date library */}
            <input 
              type="date" 
              id="datetime"
              className="font-16"
              onChange={this.handleDateChange}
              value={expense.datetime.slice(0,10)}
            ></input>
          </div>
        </div>
        <div className="ftable__row ftable__row--between">
          <button
            className="btn btn--red mrxs"
            onClick={this.handleDelete}                  
          >
            Delete
          </button>
          {/* TODO this needs to change the state of the parent, either HOC or render props or React Hooks */}
          <button
              className="btn btn--outline phxs pvs mrxs"
              onClick={this.props.handleClick}                  
              value="null"
            >
              Cancel
            </button>
          <button
            className="btn btn--blue pvs phm"
            onClick={this.handleSubmit}                  
          >
            Save
          </button>
        </div>
      </form>
    );
  }
}

HistoryEditForm.propTypes = {
  expense: PropTypes.array.isRequired,
  categories: PropTypes.array.isRequired,
  handleClick: PropTypes.func.isRequired,
  handleHoistedExpenseChange: PropTypes.func.isRequired,
};

export default HistoryEditForm;
