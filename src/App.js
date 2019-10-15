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
    this.handleHoistedExpensesChange = this.handleHoistedExpensesChange.bind(this);
    this.handleHoistedCategoriesChange = this.handleHoistedCategoriesChange.bind(this);
  }
  
  handleHoistedExpensesChange(allExpenses) {
    /* This function is passed down to the child components that need to update global state of expenses */
    this.setState({
      allExpenses
    })
    localStorage.setItem('myExpenses', JSON.stringify(allExpenses));
  }  

    
  handleHoistedCategoriesChange(categories) {
    /* This function is passed down to the child components that need to update global state of expenses */

    this.setState({
      categories
    })
    /* TODO: commenting this out for now 
    localStorage.setItem('myCategories', JSON.stringify(categories));
    */
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
                <svg viewBox="0 0 32 32" class="home-svg-icon" viewBox="0 0 32 32" aria-hidden="true">
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
