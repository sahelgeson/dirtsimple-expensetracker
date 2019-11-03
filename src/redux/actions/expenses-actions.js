import { 
    ADD_EXPENSE, 
    UPDATE_EXPENSE,
    DELETE_EXPENSE,
    SORT_EXPENSES, 
} from '../constants/ActionTypes'

export const addExpense = (expense = {}) => ({
    type: ADD_EXPENSE,
    payload: expense,      
});

export const updateExpense = (updatedExpense = {}) => ({
    type: UPDATE_EXPENSE,
    payload: updatedExpense,
});

export const deleteExpense = (id = 0) => ({
    type: DELETE_EXPENSE,
    payload: id,            
});

export const sortExpenses = (allExpenses = []) => ({
    type: SORT_EXPENSES,
    payload: allExpenses,
});

  
