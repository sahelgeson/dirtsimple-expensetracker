import { 
    ADD_EXPENSE, 
    UPDATE_EXPENSE,
    DELETE_EXPENSE, 
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
  
