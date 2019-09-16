import React, { Component} from "react";
import './css/App.scss';
import Home from "./Home.jsx";
import History from "./History/History.jsx";
import Options from "./Options/Options.jsx";
import { Route, Link } from "react-router-dom";
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
      JSON.stringify converts Date objects to an ISO format ( Date.toISOString => YYYY-MM-DDTHH:mm:ss.sssZ)
      We don't want timezones/GMT, just the local datetime, so we use Date.toString and just save the
      String. Formatting should be done in child components where needed.
    */

    /* allExpenses is not sorted in any order, sorting should be done by child components */
    const allExpenses = JSON.parse(localStorage.getItem('myExpenses')) || [];
    const categories  = JSON.parse(localStorage.getItem('myCategories')) || DefaultCategories;

    this.state = {
      allExpenses,
      categories,
    }
    this.handleHoistedExpenseChange = this.handleHoistedExpenseChange.bind(this);
    this.handleHoistedCategoriesChange = this.handleHoistedCategoriesChange.bind(this);
  }
  
  handleHoistedExpenseChange(allExpenses) {
    /* This function is passed down to the child components that need to update global state of expenses */
    this.setState({
      allExpenses
    })
    localStorage.setItem('myExpenses', JSON.stringify(allExpenses));
  }  

    
  handleHoistedCategoriesChange(categories) {
    /* This function is passed down to the child components that need to update global state of expenses */

    /* TODO: commenting this out for now 
    this.setState({
      categories
    })
    localStorage.setItem('myCategories', JSON.stringify(categories));
    */
  }  

  render(){
    const allExpenses = this.state.allExpenses;
    const categories = this.state.categories;

    return (
      <div>
        <Link to="/options"
          className="text-right block gray-777 font-14 phl mtm"
          data-qa="app-options-link"
        >
          Options
        </Link>   
        <Route
          exact path="/options"
          render={(props) => 
            <Options {...props} 
              allExpenses={allExpenses} 
              categories={categories} 
              handleHoistedExpenseChange={this.handleHoistedExpenseChange}
            />}
        />        
        <Route
          exact path="/"
          render={(props) => 
            <Home {...props} 
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
