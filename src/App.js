import React, { Component} from "react";
import './App.css';
import Form from "./Form/Form.jsx";
import History from "./History/History.jsx";
import { Route } from "react-router-dom";
import DefaultCategories from "./DefaultCategories.js";

class App extends Component{
  constructor(props) {
    super(props);
  
    /* Format for expenses (used in allExpenses): 
      {
        datetime,
        amount,
        category
      }

      For datetime, value is stored in localStorage, which means it has to go through JSON.stringify.
      JSON.stringify converts dates to an ISO format ( Date.toISOString => YYYY-MM-DDTHH:mm:ss.sssZ)
      We're not doing conversion in the App state, it needs to be done in child components where needed
    */

    /* allExpenses is not sorted in any order, sorting should be done by child components */
    const allExpenses = JSON.parse(localStorage.getItem('myExpenses')) || [];
    const categories  = JSON.parse(localStorage.getItem('myCategories')) || DefaultCategories;

    this.state = {
      allExpenses,
      categories,
    }
    this.handleHoistedExpenseChange = this.handleHoistedExpenseChange.bind(this);
  }
  
  handleHoistedExpenseChange(allExpenses) {
    /* This function is passed down to the child components that need to update global state of expenses */
    this.setState({
      allExpenses
    })

    localStorage.setItem('myExpenses', JSON.stringify(allExpenses));
  }  

  render(){
    const allExpenses = this.state.allExpenses;
    const categories = this.state.categories;

    return (
      <div>
        <Route
          exact path="/"
          render={(props) => 
            <Form {...props} 
              allExpenses={allExpenses} 
              categories={categories} 
              handleHoistedExpenseChange={this.handleHoistedExpenseChange}
            />}
        />
        <Route
          exact path="/history"
          render={(props) => 
            <History {...props} 
              allExpenses={allExpenses} 
              categories={categories} 
              handleHoistedExpenseChange={this.handleHoistedExpenseChange}
            />}
        />
      </div>
    );
  }
}

export default App;
