import React, { Component} from "react";
import { PropTypes } from "prop-types";
import Form from "./Form/Form.jsx";
import RecentExpenses from "./RecentExpenses/RecentExpenses.jsx";

class Home extends Component{
  constructor(props) {
    super(props);
  
    /* Format for expenses: 
      {
        datetime,
        amount,
        category
      }
    */

    /* TODO: change this eventually so user can set default category */
    const defaultCategory = this.props.categories[0] || [];

    this.state = {
      amount: '',
      category: defaultCategory,
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

  handleFocus() {
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

    const allExpenses = [newExpense, ...this.props.allExpenses]
    this.props.handleHoistedExpenseChange(allExpenses);
  }  
  
  render(){
    return (
      <div className="App container">
        <Form
          allExpenses={this.props.allExpenses}
          categories={this.props.categories} 
          handleHoistedExpenseChange={this.props.handleHoistedExpenseChange}
        />

        {this.props.allExpenses.length ? 
          <RecentExpenses recentExpenses={this.props.allExpenses} /> 
        : null}
      </div>
    );
  }
}

Home.propTypes = {
  allExpenses: PropTypes.array.isRequired,
  categories: PropTypes.array.isRequired,
  handleHoistedExpenseChange: PropTypes.func.isRequired,
};

export default Home;
