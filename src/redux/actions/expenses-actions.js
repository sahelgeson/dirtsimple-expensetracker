import { 
    ADD_EXPENSE, 
    UPDATE_EXPENSE_AMOUNT, 
    UPDATE_EXPENSE_CATEGORY, 
    UPDATE_EXPENSE_DATETIME, 
    DELETE_EXPENSE, 
} from '../constants/ActionTypes'

export const addExpense = (expense = {}) => ({
    type: ADD_EXPENSE,
    payload: expense,      
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

export const updateExpenseAmount = (id = 0, amount = 0) => ({
    type: UPDATE_EXPENSE_AMOUNT,
    payload: { id, amount },
});

export const updateExpenseCategory = (id = 0, categoryId = 0) => ({
    type: UPDATE_EXPENSE_CATEGORY,
    payload: { id, categoryId },
});

export const updateExpenseDatetime = (id = 0, datetime = 'Sat Jan 30 1971 12:46:47 GMT-0400 (Eastern Daylight Time)') => ({
    type: UPDATE_EXPENSE_DATETIME,
    payload: { id, datetime },
});


export const deleteExpense = (id = 0) => ({
    type: DELETE_EXPENSE,
    payload: { id },            
});
  
