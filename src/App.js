import React, { Component } from "react";
import './css/App.scss';
import Home from "./Home.jsx";
import History from "./History/History.jsx";
import ScrollToTop from "./helpers/ScrollToTop.jsx";
import Options from "./Options/Options.jsx";
import { Route, NavLink } from "react-router-dom";
import DefaultCategories from "./DefaultCategories.js";

class App extends Component{
  constructor(props) {
    super(props);
  
    /* Format for expenses (used in allExpenses): 
      {
        id,
        datetime,
        amount,
        categoryId
      }

      Format for a category: 
      {
        id,
        name
      }

      For datetime, value is stored in localStorage, which means it has to go through JSON.stringify.
      JSON.stringify converts Date objects to an ISO format ( Date.toISOString => YYYY-MM-DDTHH:mm:ss.sssZ)
      We don't want timezones/GMT, just the local datetime, so we use Date.toString and just save the
      String. Formatting should be done in child components where needed.

      Amount is valid to 2 decimal places, native HTML5 attributes on the input validate that. The
      expectation/hope is that users will just use dollar amounts without cents.

      Categories only allow for one unique value per category name. If that is changed you will need to also
      change any keys associated with categories since those need unique values. Categories are case-sensitive,
      so "Food" and "food" are different categories. 

      !!! the expenses in allExpenses are not sorted, either by index or datetime. Sorting is the responsibility
      of child components. This is necessary because the expenses on the History page must remain unsorted, 
      otherwise a datetime change will be hoisted up to App, will be sorted in App, then filter back down to
      History causing a rerender (and the expense whose datetime was changed will suddenly move, possibly out
      of view)
    */

    let allExpenses = JSON.parse(localStorage.getItem('myExpensesDebug')) || [];
    if (allExpenses.length) {
      // this is a data migration to add ids to allExpenses if they don't have ids already
      allExpenses = allExpenses.map((expense, i) => {
          if (!expense.hasOwnProperty('id')) {
            expense.id = i;
          }
          return expense;
      });
      // saves the data migration immediately
      localStorage.setItem('myExpensesDebug', JSON.stringify(allExpenses));
    }

    const categories  = JSON.parse(localStorage.getItem('myCategoriesDebug')) || DefaultCategories;

    this.state = {
      allExpenses,
      categories,
    }
    this.handleHoistedExpensesChange = this.handleHoistedExpensesChange.bind(this);
    this.handleHoistedCategoriesChange = this.handleHoistedCategoriesChange.bind(this);
  }
  
  handleHoistedExpensesChange(allExpenses) {
    /* This function is passed down to the child components that need to update global state of expenses */
    this.setState({ allExpenses });
    localStorage.setItem('myExpensesDebug', JSON.stringify(allExpenses));
  }  
    
  handleHoistedCategoriesChange(categories) {
    /* This function is passed down to the child components that need to update global state of expenses */
    this.setState({ categories });
    localStorage.setItem('myCategoriesDebug', JSON.stringify(categories));
  }  

  render(){
    const allExpenses = this.state.allExpenses;
    const categories = this.state.categories;

    return (
      <div>    
        <nav className="main-nav mbm">
          <ul className="flex">
            <li className="flex__1 main-nav__item">
              <NavLink exact to="/"
                className="main-nav__link pvm"
                data-qa="app-home-link"
              >
                <svg viewBox="0 0 32 32" className="home-svg-icon" aria-hidden="true">
                  <path d="M27 18.039L16 9.501 5 18.039V14.56l11-8.54 11 8.538v3.481zm-2.75-.31v8.251h-5.5v-5.5h-5.5v5.5h-5.5v-8.25L16 11.543l8.25 6.186z"/>
                </svg>
                  Home
              </NavLink>
            </li>
            <li className="flex__1 main-nav__item">
              <NavLink exact to="/history"
                className="main-nav__link pvm"
                data-qa="app-history-link"
              >
                All Expenses
              </NavLink> 
            </li>
            <li className="flex__1 main-nav__item">
              <NavLink exact to="/options"
                className="main-nav__link pvm"
                data-qa="app-options-link"
              >
                Options
              </NavLink> 
            </li>
          </ul>
        </nav>  
        <Route
          exact path="/"
          render={(props) => 
            <div className="history-page">  
              <Home {...props} 
                allExpenses={allExpenses} 
                categories={categories} 
                handleHoistedExpensesChange={this.handleHoistedExpensesChange}
              />
            </div>}
        />
        <Route
          exact path="/history"
          render={(props) => 
            <div className="history">
              <ScrollToTop />  
              <History {...props} 
                allExpenses={allExpenses} 
                categories={categories} 
                handleHoistedExpensesChange={this.handleHoistedExpensesChange}
              />            
            </div>}
        />
        <Route
          exact path="/options"
          render={(props) => 
            <div className="options-page">        
              <Options {...props} 
                allExpenses={allExpenses} 
                categories={categories} 
                handleHoistedExpensesChange={this.handleHoistedExpensesChange}
                handleHoistedCategoriesChange={this.handleHoistedCategoriesChange}
              />
            </div>}
        />          
      </div>
    );
  }
}

export default App;
