import React, { Component} from "react";
import './App.css';
import RecentExpenses from "./RecentExpenses/RecentExpenses.jsx";

class App extends Component{
  constructor(props) {
    super(props);
  
    /* Format for expenses (used in recentExpenses): 
      {
        datetime,
        amount,
        category
      }
    */

    const recentExpenses = JSON.parse(localStorage.getItem('myExpenses')) || [];

    /* TODO: change this to get recentExpenses from localStorage */
    this.state = {
      amount: '',
      category: 'Food',
      recentExpenses: recentExpenses,
    }

    this.handleAmountChange = this.handleAmountChange.bind(this);
    this.handleCategoryChange = this.handleCategoryChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleAmountChange(event) {
    this.setState({amount: event.target.value});
  }

  handleCategoryChange(event) {
    console.log('Category was changed to: ' + this.state.category);
  }

  handleSubmit(event) {
    event.preventDefault();
    if (!this.state.amount) { return false; }  /* TODO change this to an error message */
      
    console.log('An expense was submitted: ' + this.state.amount);
    
    const datetime = new Date();

    const {amount, category} = this.state;

    console.log('datetime: ' + datetime);
    console.log('amount: ' + amount);
    console.log('category: ' + category);

    const newExpense = {
      datetime,
      amount,
      category
    }

    const recentExpenses = [newExpense, ...this.state.recentExpenses]

    this.setState({
      recentExpenses
    })

    localStorage.setItem('myExpenses', JSON.stringify(recentExpenses));
  }  
  
  render(){
    const recentExpenses = this.state.recentExpenses;

    return (
      <div className="App container">
        <form 
          onSubmit={this.handleSubmit}
          className="mbl"
        >
          {/* TODO add an onselect so it resets the value when a user taps into it? */}
          <label 
            className="sr-only"
            htmlFor="amount">
            Enter amount of this expense  
          </label>
          <input 
            id="amount"
            className="input font-25 mvm"
            type="number" 
            placeholder="$0.00" 
            min="0.01" 
            step="0.01"
            onChange={this.handleAmountChange}
            value={this.state.amount}
          />
          <label
            className="center gray-777 mbs"
          >
            Category
          </label>

          <input 
            className="input input-secondary font-25 mbm"
            type="button" 
            onChange={this.handleCategoryChange}
            value={this.state.category} 
          />
          <input 
            className="input font-25 mvm"
            type="submit" 
            value="Save" 
          />
        </form>

        {recentExpenses.length ? 
          <RecentExpenses recentExpenses={recentExpenses} /> 
        : null}
      </div>
    );
  }
}

export default App;
