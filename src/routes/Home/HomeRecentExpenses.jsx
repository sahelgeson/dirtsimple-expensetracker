import React from 'react';
import { Link } from 'react-router-dom';
import { useGlobalState } from 'contexts';
import { HomeRecentExpensesListing } from './HomeRecentExpensesListing';

const NUMBER_OF_RECENT_SHOWN = 7; 

export const HomeRecentExpenses = () => {
  const { allExpenses, allCategories } = useGlobalState();
  // TODO: consider moving this function into separate file to be reused
  // spread array because sort sorts array in-place
  const recentExpensesSorted = [...allExpenses].sort(function(a, b) {
    let dateA = new Date(a.datetime), dateB = new Date(b.datetime);
    return dateB - dateA;
  });

  const latestExpenseId = recentExpensesSorted.length && recentExpensesSorted[0].id;

  return(
    <div className="card phm pvm mbl">
      <div className="center gray-777 mbs">
        Recent Expenses
      </div>
      <div 
        className="table font-14 full-width mbl"
        data-qa="recent-expenses"
      >
        {recentExpensesSorted.slice(0,NUMBER_OF_RECENT_SHOWN).map((expense) => {
            const thisCategory = allCategories.filter((category) => {
              return ( category.id === expense.categoryId );
            }).pop(); /* just want the object inside */

            return (
              <HomeRecentExpensesListing
                key={expense.id}
                expense={expense}
                latestExpenseId={latestExpenseId}
                thisCategory={thisCategory}
              />
            );
          } 
        )}            
      </div>

      <div className="text-center mvm">
        <Link to="history"
          className="link link--arrow relative phm"
          data-qa="main-form-see-all-btn"
        >
          See all expenses
        </Link>              
      </div> 
    </div>
  );
}
