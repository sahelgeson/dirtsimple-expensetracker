import React, { useState, useEffect } from "react";
import cuid from 'cuid';
import { Box, Card, Button, Select } from '@chakra-ui/react';
import { useDisclosure, Collapse } from '@chakra-ui/react';

import { useGlobalState } from 'contexts';
import { formatDatetime, parseStoredAmount } from 'helpers';
import { NumberInput, NumberInputField } from '@chakra-ui/react';
import { UNCATEGORIZED } from 'lib/constants';
import { CategoryId, Dollar, EmptyString } from 'interfaces';

const highlightBottom = '0 4px 3px 1px #FCFCFC';
const shadowBottom = '0 6px 8px #ebebeb';
const shadowInsetHover = 'inset 0 0 3px 3px #CECFD1';
const shadowInsetFocus = 'inset 0 0 10px 0px rgba(0, 0, 250, .6)';
const shadowInsetActive = 'inset 0 0 5px 3px #eee';

const buttonShadowBase = `${highlightBottom}, ${shadowBottom}`;
const buttonShadowHover = `${buttonShadowBase}, ${shadowInsetHover}`;
const buttonShadowFocus = `${buttonShadowBase}, ${shadowInsetFocus}`;
const buttonShadowActive = `${buttonShadowBase}, ${shadowInsetActive}`;

const cardBorderRadius = 110;

const cardPressableSx = {
  background: 'linear-gradient(to top, #f6f6f6 0%, #fff 60%, #FDFDFD 100%)',
  boxShadow: '2px 3px 8px 3px rgba(0, 0, 0, 0.05)',
  padding: 2,
  borderRadius: cardBorderRadius,
  border: '1px solid #d3d3d3',
  transition: 'all .2s ease',
  '@keyframes active': {
    '0%': {
      boxShadow: `${buttonShadowFocus}`,
    },
    '100%': {
      boxShadow: `${buttonShadowHover}`,
    }
  },
  '& > *': {
    transition: 'transform .2s ease',
  }, 
  '&.active': {
    boxShadow: `${buttonShadowActive}`,
    '& > *': {
    },    
  },    
}

const clickTapThroughElementIds = ['amount', 'category', 'submitButton'];

export const HomeForm = () => {
  const { allCategories, addExpense } = useGlobalState();
  const { isOpen, onToggle } = useDisclosure();
  const [isActiveCard, setIsActiveCard] = useState<boolean>(false);

  /* TODO: change this eventually so user can set default category */
  //const defaultCategoryId = allCategories[0]?.id  || [];

  const [amount, setAmount] = useState<Dollar | EmptyString>('');
  const [categoryId, setCategoryId] = useState<CategoryId>('');
  const [isSaved, setIsSaved] = useState<boolean>(false);

  useEffect(() => {
    setCategoryId(allCategories[0]?.id);
  }, [allCategories]);

  const handleSpecialCaseClick = () => {
    /* 
      if isSaved is true, we want user to be able to click anywhere in card
      other than form controls, that is why button is not disabled on save
      (click events don't propagate from disabled buttons)
      This just bubbles up depending on whether expense was saved or not to
      allow Card to open
    */
    return isSaved;
  }

  const handleOpenCollapsible = (event: React.MouseEvent<HTMLElement>) => {
    // never collapse via interaction, only resets when user reloads/returns to page
    // so only do one time

    // click events need to just bubble up if open and unsaved
    if (isOpen && !isSaved) return true;
    const targetId = (event.target as HTMLElement)?.id; 

    const isClickTapThrough = clickTapThroughElementIds.includes(targetId);
    // reset and focus on amount if opening Card
    if (!isClickTapThrough) {
      if (!isOpen) {
        onToggle();
      } 
      document.getElementById('amount')?.focus();
    }

    return false;
  }

  /*
    using a class here instead of the :active css pseudoselector because iOS's implementation
    of :focus-within is buggy. To avoid that just doing it manually
    see: https://itnext.io/fixing-focus-for-safari-b5916fef1064
  */
  const handleActiveState = (event: React.TouchEvent<HTMLElement>, isActive: boolean) => {
    // only trigger active state if user isn't already interacting with the form
    if (isOpen) return true;

    const targetId = (event.target as HTMLElement)?.id; 
    const isClickTapThrough = clickTapThroughElementIds.includes(targetId);
    if (!isClickTapThrough) {
      setIsActiveCard(isActive);
      return false;
    }
    return true;
  }

  const handleAmountChange = (valueAsNumber: number) => {
    if (!isOpen) {
      onToggle();
    }

    if (Number.isNaN(valueAsNumber)) {
      setAmount('');
    } else {
      setAmount(valueAsNumber);
    }
  }

  const handleCategoryChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setCategoryId(event.currentTarget.value);
    setIsSaved(false);
  }

  const handleFocus = () => {
    setAmount('');
    setIsSaved(false);
  }

  const handleSubmit = (event: React.SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!amount) {  // don't submit on 0 or NaN or ''
      setIsSaved(false);
      return false; 
    }  

    if (!categoryId) { return false; }
      
    setIsSaved(true);

    /* Doing this to avoid issues with ISO/UTC/timezones. 
        We just want the local date and time for all entries, if a user tracks an expense
        in a different timezone at 11pm, we don't need to convert it or have it show up as a 
        different time or even day in the UI. We use toString because JSON.stringify will use
        Date.toISOString on Date objects but not strings, and we don't want the timezone info */
    const datetime = formatDatetime();

    const id = cuid();

    const newExpense = {
      id,
      datetime,
      amount: parseStoredAmount(amount),
      categoryId
    }

    addExpense(newExpense);
    return;
  }  

  return (    
    <Card sx={cardPressableSx} 
      onClick={handleOpenCollapsible}
      onTouchStart={(e) => handleActiveState(e, true)}
      onTouchEnd={(e) => handleActiveState(e, false)}
      className={isActiveCard ? 'active' : ''}
    >
      <Box 
        px={8} 
        py={24} 
        sx={{
          background: 'linear-gradient(to bottom, #f8f8f8 0%, #fff 20%, #FDFDFD 100%)',
          borderRadius: cardBorderRadius,
        }}
      >
        <form onSubmit={handleSubmit}>
          <label 
            htmlFor="amount"
            className="sr-only"            
          >
            Enter amount of this expense  
          </label>

          <NumberInput 
            id="amount"
            value={amount}
            onChange={(_, valueAsNumber) => handleAmountChange(valueAsNumber)}
            onClick={(e) => e.stopPropagation()}
            onFocus={handleFocus}        
            size="xlg"
            variant="darkerBorder"
            mb={2}
          >
            <NumberInputField         
              width={'100%'} 
              sx={{ backgroundColor: 'white' }}
              placeholder="$0.00"
              data-qa="main-form-amount-input" 
            />
          </NumberInput>

          <Box mt={4} mb={2}>
            <label
              htmlFor="category"
              className="block text-center gray-777 mbs"
            >
              Category
            </label>
          </Box>

          <Select 
            id="category"
            placeholder="Select category"
            size="xlg"
            variant="darkerBorder"
            value={categoryId} 
            onChange={handleCategoryChange}
            onClick={(e) => e.stopPropagation()}
            data-qa="main-form-category-input" 
          >     
            {allCategories
              .filter((category) => {
                return category.id !== UNCATEGORIZED
              })
              .map((category) => {
                return (
                  <option 
                    key={category.id}
                    value={category.id}
                  >
                    {category.name}
                  </option>
              )}
            )}
          </Select>

          <Collapse in={isOpen} animateOpacity>
            <Button 
              size="xlg"
              id="submitButton"
              type="submit"
              variant={isSaved ? 'text' : 'solid'}
              isDisabled={!amount}   
              onClick={handleSpecialCaseClick}
              width="100%"
              data-qa="main-form-save-btn"  
              colorScheme={isSaved ? '' : 'blue'}
              sx={{ 
                ...(isSaved && {
                  color: 'green.600' 
                }),
                mt: 8,              
              }}
            >
              <>{isSaved ? 'Saved!' : 'Save'}</>
            </Button>
          </Collapse>              
        </form>
      </Box>
    </Card>
  );
}
