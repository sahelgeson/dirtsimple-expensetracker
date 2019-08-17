import React from "react";
import { PropTypes } from "prop-types";
import { Link } from "react-router-dom";
import styled, { keyframes, css } from "styled-components";

function RecentExpenses(props){
  const recentExpensesSorted = props.recentExpenses.sort(function(a, b) {
    var dateA = new Date(a.datetime), dateB = new Date(b.datetime);
    return dateB - dateA;
  });
  const numberOfRecentShown = 7; 

  const highlightfade = keyframes`{
      from { background: orange; }
      to { background: transparent; }
    }
  `;

  const Transition = styled.div`
    ${props => props.active && css`
      animation: 1.5s ${highlightfade};
    `}
  `;

  return(
    <div className="card phm pvm">
      <div className="center gray-777 mbs">
        Recent Expenses
      </div>
      <div className="table font-14 full-width mbm">
        {recentExpensesSorted.slice(0,numberOfRecentShown).map((expense, i) =>
          <Transition 
            key={i} 
            active={!i}
            className="tr"
          >     
            <div className="td pls pvs">
              <span className="dollar inline-block">$</span>
              <span className="inline-block">
                {expense.amount}
              </span>
            </div>
            <div className="td plm pvs">
              {expense.category}
            </div>
            <div className="td text-right prs pvs">
              {new Date(expense.datetime).getMonth() + 1}/                  
              {new Date(expense.datetime).getDate()}
            </div>           
          </Transition>    
        )}    
      </div>

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
