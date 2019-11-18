import React, { useEffect, useRef } from "react";
import { PropTypes } from "prop-types";
import styled, { keyframes, css } from "styled-components";

function HomeRecentExpensesListing(props){
  const firstLoadFlag = useRef(true);

  const highlightfade = keyframes`{
      from { background: rgba(255, 220, 110, 0.8); }
      to { background: transparent; }
    }
  `;

  const Transition = styled.div`
    ${props => props.active && css`
      animation: 1.5s ${highlightfade};
    `}
  `;

  useEffect(() => {
    firstLoadFlag.current = false;
  });

  const expense = props.expense;

  return(
    <Transition 
      key={expense.id} 
      active={!firstLoadFlag.current && (expense.id === props.latestExpenseId)}
      className="tr"
    >     
      <div className="td pls pvs">
        <span className="dollar inline-block">$</span>
        <span className="inline-block">
          {expense.amount}
        </span>
      </div>
      <div
          className={(props.thisCategory.id !== null) ?
            "td plm pvs"
          : "td plm pvs italic gray-777" }            
      >
        {props.thisCategory.name}   
      </div>
      <div className="td text-right prs pvs">
        {new Date(expense.datetime).getMonth() + 1}/                  
        {new Date(expense.datetime).getDate()}
      </div>           
    </Transition>
  );
}

HomeRecentExpensesListing.propTypes = {
  expense: PropTypes.object.isRequired,
  latestExpenseId: PropTypes.string.isRequired,
  thisCategory: PropTypes.object.isRequired,
};

export default HomeRecentExpensesListing;

