import React, { useState, useEffect } from "react";
import cuid from 'cuid';

import { useGlobalState } from 'contexts';
import { isAmountValid, formatDatetime } from 'helpers';

export const HomeForm = () => {
  const { allCategories, addExpense } = useGlobalState();

  /* TODO: change this eventually so user can set default category */
  //const defaultCategoryId = allCategories[0]?.id  || [];

/*

export interface IExpense {
  id: Uuid;
  amount: Dollars;   // TODO migrate to Cents string
  datetime: Datetime;
  categoryId: number | string | null; // TODO change null to Symbol?
}

*/

  const [amount, setAmount] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    setCategoryId(allCategories[0]?.id);
  }, [allCategories]);

  const handleAmountChange = (event) => {
    setAmount(event.target.value);
  }

  const handleCategoryChange = (event) => {
    setCategoryId(event.target.value);
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
    <form 
      onSubmit={handleSubmit}
      className="mbl"
    >
      {/* Adds visibility hidden to element instead of returning null so the space doesn't
          collapse and have text move a pixel or two 
          
          TODO: check a11y on this */}
      <div className={isSaved ?
            "status text-center gray-777 font-14"
          : "status text-center gray-777 font-14 visibility-hidden" }
      >
        Saved!
      </div>

      <label 
        htmlFor="amount"
        className="sr-only"            
      >
        Enter amount of this expense  
      </label>
      <input 
        id="amount"
        className="input gray-border full-width font-25 mvm"
        type="number" 
        placeholder="$0.00" 
        min="0.01" 
        step="0.01"
        pattern="\d*"
        onChange={handleAmountChange}
        onFocus={handleFocus}
        value={amount}
        data-qa="main-form-amount-input"    
      />

      <label
        htmlFor="category"
        className="block text-center gray-777 mbs"
      >
        Category
      </label>
      <select
        id="category"
        className="select-css input input-secondary full-width font-25 mbm"
        value={categoryId} 
        onChange={handleCategoryChange}
        data-qa="main-form-category-input" 
      >
        {allCategories
          .filter((category) => {
            return category.id !== null
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
      </select>

      <input 
        className="input btn btn--blue full-width font-25 mvm"
        type="submit" 
        disabled={!isAmountValid(amount)}
        value="Save" 
        data-qa="main-form-save-btn"          
      />
    </form>
  );
}
