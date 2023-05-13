import React, { useState, useEffect } from "react";
import cuid from 'cuid';
import { Box, Select, BeatLoader } from '@chakra-ui/react';

import { useGlobalState } from 'contexts';
import { isAmountValid, formatDatetime } from 'helpers';
import { Button } from '@chakra-ui/react';
import { NumberInput, NumberInputField } from '@chakra-ui/react';
import { UNCATEGORIZED } from 'lib/constants';

export const HomeForm = () => {
  const { allCategories, addExpense } = useGlobalState();

  /* TODO: change this eventually so user can set default category */
  //const defaultCategoryId = allCategories[0]?.id  || [];

  const [amount, setAmount] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    setCategoryId(allCategories[0]?.id);
  }, [allCategories]);

  const handleAmountChange = (value) => {
    setAmount(value);
  }

  const handleCategoryChange = (event) => {
    setCategoryId(event.currentTarget.value);
  }


  const handleFocus = () => {
    setAmount('');
    setIsSaved(false);
  }

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!amount) { 
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
      amount,
      categoryId
    }

    addExpense(newExpense);
  }  

  return (
    <form onSubmit={handleSubmit}>
      <label 
        htmlFor="amount"
        className="sr-only"            
      >
        Enter amount of this expense  
      </label>

      <NumberInput 
        defaultValue={amount}
        value={amount}
        onChange={(valueString) => handleAmountChange(valueString)}
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
        mb={8}
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

      <Button 
        size="xlg"
        type="submit"
        variant={isSaved ? 'success' : 'solid'}
        isDisabled={!isAmountValid(amount)}   
        width="100%"
        data-qa="main-form-save-btn"  
        colorScheme={isSaved ? '' : 'blue'}
      >
        <>{isSaved ? 'Saved!' : 'Save'}</>
      </Button>

    </form>
  );
}
