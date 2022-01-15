import React from "react";
import './css/App.scss';
import Home from "./routes/Home/Home.jsx";
import History from "./routes/History/History.jsx";
import ScrollToTop from "./helpers/ScrollToTop.jsx";
import Options from "./routes/Options/Options.jsx";
import { Route, NavLink } from "react-router-dom";

function App(props){
  return (
    <div>    
      <nav className="main-nav mbm">
        <ul className="flex">
          <li className="flex__1 main-nav__item">
            <NavLink exact to="/app/expensetracker"
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
            <NavLink exact to="/app/expensetracker/history"
              className="main-nav__link pvm"
              data-qa="app-history-link"
            >
              All Expenses
            </NavLink> 
          </li>
          <li className="flex__1 main-nav__item">
            <NavLink exact to="/app/expensetracker/options"
              className="main-nav__link pvm"
              data-qa="app-options-link"
            >
              Options
            </NavLink> 
          </li>
        </ul>
      </nav>  
      <Route
        path="/app/expensetracker/history"
        render={(props) => 
          <div className="history">
            <ScrollToTop />  
            <History {...props} />            
          </div>}
      />
      <Route
        path="/app/expensetracker/options"
        render={(props) => 
          <div className="options-page">        
            <Options {...props} />
          </div>}
      />       
      <Route
        exact path="/app/expensetracker/"
        render={(props) => 
          <div className="history-page">  
            <Home {...props} />
          </div>}
      />   
    </div>
  );
}

export default App;
