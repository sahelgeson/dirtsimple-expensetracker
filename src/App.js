import React, { Component} from "react";
import './App.css';
import Form from "./Form/Form.jsx";

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
      <Form recentExpenses={this.state.recentExpenses} />
    );
  }
}

export default App;
