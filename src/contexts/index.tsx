import React, { useState, useContext, createContext, useCallback, useEffect, ReactNode } from 'react';
import { compareAsc } from 'date-fns';
import { createUncategorizedCategory } from 'helpers/CreateUncategorizedCategory';
import { ICategory, IExpense, CategoryId, Uuid } from 'interfaces';
import { DefaultCategories } from 'contexts/DefaultCategories';
import { test_state } from 'test-state.js';
/* 
  For datetime, value is stored in localStorage, which means it has to go through JSON.stringify.
  // TODO fix this, stick with one format
  JSON.stringify converts Date objects to an ISO format ( Date.toISOString => YYYY-MM-DDTHH:mm:ss.sssZ)

  We don't want timezones/GMT, just the local datetime, so we use Date.toString and just save the
  String. Formatting should be done in child components where needed. (Format for native datetime-local has
  a custom format, see also lib/constants)

  Amount is valid to 2 decimal places, native HTML5 attributes on the input validate that. The
  expectation/hope is that users will just use dollar amounts without cents.

  Categories only allow for one unique value per category name. If that is changed you will need to also
  change any keys associated with categories since those need unique values. Categories are case-sensitive,
  so "Food" and "food" are different categories. 

  !!! the expenses in allExpenses are not sorted, either by index or datetime. Sorting is the responsibility
  of child components. This is necessary because the expenses on the History page must remain unsorted, 
  otherwise a datetime change will be updated and sorted in the store, then filter back down to
  History causing a rerender (and the expense whose datetime was changed will suddenly move, possibly out
  of view)
*/

interface IGlobalContext {
  allExpenses: IExpense[];
  allCategories: ICategory[];
  filteredCategories: ICategory[];  // inclusive
  filteredOutCategories: ICategory[]; // exclusive
  filteredOutCategoriesIds: CategoryId[];
  filterOutCategory: (categoryToFilterOut: CategoryId) => void; 
  clearFilterOutCategory: (categoryToUnfilter: CategoryId) => void;
  addExpense: (newExpense: IExpense) => void;
  addCategory: (newCategory: ICategory) => void;
  renameCategory: (renamedCategoryId: Uuid, newCategoryName: string) => void;
  deleteCategory: (deletedCategoryId: Uuid) => void;
  dedupeCategories: (originalCategoryId: Uuid, renamedCategoryId: Uuid) => void;
  sortExpenses: () => void;
  updateExpense: (updatedExpense: IExpense) => void;
  deleteExpense: (deletedExpense: IExpense) => void;  
  getGlobalNow: () => Date;  
}

export const GlobalContext = createContext({} as IGlobalContext);

const initialState = {
  allExpenses: [],
  allCategories: DefaultCategories,
}

interface IProps {
  children?: ReactNode;
}

export const GlobalProvider: React.FC = (props: IProps) => {
  // TODO this will need to change based on what's in localStorage
  const [allExpensesUnfiltered, setAllExpensesUnfiltered] = useState<IExpense[]>([]);
  // working expenses that may have some expenses filtered out
  const [allExpenses, setAllExpenses] = useState<IExpense[]>([]);
  const [allCategories, setAllCategories] = useState<ICategory[]>(initialState.allCategories);
  // note that these are arrays of categories that are excluded, not categories included after filter
  const [filteredOutCategoriesIds, setFilteredOutCategoriesIds] = useState<CategoryId[]>([]);
  const [filteredOutCategories, setFilteredOutCategories] = useState<ICategory[]>([]);
  const [filteredCategories, setFilteredCategories] = useState<ICategory[]>([]);

  // load saved data if it exists
  useEffect(() => {
    let savedState;
    try { 
      const serializedState = localStorage.getItem('state') ?? '';
      // TODO change tests so they always to manually import data instead
      savedState = JSON.parse(serializedState);
      
      // TODO ensure there is an "Uncategorized" category
      savedState.categories = createUncategorizedCategory(savedState.categories); // TODO: decouple keys from state variables
      // only setState if serializedState exists
      setAllExpensesUnfiltered(savedState.allExpenses);
      setAllCategories(savedState.categories); // TODO: decouple keys from state variables
      setFilteredOutCategoriesIds(savedState.filteredOutCategoriesIds || []);
    } catch (err) { 
      if (process.env.REACT_APP_TESTING === 'development') {
        savedState = test_state;
        // TODO ensure there is an "Uncategorized" category
        savedState.categories = createUncategorizedCategory(savedState.categories); // TODO: decouple keys from state variables
        // only setState if serializedState exists
        setAllExpensesUnfiltered(savedState.allExpenses);
        setAllCategories(savedState.categories); // TODO: decouple keys from state variables
        setFilteredOutCategoriesIds(savedState.filteredOutCategoriesIds || []);
      } else {
        console.error(err); 
      }
    }
  }, []);

  // save data to localStorage whenever it changes
  useEffect(() => {
    try {
      const state = {
        allExpenses: allExpensesUnfiltered,
        categories: allCategories,  // TODO: decouple keys from state variables
        filteredOutCategoriesIds,
      }
      const serializedState = JSON.stringify(state);
      if (process.env.REACT_APP_TESTING !== 'development') {    // don't save test data to localStorage
        localStorage.setItem('state', serializedState);
      }
    } catch (err) { console.error(err); }
  }, [allExpensesUnfiltered, allCategories, filteredOutCategoriesIds]);

  // keep allExpenses updated to filter out selected categories
  useEffect(() => {
    const filteredExpenses = allExpensesUnfiltered.filter((expense) => {
      return !filteredOutCategoriesIds.includes(expense.categoryId);
    });
    setAllExpenses(filteredExpenses);
  }, [allExpensesUnfiltered, filteredOutCategoriesIds]);

  // keep filteredCategories & filterOutCategories in sync based on filteredOutCategoriesIds
  useEffect(() => {
    const filteredCategories = allCategories.filter((category) => {
      // note that this is array of categories that not filtered out 
      return !filteredOutCategoriesIds.includes(category.id);
    });
    const filteredOutCategories = allCategories.filter((category) => {
      // note that this is array of categories that are excluded, not categories included after filter 
      return filteredOutCategoriesIds.includes(category.id);
    });
    setFilteredCategories(filteredCategories);
    setFilteredOutCategories(filteredOutCategories);
  }, [allCategories, filteredOutCategoriesIds]);
  
  const addExpense = useCallback((newExpense: IExpense) => {
    setAllExpensesUnfiltered((prev: IExpense[]) => ([ ...prev, newExpense ]));
  }, []);

  const addCategory = useCallback((newCategory: ICategory) => {
    // TODO should this check if category with same name already exists? See functions below
    // logic for "No new category will be added" message should be in here
    setAllCategories((prev: ICategory[]) => ([ ...prev, newCategory ]));
  }, []);

  const filterOutCategory = useCallback((categoryToFilterOut: CategoryId) => {
    setFilteredOutCategoriesIds((prev: CategoryId[]) => ([ ...prev, categoryToFilterOut ]));
  }, []);

  const clearFilterOutCategory = useCallback((categoryToUnfilter: CategoryId) => {
    setFilteredOutCategoriesIds((prev) => {
      return prev.filter((category) => {
        return category !== categoryToUnfilter;
      });
    });
  }, []);

  // TODO: change this so that dupe check is here in context
  const renameCategory = useCallback((renamedCategoryId: Uuid, newCategoryName: string) => {
    setAllCategories((prev: ICategory[]) => {
      const updatedCategories = prev.map(category => {
        if (category.id === renamedCategoryId) {
          category.name = newCategoryName;
        }
        return category;
      }); 
      return updatedCategories;
    });
  }, []);

  /* if a user renames a category to have the same name as an already existing category
    we dedupe the allCategories by just using the original category (id and name) */
  const dedupeCategories = useCallback((originalCategoryId: Uuid, renamedCategoryId: Uuid) => {
    // first update expenses that have category id being renamed to use original category's id
    setAllExpenses((prev: IExpense[]) => {
      const updatedExpenses = prev.map(expense => {
        if (expense.categoryId === renamedCategoryId) {
          expense.categoryId = originalCategoryId;
        }
        return expense;
      }); 
      return updatedExpenses;
    });

    // then we just delete the renamed category's entry since everything
    // has been moved over to the original category
    setAllCategories((prev: ICategory[]) => {
      return prev.filter(category => category.id !== renamedCategoryId);
    });
  }, []);
  
  /* if a category is deleted, the category id value for each expense
    that had that category id should be set to null ("Uncategorized"); 
    TODO change null to special string */
  const deleteCategory = useCallback((deletedCategoryId: Uuid) => {
    // set any expenses with deleted category to have a categoryId of null
    setAllExpensesUnfiltered((prev: IExpense[]) => {
      const updatedExpenses = prev.map((expense) => {
        if (expense.categoryId === deletedCategoryId) {   
          expense.categoryId = null;
        }
        return expense;
      }); 
      return updatedExpenses;
    });

    // remove category from state
    setAllCategories((prev: ICategory[]) => {
      const updatedCategories = prev.filter(category => 
        category.id !== deletedCategoryId
      );
      return updatedCategories;
    });
  }, []);

  const sortExpenses = useCallback(() => {
    setAllExpensesUnfiltered((prev) => {
      const sortedExpenses = [...prev];
      sortedExpenses.sort(function(a, b) {
        const dateA = new Date(a.datetime), dateB = new Date(b.datetime);
        return compareAsc(dateB, dateA);
      });
      return sortedExpenses;
    })
  }, []);

  const updateExpense = useCallback((updatedExpense: IExpense) => {
    setAllExpensesUnfiltered((prev: IExpense[]) => {
      const updatedExpenses = prev.map(expense => {
        if (expense.id === updatedExpense.id) {
          expense = updatedExpense;
        }
        return expense;
      });  
      return updatedExpenses;
    });
  }, []);

  const deleteExpense = useCallback((deletedExpense: IExpense) => {
    setAllExpensesUnfiltered((prev: IExpense[]) => {
      const updatedExpenses = prev.filter(expense => expense.id !== deletedExpense.id);  
      return updatedExpenses;
    });
  }, []);

  // this allows programmatically altering the date to make testing easier
  const getGlobalNow = useCallback(() => {
    let now = new Date();
    if (process.env.REACT_APP_TESTING === 'development') {
      const lastTestDate = allExpenses[0]?.datetime;
      now = new Date(lastTestDate);
    }
    return now;
  }, [allExpenses]);

  const context = {
    allExpenses,
    allCategories,
    filteredCategories,
    filteredOutCategories,
    filteredOutCategoriesIds,
    filterOutCategory,
    clearFilterOutCategory,
    addExpense,
    addCategory,
    renameCategory,
    deleteCategory,
    dedupeCategories,
    sortExpenses,
    updateExpense,
    deleteExpense,  
    getGlobalNow,  
  };

  return (
    <GlobalContext.Provider value={context}>
      {props.children}
    </GlobalContext.Provider>
  );
};

export const useGlobalState = (): IGlobalContext => useContext(GlobalContext);
