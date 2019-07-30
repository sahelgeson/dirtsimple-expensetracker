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
    this.handleDelete = this.handleDelete.bind(this);
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

  handleDelete(event) {
    event.preventDefault();
    alert("Are you sure you want to delete this? This can't be undone.")
  }  

  handleSubmit(event) {
    event.preventDefault();
  }  

  render(){
    {/* TODO this is not hydrating properly first time */}
    const recentExpenses = this.props.recentExpenses; 
    /* TODO: use a js date library instead of this */
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    return(
      <div className="container-smaller">
        <div className="text-center gray-777 mtm mbs">
          All Expenses
        </div>
        <div className="ftable font-14">

          {/* TODO consider a limit on this with a "View more" button */}
          {recentExpenses.map((expense, i) =>

            (this.state.isBeingEdited == null || this.state.isBeingEdited !== i.toString()) ?
              <div 
                className="ftable__row" 
                key={i}
              >
                <div className="ftable__cell ftable__cell--amount text-right pvm pls prm">
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
                  {/* TODO this needs to change the state of the parent, either HOC or render props or React Hooks */}
                  <button
                    className="btn btn--outline phxs pvs"
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
                <div className="ftable__row">
                  <div className="ftable__cell ftable__cell--amount pvm phs">
                    <input 
                      id="amount"
                      className="full-width phxs pvs"
                      type="number" 
                      placeholder={expense.amount} 
                      min="0.01" 
                      step="0.01"
                      pattern="\d*"
                      onChange={this.handleAmountChange}
                      value={expense.amount}
                    />
                  </div>
                  <div className="ftable__cell pvm phs">
                    <input 
                      id="category"
                      className="btn btn--outline phxs pvs"
                      type="button" 
                      onChange={this.handleCategoryChange}
                      value={expense.category} 
                    />
                  </div>
                  <div className="ftable__cell ftable__cell--date pvm prxs">
                    {days[new Date(expense.datetime).getDay()]},&nbsp; 
                    {new Date(expense.datetime).getMonth() + 1}/                  
                    {new Date(expense.datetime).getDate()}
                  </div>
                  <div className="ftable__cell ftable__cell--edit text-right">
                    {/* TODO this needs to change the state of the parent, either HOC or render props or React Hooks */}
                    <button
                      className="btn btn--outline phxs pvs"
                      onClick={this.handleClick}                  
                      value="null"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
                <div className="ftable__row ftable__row--center">
                  <button
                    className="btn btn--outline mrl"
                    onClick={this.handleDelete}                  
                  >
                    Delete this entry
                  </button>
                  <button
                    className="btn btn--blue pvs phm"
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
  recentExpenses: PropTypes.object,
  categories: PropTypes.object,
};

export default History;
