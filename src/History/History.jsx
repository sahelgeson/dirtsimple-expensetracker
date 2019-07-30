import React, { Component} from "react";
import { PropTypes } from "prop-types";

class History extends Component{
  constructor(props) {
    super(props);
  
    this.state = {
      isBeingEdited: null,    /* this is the id of the expense being edited, only allow one at a time */
    }

    this.handleClick = this.handleClick.bind(this);
    this.handleAmountChange = this.handleAmountChange.bind(this);
    this.handleCategoryChange = this.handleCategoryChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleClick(event) {
    console.log('id: ' + event.target.value)
    this.setState({isBeingEdited: event.target.value});
  }

  handleAmountChange(event) {
    console.log('amount change')
    //this.setState({amount: event.target.value});
  }

  handleCategoryChange(event) {
    console.log('Category was changed');
    //console.log('Category was changed to: ' + this.state.category);
  }

  handleSubmit(event) {
    event.preventDefault();
  }  

  render(){
    const recentExpenses = this.props.recentExpenses; 
    /* TODO: use a js date library instead of this */
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    return(
      <div className="container card">
        <div className="text-center gray-777 mbs">
          All Expenses
        </div>
        <div className="ftable">

          {/* TODO consider a limit on this with a "View more" button */}
          {recentExpenses.map((expense, i) =>

            (this.state.isBeingEdited == null || this.state.isBeingEdited !== i.toString()) ?
              <div 
                className="ftable-row" 
                key={i}
              >
                <div className="ftable-cell pam">
                  <span className="dollar inline-block">$</span>
                  <span className="inline-block">
                    {expense.amount}
                  </span>
                </div>
                <div className="ftable-cell pam">
                  {expense.category}
                </div>
                <div className="ftable-cell pam">
                  {days[new Date(expense.datetime).getDay()]},&nbsp; 
                  {new Date(expense.datetime).getMonth() + 1}/                  
                  {new Date(expense.datetime).getDate()}/
                  {new Date(expense.datetime).getFullYear().toString().slice(-2)}
                </div>
                <div className="ftable-cell pam text-right">
                  {/* TODO this needs to change the state of the parent, either HOC or render props or React Hooks */}
                  <button
                    onClick={this.handleClick}                  
                    value={i} 
                  >
                    Edit 
                  </button>
                </div>
              </div> : 
              <form 
                key={i}
              >
                <div className="ftable-row">
                  <div className="ftable-cell pam">
                    <input 
                      id="amount"
                      className="xxx"
                      type="number" 
                      placeholder={expense.amount} 
                      min="0.01" 
                      step="0.01"
                      onChange={this.handleAmountChange}
                      value={expense.amount}
                    />
                  </div>
                  <div className="ftable-cell pam">
                    <input 
                      id="category"
                      className="xxx"
                      type="button" 
                      onChange={this.handleCategoryChange}
                      value={expense.category} 
                    />
                  </div>
                  <div className="ftable-cell pam">
                    {days[new Date(expense.datetime).getDay()]},&nbsp; 
                    {new Date(expense.datetime).getMonth() + 1}/                  
                    {new Date(expense.datetime).getDate()}/
                    {new Date(expense.datetime).getFullYear().toString().slice(-2)}
                  </div>
                  <div className="ftable-cell pam text-right">
                    {/* TODO this needs to change the state of the parent, either HOC or render props or React Hooks */}
                    <button
                      onClick={this.handleClick}                  
                      value="null"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
                <div className="ftable-row">
                  <button
                    onClick={this.handleSubmit}                  
                  >
                    Save
                  </button>
                </div>
              </form>

          )}
        
        </div>
      </div>
    );
  }
}

History.propTypes = {
  recentExpenses: PropTypes.object
};

export default History;
