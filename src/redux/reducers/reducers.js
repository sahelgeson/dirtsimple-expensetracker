import { combineReducers } from 'redux';
import cuid from 'cuid';
import DefaultCategoriesNames from "../constants/DefaultCategoriesNames";

// slice reducer
const expensesReducer = (state = [], action = {}) => {
  const { type, payload } = action;
  switch (type) {
    case 'ADD_EXPENSE':
      return [...state, payload]

    /* To update expenses we are just replacing the expense entirely instead of
      using different actions for different fields. This is because it's easier
      than keeping track of what fields have changed in the form (users can change
      multiple fields before submitting an updating the expense) 
    */
    case 'UPDATE_EXPENSE':
        return state.map(expense => {
          if (expense.id === payload.id) {
            expense = payload;
          }
          return expense;
        });      

    case 'SORT_EXPENSES':
      let sortedExpenses = [...state];
      sortedExpenses.sort(function(a, b) {
        var dateA = new Date(a.datetime), dateB = new Date(b.datetime);
        return dateB - dateA;
      });
      return sortedExpenses;

    case 'DELETE_EXPENSE':
        const updatedExpenses = state.filter((item, index) => item.id !== action.payload);
        return updatedExpenses;

    default: 
      return state;
  }
};

const getDefaultCategories = () => {
  const categories = DefaultCategoriesNames.map((categoryName) => {
    let obj = {
      id: cuid(),
      name: categoryName,
    };
    return obj;
  });

  return categories;
}

const categoriesReducer = (state = getDefaultCategories(), action = {}) => {
  const { type, payload } = action;
  switch (type) {
    case 'ADD_CATEGORY':
      return [...state, payload]

    case 'UPDATE_CATEGORY':
      return state.map(category => {
        if (category.id === action.payload.id) {
          category["name"] = action.payload.name;
        }
        return category;
      });  

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
    const id = action.payload;

    // set any expenses with deleted category to have a categoryId of null
    allExpenses = allExpenses.map((expense) => {
      if (expense.categoryId === id) {   
        expense.categoryId = null;
      }
      return expense;
    }); 

    // remove category from state
    const updatedCategories = categories.filter(category => 
      category.id !== id
    );
    
    const state = {
      allExpenses,
      categories: updatedCategories,
    }

    // will this also set the state.allExpenses? 
    return Object.assign({}, state);    
};

const combinedReducer = combineReducers({  
  allExpenses: expensesReducer,  
  categories:  categoriesReducer,  
});


function crossSliceReducer(state, action) {
  switch (action.type) {

    case 'DELETE_CATEGORY_CROSS_SLICE': {    
      return {        
        allExpenses: expensesReducer(state.allExpenses, action), 
        categories:  handleSpecialCaseForCategories(state.categories, action, state.allExpenses),   // this should be category id?
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
