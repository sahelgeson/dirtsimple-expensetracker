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
    */

    const allExpenses = JSON.parse(localStorage.getItem('myExpenses')) || [];
    const categories  = JSON.parse(localStorage.getItem('myCategories')) || DefaultCategories;

    this.state = {
      allExpenses,
      categories,
    }
  }
  
  render(){
    const allExpenses = this.state.allExpenses;
    const categories = this.state.categories;

    return (
      <div>
        <Route
          exact path="/"
          render={(props) => <Form {...props} allExpenses={allExpenses} categories={categories} />}
        />
        <Route
          exact path="/history"
          render={(props) => <History {...props} allExpenses={allExpenses} categories={categories} />}
        />
      </div>
    );
  }
}

export default App;
