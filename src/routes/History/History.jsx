import React, { useState, useEffect } from "react";
import { HistoryEditForm } from './HistoryEditForm';
import { HistoryListing } from "./HistoryListing";
import { useGlobalState } from 'contexts';

export const History = () => {
  /* this is the id of the expense being edited, only allow one at a time */
  const [isBeingEditedId, setIsBeingEditedId] = useState(null);  // TODO review usage of null

  const { allExpenses, allCategories, sortExpenses } = useGlobalState();

  const handleClick = (event) => {    
    const thisId = event.target.value;
    (isBeingEditedId === thisId)
      ? setIsBeingEditedId(null)
      : setIsBeingEditedId(thisId);
  }

  /* Sort expenses by date by default only for initial load. Setting this up only onmount so we're
    not sorting in edit form because we don't want state to update and rerender which could
    yoink stuff around -- in other words we save any edits made by HistoryEditForm,
    but we don't re-sort the expenses except on load/reload */
  useEffect(() => {
    sortExpenses();
  }, []);

  useEffect(() => {
    setIsBeingEditedId(null);
  }, [allExpenses.length]);

  return(
    <div className="container margin-0-auto phs">
      {(!allExpenses.length) 
        ? <div className="text-center">No expenses entered yet</div>
        : <div className="ftable font-16">
        {/* TODO consider a limit on this with a "View more" button */}
        {allExpenses.map((expense) => {
            const thisCategory = allCategories.filter((category) => {
              return ( category.id === expense.categoryId );
            }).pop(); /* just want the object inside */

            return (
                <React.Fragment key={expense.id}>
                  <HistoryListing
                    key={expense.id}
                    expense={expense}
                    isBeingEditedId={isBeingEditedId}
                    thisCategory={thisCategory}
                    handleClick={handleClick}
                  />

                  {/* Adds visibility hidden to element instead of returning null so the space doesn't
                      collapse and have text move a pixel or two */}
                  <div className={(expense.id !== isBeingEditedId - 1) && (expense.id !== isBeingEditedId) ?
                        "full-width divider divider--dotted mvn"
                      : "full-width divider divider--dotted mvn visibility-hidden" }
                  />

                  {(expense.id === isBeingEditedId) &&
                    <HistoryEditForm 
                      thisExpense={expense} 
                      isBeingEditedId={isBeingEditedId}
                      handleClick={handleClick}
                    />
                  }
                </React.Fragment>
            );
          }
        )}
      </div>}
    </div>
  );
}
