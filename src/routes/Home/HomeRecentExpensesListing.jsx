import React, { useEffect, useRef } from 'react';
import styled, { keyframes, css } from 'styled-components';

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

/*
interface {
  expense: IExpense;
  latestExpenseId: string;
  thisCategory: ICategory;
}
*/

export const HomeRecentExpensesListing = (props) => {
  const firstLoadFlagForAnimation = useRef(true);

  useEffect(() => {
    firstLoadFlagForAnimation.current = false;
  });

  const { 
    expense,
    latestExpenseId,
    thisCategory, 
   } = props;

  return(
    <Transition 
      key={expense.id} 
      active={!firstLoadFlagForAnimation.current && (expense.id === latestExpenseId)}
      className="tr"
    >     
      <div className="td pls pvs">
        <span className="dollar inline-block">$</span>
        <span className="inline-block">
          {expense.amount}
        </span>
      </div>
      <div
          className={(thisCategory.id !== null) ?
            "td plm pvs"
          : "td plm pvs italic gray-777" }            
      >
        {thisCategory.name}   
      </div>
      <div className="td text-right prs pvs">
        {new Date(expense.datetime).getMonth() + 1}/                  
        {new Date(expense.datetime).getDate()}
      </div>           
    </Transition>
  );
}


