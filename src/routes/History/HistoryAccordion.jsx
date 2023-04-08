import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Accordion, 
  AccordionItem, 
  AccordionPanel, 
  Box, 
  Divider,
} from '@chakra-ui/react';
import { HistoryEditForm } from './HistoryEditForm';
import { HistoryListing } from './HistoryListing';
import { useGlobalState } from 'contexts';
import { NUM_OF_RECENT_EXPENSES } from 'lib/constants';

//export type IAccordionIndex = -1 | 0;

export const HistoryAccordion = (props) => {
  const { expense, thisCategory } = props;

  const [accordionIndex, setAccordionIndex] = useState(-1);  // -1 closes accordion, 0 opens it

  const handleClose = (event) => {    
    setAccordionIndex(-1);
  }

  return(
    <Accordion allowToggle width="100%" index={accordionIndex}>
      <AccordionItem 
        border="1px solid transparent"
        width="100%"    /* TODO should add active/recently edited state to this */
      >
        <HistoryListing
          expense={expense}
          thisCategory={thisCategory}
          setAccordionIndex={setAccordionIndex}
        />
          
        <AccordionPanel>
          <HistoryEditForm 
            thisExpense={expense} 
            handleClose={handleClose}
          />
        </AccordionPanel>
      </AccordionItem>
      <Divider />
    </Accordion>
  );
}
