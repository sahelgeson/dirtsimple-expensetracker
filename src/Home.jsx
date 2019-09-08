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
