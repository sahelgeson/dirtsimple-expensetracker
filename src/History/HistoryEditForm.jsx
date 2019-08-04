import React, { Component} from "react";
import { PropTypes } from "prop-types";
import parse from "date-fns/parse";
const { format } = require('date-fns');


class HistoryEditForm extends Component{
  constructor(props) {
    super(props);
  
    const thisExpense = this.props.thisExpense; 

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
    console.log('Category was changed to ' + event.target.value);
    //this.setState({category: event.target.value});
  }

  handleDateChange(event) {
    console.log('Date was changed to: ' + event.target.value);

    /* event.target.value is 2019-07-11T00:00:00.000Z set at GMT time zone, needs to adjust for
      local time zone before going any further */
    const adjustedDate = new Date(event.target.value)
    
    console.log('Date was parsed to: ' + parse(adjustedDate));

    const newDatetime = JSON.stringify(adjustedDate);
    console.log('newDatetime: ' + newDatetime);
    // need to format this back to ISO  
    //this.setState({datetime: newDatetime});
  }

  handleDelete(event) {
    event.preventDefault();
    alert("Are you sure you want to delete this? This can't be undone.")
  }  

  handleSubmit(event) {
    event.preventDefault();

    if (!this.state.amount) { return false; }  /* TODO change this to an error message */

    console.log('An expense was edited: ' + this.state.amount);

    const {amount, category, datetime} = this.state;

    console.log('datetime: ' + datetime);
    console.log('amount: ' + amount);
    console.log('category: ' + category);

    const editedExpense = {
      datetime,
      amount,
      category
    }

    /* TODO: change in place instead of adding */
    const allExpensesUnsorted = [editedExpense, ...this.state.allExpenses]

    this.setState({
      allExpensesUnsorted
    })

    this.props.handleHoistedExpenseChange(allExpensesUnsorted);
  }  

  render(){

    /* destructure this from state */
    //const expense = this.props.thisExpense; 
    const { amount, category, datetime } = this.state;
    const formattedDatetime = format(
      new Date(datetime),
      'YYYY-MM-DD'
    );

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
              placeholder={amount} 
              min="0.01" 
              step="0.01"
              pattern="\d*"
              onChange={this.handleAmountChange}
              value={amount}
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
              value={category} 
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
              value={formattedDatetime}
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
  thisExpense: PropTypes.object.isRequired,
  categories: PropTypes.array.isRequired,
  allExpenses: PropTypes.array.isRequired,
  handleClick: PropTypes.func.isRequired,
  handleHoistedExpenseChange: PropTypes.func.isRequired,
};

export default HistoryEditForm;
