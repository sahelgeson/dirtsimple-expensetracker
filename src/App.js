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

    /* TODO: change this to get recentExpenses from localStorage */
    this.state = {
      recentExpenses: recentExpenses,
    }
  }
  
  render(){
    const recentExpenses = this.state.recentExpenses;

    return (
      <div>
        <Route exact path="/" component={Form} />
        <Route exact path="/history" component={History} />
      </div>
    );
  }
}

export default App;
