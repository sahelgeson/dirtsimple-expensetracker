import { 
    ADD_CATEGORY, 
    UPDATE_CATEGORY, 
    DELETE_CATEGORY_CROSS_SLICE, /* this action needs to cross slices and change allExpenses state also */
} from '../constants/ActionTypes'

export const addCategory = (category) => ({
  type: ADD_CATEGORY,
  category,
});

export const updateCategory = (category) => ({
    type: UPDATE_CATEGORY,
    category,
});

export const deleteCategory = (category) => ({
    type: DELETE_CATEGORY_CROSS_SLICE,
    category,        
});
  