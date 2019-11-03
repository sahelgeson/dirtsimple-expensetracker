import { 
    ADD_CATEGORY, 
    UPDATE_CATEGORY, 
    DELETE_CATEGORY_CROSS_SLICE, /* this action needs to cross slices and change allExpenses state also */
} from '../constants/ActionTypes'

export const addCategory = (category) => ({
  type: ADD_CATEGORY,
  payload: { category },
});

export const updateCategory = (id = 0, name = '') => ({
    type: UPDATE_CATEGORY,
    payload: { id, name },
});

export const deleteCategory = (id = 0) => ({
    type: DELETE_CATEGORY_CROSS_SLICE,
    payload: { id },                 
});
  