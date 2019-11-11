import React, { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { connect } from 'react-redux';
import styled, { keyframes, css } from "styled-components";

function RecentExpenses(props){
  // TODO: consider moving this function into separate file to be reused
  const recentExpensesSorted = [...props.allExpenses].sort(function(a, b) {
    var dateA = new Date(a.datetime), dateB = new Date(b.datetime);
    return dateB - dateA;
  });

  const latestExpenseId = recentExpensesSorted.length && recentExpensesSorted[0].id;
  const numberOfRecentShown = 7; 

  const allCategories = [...props.categories];

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

  return(
    <div className="card phm pvm mbl">
      <div className="center gray-777 mbs">
        Recent Expenses
      </div>
      <div 
        className="table font-14 full-width mbl"
        data-qa="recent-expenses"
      >
        {recentExpensesSorted.slice(0,numberOfRecentShown).map((expense) => {
            const thisCategory = allCategories.filter((category) => {
              return ( category.id === expense.categoryId );
            }).pop(); /* just want the object inside */

            return (
              <Transition 
                key={expense.id} 
                active={!firstLoadFlag.current && (expense.id === latestExpenseId)}
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
        )}    
        
      </div>

      <div className="text-center mvm">
        <Link to="/history"
          className="link link--arrow relative phm"
          data-qa="main-form-see-all-btn"
        >
          See all expenses
        </Link>              
      </div> 
    </div>
  );
}

function mapStateToProps(state) {
  return {
    allExpenses: state.allExpenses,
    categories: state.categories,
  };
}

export default connect(mapStateToProps)(RecentExpenses);

