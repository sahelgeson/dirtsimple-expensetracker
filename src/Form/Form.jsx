import React, { Component} from "react";
import { PropTypes } from "prop-types";
import RecentExpenses from "../RecentExpenses/RecentExpenses.jsx";

class Form extends Component{
  constructor(props) {
    super(props);
  
    /* Format for expenses: 
      {
        datetime,
        amount,
        category
      }
    */

    /* TODO: here or in parent App? */
    const allExpenses = this.props.allExpenses || [];
    /* TODO: change this eventually so user can set default category */
    const defaultCategory = this.props.categories[0] || [];

    this.state = {
      amount: '',
      category: defaultCategory,
      allExpenses: allExpenses,
    }

    this.handleAmountChange = this.handleAmountChange.bind(this);
    this.handleCategoryChange = this.handleCategoryChange.bind(this);
    this.handleFocus = this.handleFocus.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleAmountChange(event) {
    this.setState({amount: event.target.value});
  }

  handleCategoryChange(event) {
    console.log('Category was changed to: ' + event.target.value);
    this.setState({category: event.target.value});
  }

  handleFocus(event) {
    this.setState({amount: ''});
  }

  handleSubmit(event) {
    event.preventDefault();
    if (!this.state.amount) { return false; }  /* TODO change this to an error message */
      
    /* Doing this to avoid issues with ISO/UTC/timezones. 
        We just want the local date and time for all entries, if a user tracks an expense
        in a different timezone at 11pm, we don't need to convert it or have it show up as a 
        different time or even day in the UI. We use toString because JSON.stringify will use
        Date.toISOString on Date objects but not strings, and we don't want the timezone info */
    const datetime = new Date().toString();

    const {amount, category} = this.state;
/*
    console.log('datetime: ' + datetime);
    console.log('amount: ' + amount);
    console.log('category: ' + category);
*/
    const newExpense = {
      datetime,
      amount,
      category
    }

    const allExpenses = [newExpense, ...this.state.allExpenses]

    this.setState({
      allExpenses
    })

    this.props.handleHoistedExpenseChange(allExpenses);
  }  
  
  render(){
    const allExpenses = this.state.allExpenses;

    return (
      <div className="App container">
        <form 
          onSubmit={this.handleSubmit}
          className="main-form mbl"
        >
          {/* TODO add an onselect so it resets the value when a user taps into it? */}
          <label 
            htmlFor="amount"
            className="sr-only"            
          >
            Enter amount of this expense  
          </label>
          <input 
            id="amount"
            className="input full-width font-25 mvm"
            type="number" 
            placeholder="$0.00" 
            min="0.01" 
            step="0.01"
            pattern="\d*"
            onChange={this.handleAmountChange}
            onFocus={this.handleFocus}
            value={this.state.amount}
          />
          <label
            htmlFor="category"
            className="block text-center gray-777 mbs"
          >
            Category
          </label>

          <select
            id="category"
            className="input input-secondary full-width font-25 mbm"
            value={this.state.category} 
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

          <input 
            className="input full-width font-25 mvm"
            type="submit" 
            value="Save" 
          />
        </form>

        {allExpenses.length ? 
          <RecentExpenses recentExpenses={allExpenses} /> 
        : null}
      </div>
    );
  }
}

Form.propTypes = {
  allExpenses: PropTypes.array.isRequired,
  categories: PropTypes.array.isRequired,
  handleHoistedExpenseChange: PropTypes.func.isRequired,
};

export default Form;
