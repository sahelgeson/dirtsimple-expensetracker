import React, { Component} from "react";
import './App.css';

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

    this.state = {
      amount: '',
      category: 'Food',
      recentExpenses: [],
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

    this.setState({
      recentExpenses: [newExpense, ...this.state.recentExpenses]
    })
  }  
  
  render(){
    const recentExpenses = this.state.recentExpenses;
    const numberOfRecentShown = 10; 

    return (
      <div className="App container">
        <form 
          onSubmit={this.handleSubmit}
          className="mbl"
        >
          {/* TODO add an onselect so it resets the value when a user taps into it? */}
          <input 
            className="input font-25 mvm"
            type="number" 
            placeholder="$0.00" 
            min="0.01" 
            step="0.01"
            onChange={this.handleAmountChange}
            value={this.state.amount}
          />
          <label
            className="label mbs"
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

        {recentExpenses.length ? (
          <div>
            <div className="label gray-777 mbs">
              Recent Expenses
            </div>
            <table className="table card mbm">
              {recentExpenses.slice(0,numberOfRecentShown).map((expense, i) =>
                <tr key={i}>
                  <td>
                    <span className="dollar inline-block">$</span>
                    <span  className="inline-block">
                      {expense.amount}
                    </span>
                  </td>
                  <td>
                    {expense.category}
                  </td>
                  <td>
                    {expense.datetime.getMonth() + 1}/                  
                    {expense.datetime.getDate()}/
                    {expense.datetime.getFullYear().toString().slice(-2)}
                  </td>
                </tr>
              )}
            </table>
          </div>
        ) : null}
        {recentExpenses.length > numberOfRecentShown ? (
          <div>See all expenses</div> 
        ) : null}
      </div>
    );
  }
}

export default App;
