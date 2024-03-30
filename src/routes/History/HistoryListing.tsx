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
    <AccordionButton 
      onClick={handleAccordionToggle} 
      alignItems={'unset'} 
      textAlign={'initial'} 
      pl={4}
      pr={0}
    >
      <Grid
        templateColumns="0.5fr 1.5fr min-content min-content"
        py={2}
        gap={2}
        width={"100%"}
      >
        <GridItem
          data-qa="history-amount"
          sx={{ whiteSpace: 'nowrap' }}   
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
        <GridItem sx={{
          width: '44px',
          display: 'grid',
          placeContent: 'center',
        }}>
          <EditIcon />
        </GridItem>
      </Grid>
    </AccordionButton>
  );
}
