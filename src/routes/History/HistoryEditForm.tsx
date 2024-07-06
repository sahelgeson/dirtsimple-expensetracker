import React, { useState, useEffect, ChangeEvent } from 'react';
import { Button, Grid, GridItem, Text } from '@chakra-ui/react';
import { useGlobalState } from 'contexts';
import { parseStoredAmount, formatDatetime } from 'helpers';
import { HistoryEditFormAmount } from './HistoryEditFormAmount';
import { HistoryEditFormCategory } from './HistoryEditFormCategory';
import { HistoryEditFormDatetime } from './HistoryEditFormDatetime';
import { DeleteButton } from './DeleteButton';
import { IExpense, CategoryId, Datetime, Dollar, Uuid } from 'interfaces';

export const HistoryEditForm = ({ 
  thisExpense, 
  handleClose, 
  amount, 
  categoryId, 
  datetime, 
  setAmount, 
  setCategoryId, 
  setDatetime, 
  isSaved, 
  setIsSaved,
  setIsDeleted,
  updateBuffer,
}: {
  thisExpense: IExpense;
  handleClose: (isSaved: boolean) => void;
  amount: Dollar;
  categoryId: CategoryId;
  datetime: Datetime;
  setAmount: React.Dispatch<React.SetStateAction<Dollar>>;
  setCategoryId: React.Dispatch<React.SetStateAction<CategoryId>>;
  setDatetime: React.Dispatch<React.SetStateAction<Datetime>>;
  isSaved: boolean;
  setIsSaved: React.Dispatch<React.SetStateAction<boolean>>;
  setIsDeleted: React.Dispatch<React.SetStateAction<boolean>>;
  updateBuffer: ({ id, amount, categoryId }: { id: Uuid, amount?: Dollar, categoryId?: CategoryId }) => void;
}): JSX.Element => {
  const { allCategories, updateExpense, deleteExpense } = useGlobalState();

  const [isSaveDisabled, setIsSaveDisabled] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    /* if a user changes values back to original disable save button as affordance */
    if (
      amount === thisExpense.amount && 
      categoryId === thisExpense.categoryId && 
      datetime === thisExpense.datetime
    ) {
      setIsSaveDisabled(true);
      setIsSaved(false);  
    } else {
      setIsSaveDisabled(!amount); // user can enter 0 but cannot save it, see if there's better way to enforce this
      setIsSaved(false);
    }
  }, [amount, categoryId, datetime]);

  /* 
    when a user opens the form, the save button is disabled, but as soon as any of the inputs are changed
    the save button should be enabled (as long as the amount is valid) 
  */
  useEffect(() => {
    setIsSaveDisabled(true);
    setIsSaved(false);
  }, []);

  // TODO review handlers
  const handleAmountChange = (valueAsNumber: number) => {
    if (valueAsNumber) {
      setAmount(valueAsNumber);
    }
  }

  const handleCategoryChange = (e: ChangeEvent<HTMLInputElement>) => {
    setCategoryId(e.currentTarget.value);
  }

  const handleDateChange = (e: ChangeEvent<HTMLInputElement>) => {
    try {
      const date = formatDatetime(e.currentTarget.value);
      setDatetime(date);  
    } catch (e) { /* Chrome's datepicker is buggy and will sometimes have an empty string value */ }
  }

  const openModal = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setIsModalOpen(true);
  }

  const closeModal = () => {
    setIsModalOpen(false);
  }

  const deleteThisExpense = () => {
    deleteExpense(thisExpense);
    setIsDeleted(true);
    closeModal();
    handleClose(true);
  }

  const handleSubmit = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (!amount) { return false; } 
    const id = thisExpense.id;
    const parsedAmount = parseStoredAmount(amount);

    const editedExpense = {
      id,     
      datetime,
      amount: parsedAmount,
      categoryId,
    }

    updateExpense(editedExpense);
    // update buffered expenses on save, don't changes to datetime (don't want exps moving around onscreen)
    if (parsedAmount !== thisExpense.amount) {
      updateBuffer({ id, amount: parsedAmount })
    }
    if (categoryId !== thisExpense.categoryId) {
      updateBuffer({ id, categoryId })
    }

    setIsSaved(true);
    return;    
  }  

  return( 
    <form>
      <Text
        textAlign="center"
        width="100%"
        fontStyle="italic"
        color="gray.500"
        mb={2}
      >
        Editing
      </Text>
      <div className="full-width pbm">
        <HistoryEditFormAmount  
          amount={amount} 
          handleAmountChange={handleAmountChange} 
        />
        <HistoryEditFormCategory 
          category={categoryId} 
          allCategories={allCategories} 
          handleCategoryChange={handleCategoryChange} 
        />
        <HistoryEditFormDatetime 
          datetime={datetime} 
          handleDateChange={handleDateChange} 
        />
      </div>

      <Grid
         templateColumns='repeat(3, 1fr)' 
         gap={4}
      >
        <GridItem>
        <DeleteButton 
          openModal={openModal}
          closeModal={closeModal}
          isModalOpen={isModalOpen}
          deleteThisExpense={deleteThisExpense}
        /> 
        </GridItem>
        <GridItem>
        <Button 
          width={'100%'}
          colorScheme='gray'
          size='lg' 
          onClick={() => handleClose(isSaved)}              
        >
          Close
        </Button>
        </GridItem>
        <GridItem>
        <Button 
          width={'100%'}
          size="lg"
          onClick={handleSubmit} 
          variant={isSaved ? 'success' : 'solid'}
          isDisabled={isSaveDisabled}   
          data-qa='history-form-save-btn' 
          colorScheme={isSaved ? '' : 'blue'}
        >
          <>{isSaved ? 'Saved!' : 'Save'}</>
        </Button>
        </GridItem>
      </Grid>
    </form>
  );
}
