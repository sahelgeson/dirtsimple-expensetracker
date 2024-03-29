import React from 'react';
import { format } from 'date-fns';
import { useGlobalState } from 'contexts';

import { 
  CategoryId,
  Datetime,
  Dollar,
  ICategory,
} from 'interfaces';
import { UNCATEGORIZED } from 'lib/constants';

import { AccordionButton, GridItem, Grid } from '@chakra-ui/react';
import { EditIcon } from '@chakra-ui/icons';

interface IProps {
  categoryId: CategoryId;
  setAccordionIndex: React.Dispatch<React.SetStateAction<number>>;
  amount: Dollar;
  datetime: Datetime;
}

export const HistoryListing = (props: IProps): JSX.Element => {
  const { categoryId, setAccordionIndex, amount, datetime } = props;
  const { allCategories } = useGlobalState();

  const thisCategory = allCategories.filter((category: ICategory) => {
    return ( category.id === categoryId );
  }).pop(); /* just want the object inside */
  

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
          {amount}
        </span>
      </GridItem>
      <GridItem 
        className={(thisCategory?.id !== UNCATEGORIZED) ?
            ""
          : "italic gray-777" }
        data-qa="history-category"   
      >
        {thisCategory?.name}
      </GridItem>
      <GridItem>
        {format(new Date(datetime), 'EEE')},&nbsp; 
        {new Date(datetime).getMonth() + 1}/                  
        {new Date(datetime).getDate()}
      </GridItem>
      <GridItem className="text-right">
        <AccordionButton onClick={handleAccordionToggle} borderRadius={4}>
          <EditIcon />
        </AccordionButton>
      </GridItem>
    </Grid>
  );
}
