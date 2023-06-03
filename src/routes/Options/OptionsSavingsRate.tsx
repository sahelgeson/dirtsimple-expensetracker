import { useState } from 'react';
import { useGlobalState } from 'contexts';
import { Box, Button } from '@chakra-ui/react';
import { NumberInput, NumberInputField } from '@chakra-ui/react';
import { Dollar } from 'interfaces';

export const OptionsSavingsRate = () => {
  const { 
    monthlyBudgetLimit,
    setMonthlyBudgetLimit,
    savingsPercentRateGoal,
    setSavingsPercentRateGoal,
  } = useGlobalState();

  const [enteredMonthlyBudgetLimit, setEnteredMonthlyBudgetLimit] = useState<Dollar | undefined>();
  const [enteredSavingsPercentRate, setEnteredSavingsPercentRate] = useState<number | undefined>();
  const [isSaved, setIsSaved] = useState<boolean>(false);
  let isDisabled = true;

  let monthlyLimit = 0;
  let weeklyLimit = 0;
  const hasValidLimit = enteredMonthlyBudgetLimit !== undefined && !Number.isNaN(enteredMonthlyBudgetLimit);
  const hasGoal = enteredSavingsPercentRate !== undefined;
  if (hasValidLimit && hasGoal) {
    isDisabled = false;
    monthlyLimit = enteredMonthlyBudgetLimit * (1 - (enteredSavingsPercentRate / 100));
    weeklyLimit = Math.ceil(monthlyLimit / 4);
  }

  const handleFocus = () => {
    setIsSaved(false);
  }  

  const handleChangeBudgetLimit = (limit: number) => {
    const limitInDollars = Number.isNaN(limit) ? 0 : limit;
    setEnteredMonthlyBudgetLimit(limitInDollars);
    return true;
  }

  const handleChangeSavingsRate = (rate: number) => {
    const percent = Number.isNaN(rate) ? 0 : rate;
    setEnteredSavingsPercentRate(percent);
    return true;
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // do not save rate without a limit, would make no sense
    // rate can be 0
    if (!enteredMonthlyBudgetLimit || enteredSavingsPercentRate === undefined) { return false; }

    setMonthlyBudgetLimit(enteredMonthlyBudgetLimit);
    setSavingsPercentRateGoal(enteredSavingsPercentRate);
    setIsSaved(true);
    return;    
  }  

  return(
    <form onSubmit={handleSubmit}>
      <Box
        fontSize='sm'
        textAlign='center'
        mb={2}
        mt={4}
      >
        <label htmlFor="set-budget-limit">
          Enter Budget limit per month
        </label>
      </Box>

      <NumberInput 
        defaultValue={monthlyBudgetLimit}
        value={enteredMonthlyBudgetLimit}
        key={monthlyBudgetLimit} /* key to refresh since defaultValue is only for initial load */
        onChange={(_, valueAsNumber: number) => handleChangeBudgetLimit(valueAsNumber)}
        onFocus={handleFocus}
        size="xlg"
        variant="darkerBorder"
        mb={2}
      >
        <NumberInputField         
          width={'100%'} 
          placeholder="$0.00" 
        />
      </NumberInput>

      <Box
        fontSize='sm'
        textAlign='center'
        mt={4}
        mb={2}
      >
        <label htmlFor="set-savings-rate">
          Enter goal savings rate percentage
        </label>
      </Box>

      <NumberInput 
        defaultValue={savingsPercentRateGoal} 
        value={enteredSavingsPercentRate}
        key={savingsPercentRateGoal} /* key to refresh since defaultValue is only for initial load */
        onChange={(_, valueAsNumber: number) => handleChangeSavingsRate(valueAsNumber)}
        onFocus={handleFocus}
        size="xlg"
        variant="darkerBorder"
        mb={2}
      >
        <NumberInputField         
          width={'100%'} 
          placeholder="%"
        />
      </NumberInput>

      <Box
        fontSize='sm'
        textAlign='center'
        my={2}
        mt={6}
      >
        Weekly spending limit to get {enteredSavingsPercentRate}% savings rate:
      </Box>

      <Box
        fontSize='xlg'
        textAlign='center'
        my={4}
        mb={6}
      >
        ${weeklyLimit}
      </Box>

      <Button 
        type="submit"
        size="lg"
        width="100%"
        variant={isSaved ? 'success' : 'solid'}
        isDisabled={isDisabled}              
        colorScheme={isSaved ? '' : 'blue'}
        data-qa="options-savings-save-btn" 
      >
        <>{isSaved ? 'Saved!' : 'Save'}</>
      </Button>
         
    </form>       
  );
};

