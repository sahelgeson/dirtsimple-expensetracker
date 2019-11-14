import { 
    ADD_EXPENSE, 
    UPDATE_EXPENSE,
    RENAME_EXPENSES_CATEGORY,
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

export const renameExpensesCategory = (oldCategoryId = '', newCategoryId = '') => ({
    type: RENAME_EXPENSES_CATEGORY,
    payload: { oldCategoryId, newCategoryId },
});

export const deleteExpense = (id = 0) => ({
    type: DELETE_EXPENSE,
    payload: id,            
});

export const sortExpenses = (allExpenses = []) => ({
    type: SORT_EXPENSES,
    payload: allExpenses,
});

  
