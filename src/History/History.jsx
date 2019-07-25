import React from "react";
import { PropTypes } from "prop-types";
import Edit from "./Edit.jsx";

/* TODO: make this a function -- stateless */
function History(props) {
    const recentExpenses = props.recentExpenses; 
    /* TODO: use a js date library instead of this */
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    return(
      <div className="container card">
        <div className="center gray-777 mbs">
          All Expenses
        </div>
        <table className="table mbm">
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
                  {/* TODO this needs to change the state of the parent, eithe HOC or render props */}
                  <Edit recentExpenses={recentExpenses} />
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
