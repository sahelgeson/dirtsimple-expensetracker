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

import { AccordionButton, Box, GridItem, Grid } from '@chakra-ui/react';
import { EditIcon, NotAllowedIcon } from '@chakra-ui/icons';

export const HistoryListing = ({ 
  categoryId, 
  setAccordionIndex, 
  amount, 
  datetime, 
  handleClose, 
  isSaved, 
  isDeleted,
}: {
  categoryId: CategoryId;
  setAccordionIndex: React.Dispatch<React.SetStateAction<number>>;
  amount: Dollar;
  datetime: Datetime;
  handleClose: () => void;
  isSaved: boolean;
  isDeleted: boolean;
}): JSX.Element => {
  const { allCategories } = useGlobalState();

  const thisCategory = allCategories.filter((category: ICategory) => {
    return ( category.id === categoryId );
  }).pop(); /* just want the object inside */
  
  const handleAccordionToggle = () => {
    if (isDeleted) return;

    setAccordionIndex((prev: number) => {
      // TODO enforce typing on these
      if (prev !== -1) { handleClose(); }
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
      sx={{
        ...(isSaved && {
          background: 'green.100',
        }),
        ...(isDeleted && {
          background: 'red.100!important',
        })
      }}
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
          position: 'relative',
        }}>
          {isDeleted ? <NotAllowedIcon /> : <EditIcon />}
          {isSaved && (
            <Box sx={{
              position: 'absolute',
              right: '0.5rem',
              top: '-0.5rem', 
              fontSize: '1rem',
            }}>
              *
            </Box>
          )}
        </GridItem>
      </Grid>
    </AccordionButton>
  );
}
