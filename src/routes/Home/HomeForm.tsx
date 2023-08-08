import React, { useState, useEffect } from "react";
import cuid from 'cuid';
import { Box, Card, Button, Select } from '@chakra-ui/react';
import { useDisclosure, Collapse } from '@chakra-ui/react';

import { useGlobalState } from 'contexts';
import { formatDatetime, parseStoredAmount } from 'helpers';
import { NumberInput, NumberInputField } from '@chakra-ui/react';
import { UNCATEGORIZED } from 'lib/constants';
import { CategoryId, Dollar, EmptyString } from 'interfaces';

export const HomeForm = () => {
  const { allCategories, addExpense } = useGlobalState();
  const { isOpen, onToggle } = useDisclosure();

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

    // reset and focus on amount if opening Card
    if (targetId !== 'amount' && targetId !== 'category') {
      if (!isOpen) {
        onToggle();
      } 
      document.getElementById('amount')?.focus();
    }

    return false;
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
    <Card p={12} pt={24} pb={isSaved ? 12 : 24} sx={{ borderRadius: 110 }} onClick={handleOpenCollapsible}>
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
          onFocus={handleFocus}        
          size="xlg"
          variant="darkerBorder"
          mb={2}
        >
          <NumberInputField         
            width={'100%'} 
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
    </Card>
  );
}
