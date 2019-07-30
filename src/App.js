import React, { Component} from "react";
import './App.css';
import Form from "./Form/Form.jsx";
import History from "./History/History.jsx";
import { Route } from "react-router-dom";

class App extends Component{
  constructor(props) {
    super(props);
  
    /* Format for expenses (used in recentExpenses): 
      {
        datetime,
        amount,
        category
      }
    */

    const recentExpenses = JSON.parse(localStorage.getItem('myExpenses')) || [];
    const categories =     JSON.parse(localStorage.getItem('myCategories')) || [];

    this.state = {
      recentExpenses,
      categories,
    }
  }
  
  render(){
    const recentExpenses = this.state.recentExpenses;
    const categories = this.state.categories;

    return (
      <div>
        <Route
          exact path="/"
          render={(props) => <Form {...props} recentExpenses={recentExpenses} categories={categories} />}
        />
        <Route
          exact path="/history"
          render={(props) => <History {...props} recentExpenses={recentExpenses} categories={categories} />}
        />
      </div>
    );
  }
}

export default App;
