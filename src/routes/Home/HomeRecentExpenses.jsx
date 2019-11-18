import React from "react";
import { Link } from "react-router-dom";
import { connect } from 'react-redux';
import HomeRecentExpensesListing from "./HomeRecentExpensesListing.jsx";

function HomeRecentExpenses(props){
  // TODO: consider moving this function into separate file to be reused
  const recentExpensesSorted = [...props.allExpenses].sort(function(a, b) {
    var dateA = new Date(a.datetime), dateB = new Date(b.datetime);
    return dateB - dateA;
  });

  const latestExpenseId = recentExpensesSorted.length && recentExpensesSorted[0].id;
  const numberOfRecentShown = 7; 

  const allCategories = [...props.categories];

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
              <HomeRecentExpensesListing
                expense={expense}
                latestExpenseId={latestExpenseId}
                thisCategory={thisCategory}
              />
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

export default connect(mapStateToProps)(HomeRecentExpenses);

