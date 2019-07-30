import React from "react";
import { PropTypes } from "prop-types";
import { Route, Link } from "react-router-dom";

/* TODO: make this a function -- stateless */
function History(props) {
    const recentExpenses = props.recentExpenses; 
    /* TODO: use a js date library instead of this */
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    return(
      <div className="container">
        <div className="text-center gray-777 mbs">
          All Expenses
        </div>
        <table className="full-width mbm">
          <tbody>
            {/* TODO consider a limit on this with a "View more" button */}
            {recentExpenses.map((expense, i) =>
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
                  {days[new Date(expense.datetime).getDay()]},&nbsp; 
                  {new Date(expense.datetime).getMonth() + 1}/                  
                  {new Date(expense.datetime).getDate()}/
                  {new Date(expense.datetime).getFullYear().toString().slice(-2)}
                </td>
                <td>
                  <Link to="/history">Edit this expense</Link>
                </td>
              </tr>                  
            )}
          </tbody>             
        </table>
      </div>
    );
}

History.propTypes = {
  recentExpenses: PropTypes.object
};

export default History;
