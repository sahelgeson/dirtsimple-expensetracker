import { 
    ADD_EXPENSE, 
    UPDATE_EXPENSE_AMOUNT, 
    UPDATE_EXPENSE_CATEGORY, 
    UPDATE_EXPENSE_DATETIME, 
    DELETE_EXPENSE, 
} from '../constants/ActionTypes'

import cuid from 'cuid';

export const addExpense = ({
    id = cuid(),
    amount = 0,
    category = 'Uncategorized',
    datetime = new Date().toString(),
  } = {}) => ({
    type: ADD_EXPENSE,
    payload: { expense },
});

export const updateExpenseAmount = (amount = 0) => ({
    type: UPDATE_EXPENSE_AMOUNT,
    payload: { amount },
});

export const updateExpenseCategory = (category = 'Uncategorized') => ({
    type: UPDATE_EXPENSE_CATEGORY,
    payload: { category },
});

export const updateExpenseDatetime = (datetime = 'Sat Jan 30 1971 12:46:47 GMT-0400 (Eastern Daylight Time)') => ({
    type: UPDATE_EXPENSE_DATETIME,
    payload: { datetime },
});


export const deleteExpense = (expense = {}) => ({
    type: DELETE_EXPENSE,
    expense,       // no payload needed? 
});
  
