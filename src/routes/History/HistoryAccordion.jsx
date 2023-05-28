import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import cuid from 'cuid';
import { 
  Accordion, 
  AccordionItem, 
  AccordionPanel, 
  Box, 
  Divider,
} from '@chakra-ui/react';
import { HistoryEditForm } from './HistoryEditForm';
import { HistoryListing } from './HistoryListing';
import { NUM_OF_RECENT_EXPENSES } from 'lib/constants';

//export type IAccordionIndex = -1 | 0;

export const HistoryAccordion = (props) => {
  const { expense } = props;

  const [accordionIndex, setAccordionIndex] = useState(-1);  // -1 closes accordion, 0 opens it

  // using local state here because we want the listing to update based on form changes
  // but don't want to change global state which would yoink listing around on date changes
  // also we want the initial amount for disabling the save button
  const [amount, setAmount] = useState(expense.amount);
  const [categoryId, setCategoryId] = useState(expense.categoryId);
  const [datetime, setDatetime] = useState(expense.datetime);
  const [keyToRefresh, setKeyToRefresh] = useState();

  const handleClose = (isSaved) => {    
    if (!isSaved) {
      // reset values in HistoryListing
      setAmount(expense.amount);
      setCategoryId(expense.categoryId);
      setDatetime(expense.datetime);
      // reset values in inputs in form
      setKeyToRefresh(cuid());
    }
    setAccordionIndex(-1);
  }

  return(
    <Accordion allowToggle width="100%" index={accordionIndex}>
      <AccordionItem 
        border="1px solid transparent"
        width="100%"    /* TODO should add active/recently edited state to this */
      >
        <HistoryListing
          categoryId={categoryId}
          setAccordionIndex={setAccordionIndex}
          amount={amount}
          datetime={datetime}
        />

        <AccordionPanel>
          <HistoryEditForm 
            key={keyToRefresh}
            thisExpense={expense} 
            handleClose={handleClose}
            setAmount={setAmount}
            setCategoryId={setCategoryId}
            setDatetime={setDatetime}
            amount={amount}
            categoryId={categoryId}
            datetime={datetime}
          />
        </AccordionPanel>
      </AccordionItem>
      <Divider />
    </Accordion>
  );
}
