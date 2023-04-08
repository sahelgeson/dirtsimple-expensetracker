import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Accordion, 
  AccordionItem, 
  AccordionPanel, 
  Box, 
  Divider,
} from '@chakra-ui/react';
import { HistoryAccordion } from './HistoryAccordion';
import { HistoryEditForm } from './HistoryEditForm';
import { HistoryListing } from './HistoryListing';
import { useGlobalState } from 'contexts';
import { NUM_OF_RECENT_EXPENSES } from 'lib/constants';

export const History = () => {
  const { recentExpensesUnfiltered, allCategories, sortExpenses } = useGlobalState();

  /* Sort expenses by date by default only for initial load. Setting this up only onmount so we're
    not sorting in edit form because we don't want state to update and rerender which could
    yoink stuff around -- in other words we save any edits made by HistoryEditForm,
    but we don't re-sort the expenses except on load/reload */
  useEffect(() => {
    sortExpenses();
  }, []);

  return(

   <div className="container margin-0-auto phs">
      {(!recentExpensesUnfiltered.length) 
        ? (
          <div className="text-center">No expenses entered yet</div>
        ) : (
          <div>
            {recentExpensesUnfiltered.map((expense) => {
                const thisCategory = allCategories.filter((category) => {
                  return ( category.id === expense.categoryId );
                }).pop(); /* just want the object inside */

                /* each item has to have it's own <Accordion> otherwise there are serious performance issues.
                    This means can't limit to only one open at a time without some hacky workaround */
                return (
                  <HistoryAccordion expense={expense} thisCategory={thisCategory} key={expense.id} />
                );
              }
            )}
            <Box 
              my={4}
              color="gray.500"
              textAlign="center"
            >
              {/* TODO think about adding View More functionality */}
              Showing {NUM_OF_RECENT_EXPENSES} most recent expenses.
            </Box>
          </div>
        )}
    </div>
  );
}
