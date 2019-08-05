import React from "react";
import { PropTypes } from "prop-types";
import { Link } from "react-router-dom";

function RecentExpenses(props){
  const recentExpensesSorted = props.recentExpenses.sort(function(a, b) {
    var dateA = new Date(a.datetime), dateB = new Date(b.datetime);
    return dateB - dateA;
  });
  const numberOfRecentShown = 7; 

  return(
    <div className="card pal">
      <div className="center gray-777 mbs">
        Recent Expenses
      </div>
      <table className="full-width mbm">
        <tbody>
          {recentExpensesSorted.slice(0,numberOfRecentShown).map((expense, i) =>
            <tr key={i}>
              <td>
                <span className="dollar inline-block">$</span>
                <span className="inline-block">
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

      <div className="text-center">
        <Link to="/history">See all expenses</Link>              
      </div> 
    </div>
  );
}


RecentExpenses.propTypes = {
  recentExpenses: PropTypes.array.isRequired
};

export default RecentExpenses;
