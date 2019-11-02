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
    payload: { expense },       // 'expense' is not defined
});

/*
TODO: change update actions to curry a base function to simplify both this and reducers
const updateCreator = (id, value, valueType) => ({
    type: UPDATE_EXPENSE_AMOUNT,
    payload: { 
        id,
        value,
        valueType,
    },
});

export const updateExpenseAmount = (id = 0, value = 0, valueType = 'amount') => ({
    type: UPDATE_EXPENSE_AMOUNT,
    payload: { 
        id,
        value,
        valueType,
    },
});
*/

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
    payload: { id },            // TODO: 'id' is not defined  
});
  
