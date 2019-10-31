import { combineReducers } from 'redux';
import cuid from 'cuid';
import DefaultCategoriesNames from "../constants/DefaultCategoriesNames";

// slice reducer
const expensesReducer = (state = {}, action = {}) => {
  const { type, payload } = action;
  switch (type) {
    case ADD_EXPENSE:
      return Object.assign({}, state, {
        //chatLog: state.chatLog.concat(payload)
      });

    // Catch all simple changes
    case UPDATE_EXPENSE_AMOUNT:
    case UPDATE_EXPENSE_CATEGORY:
    case UPDATE_EXPENSE_DATETIME:
      //return Object.assign({}, state, payload);

    default: 
      return state;
  }
};

// array of names, need to add ids with cuid? 
// setting up as an array, should it be an obj?
const DefaultCategories = () => {
  const categories = DefaultCategoriesNames.map((categoryName) => {
    let obj = {
      id: cuid(),
      name: categoryName,
    };
    return obj;
  });

  return categories;
}

const categoriesReducer = (state = {}, action = {}) => {
  const { type, payload } = action;
  switch (type) {
    case ADD_CATEGORY:
      return Object.assign({}, state, {
        //chatLog: state.chatLog.concat(payload)
      });

    case UPDATE_CATEGORY:
      //return Object.assign({}, state, payload);

    default: 
      return state;
  }
};

/* if a category is deleted, the category id value for each expense
    that had that category id should be set to null. This requires
    a cross slice solution for a category action to update allExpenses */                                        
const handleSpecialCaseForCategories = (categories, action, allExpenses) => {
    /* action is in example in Redux docs, but where does it come into play here?
    
      https://redux.js.org/recipes/structuring-reducers/beyond-combinereducers

    */

        allExpenses = allExpenses.map((expense) => {
          if (expense.category === payload) {   // payload or category?
            expense.category = null;
          }
          return expense;
        }); 
        
        /* TODO: need to put together state */
        // what about payload here?
       return Object.assign({}, state, payload); // change this   
};

const combinedReducer = combineReducers({  
  allExpenses: expensesReducer,  
  categories:  categoriesReducer,  
});


function crossSliceReducer(state, action) {
  switch (action.type) {

    case DELETE_CATEGORY_CROSS_SLICE: {    
      return {        
        allExpenses: expensesReducer(state.allExpenses, action), 
        categories:  handleSpecialCaseForCategories(state.categories, action, state.allExpenses), 
      }
    }
    default:
      return state;
  }
}

function rootReducer(state, action) {
  const intermediateState = combinedReducer(state, action);
  const finalState = crossSliceReducer(intermediateState, action);
  return finalState;
}

export default rootReducer;
