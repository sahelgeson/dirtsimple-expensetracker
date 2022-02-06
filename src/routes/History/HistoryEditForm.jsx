import React, { useState, useEffect } from 'react';
import { useGlobalState } from 'contexts';
import { isAmountValid, formatDatetime } from 'helpers';
import { HistoryEditFormAmount } from './HistoryEditFormAmount';
import { HistoryEditFormCategory } from './HistoryEditFormCategory';
import { HistoryEditFormDatetime } from './HistoryEditFormDatetime';
import { HistoryEditFormButtons } from './HistoryEditFormButtons';

/*
interface IProps {
  thisExpense: IExpense;
  handleClick: () => void;
}
*/

export const HistoryEditForm = (props) => {
  const { allCategories, updateExpense, deleteExpense } = useGlobalState();
  const { thisExpense, handleClick } = props;

  // okay to initialize state with props here because props won't change due to UI flow
  // also we want the initial amount for disabling the save button
  const [amount, setAmount] = useState(thisExpense.amount);
  const [categoryId, setCategoryId] = useState(thisExpense.categoryId);
  const [datetime, setDatetime] = useState(thisExpense.datetime);

  const [isSaved, setIsSaved] = useState(false);
  const [isSaveDisabled, setIsSaveDisabled] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const isValid = isAmountValid(amount);
    /* if a user changes values back to original disable save button as affordance */
    if (
      amount === thisExpense.amount && 
      categoryId === thisExpense.categoryId && 
      datetime === thisExpense.datetime
    ) {
      setIsSaveDisabled(true);
      setIsSaved(false);  
    } else {
      setIsSaveDisabled(!isValid);
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
  const handleAmountChange = (event) => {
    setAmount(event.target.value);
  }

  const handleCategoryChange = (event) => {
    setCategoryId(event.target.value);
  }

  const handleDateChange = (event) => {
    console.count('date change');
    try {
      const date = formatDatetime(event.target.value);
      setDatetime(date);  
    } catch (e) { /* Chrome's datepicker is buggy and will sometimes have an empty string value */ }
  }

  const openModal = (event) => {
    event.preventDefault();
    setIsModalOpen(true);
  }

  const closeModal = () => {
    setIsModalOpen(false);
  }

  const deleteThisExpense = () => {
    deleteExpense(thisExpense.id);
    closeModal();
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!amount) { return false; } 
    const id = thisExpense.id;

    // TODO xkcd here
    const editedExpense = {
      id,     
      datetime,
      amount,
      categoryId,
    }

    updateExpense(editedExpense);
    setIsSaved(true);
  }  

  return( 
    <form  
      className="ftable__row phm pbm pts mbs"
    >
      <legend className="legend pvn pbs mbs">
        Edit
      </legend>
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
        handleClick={handleClick}
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
