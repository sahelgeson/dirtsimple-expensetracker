import React, { useState, useEffect, ChangeEvent } from 'react';
import { Text } from '@chakra-ui/react';
import { useGlobalState } from 'contexts';
import { parseStoredAmount, formatDatetime } from 'helpers';
import { HistoryEditFormAmount } from './HistoryEditFormAmount';
import { HistoryEditFormCategory } from './HistoryEditFormCategory';
import { HistoryEditFormDatetime } from './HistoryEditFormDatetime';
import { HistoryEditFormButtons } from './HistoryEditFormButtons';
import { IExpense } from 'interfaces';

interface IProps {
  thisExpense: IExpense;
  handleClose: () => void;
}

export const HistoryEditForm = (props: IProps): JSX.Element => {
  const { allCategories, updateExpense, deleteExpense } = useGlobalState();
  const { thisExpense, handleClose } = props;

  // okay to initialize state with props here because props won't change due to UI flow
  // also we want the initial amount for disabling the save button
  const [amount, setAmount] = useState(thisExpense.amount);
  const [categoryId, setCategoryId] = useState(thisExpense.categoryId);
  const [datetime, setDatetime] = useState(thisExpense.datetime);

  const [isSaved, setIsSaved] = useState(false);
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
    console.count('date change');
    try {

      const date = formatDatetime(e.currentTarget.value);
      setDatetime(date);  
    } catch (e) { /* Chrome's datepicker is buggy and will sometimes have an empty string value */ }
  }

  const openModal = (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setIsModalOpen(true);
  }

  const closeModal = () => {
    setIsModalOpen(false);
  }

  const deleteThisExpense = () => {
    deleteExpense(thisExpense);
    closeModal();
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!amount) { return false; } 
    const id = thisExpense.id;

    const editedExpense = {
      id,     
      datetime,
      amount: parseStoredAmount(amount),
      categoryId,
    }

    updateExpense(editedExpense);
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

      <HistoryEditFormButtons 
        amount={amount}
        handleClose={handleClose}
        handleSubmit={handleSubmit}
        isSaveDisabled={isSaveDisabled}
        isSaved={isSaved}
        isModalOpen={isModalOpen}          
        openModal={openModal}
        closeModal={closeModal}
        deleteThisExpense={deleteThisExpense}
      />
    </form>
  );
}
