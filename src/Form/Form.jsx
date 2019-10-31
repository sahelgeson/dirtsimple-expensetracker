import React, { Component} from "react";
import { connect } from 'react-redux';
import { addExpense } from '../redux/actions/expenses-actions';
import cuid from 'cuid';

class Form extends Component{
  constructor(props) {
    super(props);
  
    /* Format for expenses: 
      {
        id,
        datetime,
        amount,
        categoryId
      }
    */

    /* TODO: change this eventually so user can set default category */
    const defaultCategoryId = (this.props.categories[0] && this.props.categories[0].id)  || [];

    this.state = {
      amount: '',
      categoryId: defaultCategoryId,
      isSaved: false,
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
    this.setState({categoryId: event.target.value});
  }

  handleFocus() {
    this.setState({
        amount: '',
        isSaved: false,
    });
  }

  handleSubmit(event) {
    event.preventDefault();
    if (!this.state.amount) { 
      this.setState({isSaved: false});
      return false; 
    }  
      
    this.setState({isSaved: true});

    /* Doing this to avoid issues with ISO/UTC/timezones. 
        We just want the local date and time for all entries, if a user tracks an expense
        in a different timezone at 11pm, we don't need to convert it or have it show up as a 
        different time or even day in the UI. We use toString because JSON.stringify will use
        Date.toISOString on Date objects but not strings, and we don't want the timezone info */
    const datetime = new Date().toString();

    const id = cuid();
    const {amount, categoryId} = this.state;

    const newExpense = {
      id,
      datetime,
      amount,
      categoryId
    }

    this.props.addExpense(newExpense);
  }  
  
  render(){
    return (
      <form 
        onSubmit={this.handleSubmit}
        className="mbl"
      >

        {/* Adds visibility hidden to element instead of returning null so the space doesn't
            collapse and have text move a pixel or two 
            
            TODO: check a11y on this */}
        <div className={this.state.isSaved ?
              "status text-center gray-777 font-14"
            : "status text-center gray-777 font-14 visibility-hidden" }
        >
          Saved!
        </div>

        <label 
          htmlFor="amount"
          className="sr-only"            
        >
          Enter amount of this expense  
        </label>
        <input 
          id="amount"
          className="input gray-border full-width font-25 mvm"
          type="number" 
          placeholder="$0.00" 
          min="0.01" 
          step="0.01"
          pattern="\d*"
          onChange={this.handleAmountChange}
          onFocus={this.handleFocus}
          value={this.state.amount}
          data-qa="main-form-amount-input"    
        />
        <label
          htmlFor="category"
          className="block text-center gray-777 mbs"
        >
          Category
        </label>

        <select
          id="category"
          className="select-css input input-secondary full-width font-25 mbm"
          value={this.state.categoryId} 
          onChange={this.handleCategoryChange}
          data-qa="main-form-category-input" 
        >
          {this.props.categories.map((category) => {
              if (category.id !== null) {
                return (
                  <option 
                    key={category.id}
                    value={category.id}
                  >
                    {category.name}
                  </option>
                )
              } else { return null; }
            }
          )}
        </select>

        <input 
          className="input btn btn--blue full-width font-25 mvm"
          type="submit" 
          disabled={!!parseInt(this.state.amount, 10) ? false : true}
          value="Save" 
          data-qa="main-form-save-btn"          
        />
      </form>
    );
  }
}

function mapStateToProps(state) {
  return {
    allExpenses: state.allExpenses,
    categories:  state.categories,
  };
}

export default connect(mapStateToProps, { addExpense })(Form);
