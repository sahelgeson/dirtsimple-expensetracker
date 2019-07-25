import React, { Component} from "react";
import { PropTypes } from "prop-types";

/* TODO: make this a function -- stateless */
class RecentExpenses extends Component{
  constructor(props) {
    super(props);
  }

  render(){
    const recentExpenses = this.props.recentExpenses;
    const numberOfRecentShown = 7; 

    return(
      <div className="card">
        <div className="center gray-777 mbs">
          Recent Expenses
        </div>
        <table className="table mbm">
          <tbody>
            {recentExpenses.slice(0,numberOfRecentShown).map((expense, i) =>
              <tr key={i}>
                <td>
                  <span className="dollar inline-block">$</span>
                  <span  className="inline-block">
                    {expense.amount}
                  </span>
                </td>
                <td>
                  {expense.category}
                </td>
                <td>
                  {new Date(expense.datetime).getMonth() + 1}/                  
                  {new Date(expense.datetime).getDate()}/
                  {new Date(expense.datetime).getFullYear().toString().slice(-2)}
                </td>
              </tr>                  
            )}
          </tbody>             
        </table>

        {recentExpenses.length >= numberOfRecentShown ? 
          <div className="center">See all expenses</div> 
        : null}
      </div>
    );
  }
}

RecentExpenses.propTypes = {
  recentExpenses: PropTypes.object
};

export default RecentExpenses;
