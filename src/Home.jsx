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
      <div className="container margin-0-auto phl">
        <h1 
          className="font-24 text-center gray-777 mtl pts"
        >
          <span className="logo-dirt">dirt</span>
          <span className="logo-simple">simple</span>
          <br />
          expense tracker          
        </h1>
        <Form
          allExpenses={this.props.allExpenses}
          categories={this.props.categories} 
          handleHoistedExpensesChange={this.props.handleHoistedExpensesChange}
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
  handleHoistedExpensesChange: PropTypes.func.isRequired,
};

export default Home;
