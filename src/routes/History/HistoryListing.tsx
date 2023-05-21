import React from 'react';
import { format } from 'date-fns';

import { 
  ICategory,
  IExpense,
} from 'interfaces';
import { UNCATEGORIZED } from 'lib/constants';

import { AccordionButton, GridItem, Grid } from '@chakra-ui/react';
import { EditIcon } from '@chakra-ui/icons';

interface IProps {
  expense: IExpense;
  thisCategory: ICategory;
  setAccordionIndex: React.Dispatch<React.SetStateAction<number>>;
}

export const HistoryListing = (props: IProps): JSX.Element => {
  const { expense, thisCategory, setAccordionIndex } = props;

  const handleAccordionToggle = () => {
    setAccordionIndex((prev: number) => {
      // TODO enforce typing on this
      return (prev === -1) ? 0 : -1;
    }); 
  }

  return (
    <Grid
      templateColumns="12.5% 50% 25% 12.5%"
      py={2}
      pl={4}
      pr={2}
      alignItems="center"
    >
      <GridItem
        data-qa="history-amount"   
      >
        <span className="dollar inline-block">$</span>
        <span className="inline-block">
          {expense.amount}
        </span>
      </GridItem>
      <GridItem 
        className={(thisCategory.id !== UNCATEGORIZED) ?
            ""
          : "italic gray-777" }
        data-qa="history-category"   
      >
        {thisCategory.name}
      </GridItem>
      <GridItem>
        {format(new Date(expense.datetime), 'EEE')},&nbsp; 
        {new Date(expense.datetime).getMonth() + 1}/                  
        {new Date(expense.datetime).getDate()}
      </GridItem>
      <GridItem className="text-right">
        <AccordionButton onClick={handleAccordionToggle} borderRadius={4}>
          <EditIcon />
        </AccordionButton>
      </GridItem>
    </Grid>
  );
}
