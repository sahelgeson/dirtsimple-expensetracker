import React, { useState, useContext, createContext, useCallback, useMemo, useEffect, ReactNode } from 'react';
import { compareAsc } from 'date-fns';
import { addUncategorizedToCategories, removeLegacyNullUncategorized, ensureUncategorizedCategoryIsLast } from 'helpers/Uncategorized';
import { parseStoredAmount } from 'helpers';
import { ICategory, IExpense, CategoryId, Uuid } from 'interfaces';
import { DefaultCategories } from 'contexts/DefaultCategories';
import { test_state } from 'test-state.js';
import { NUM_OF_RECENT_EXPENSES, UNCATEGORIZED } from 'lib/constants';
import { Dollar } from 'interfaces';

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

  !!! the expenses in allExpensesUnfiltered/allExpensesFiltered are not sorted, either by index or datetime. Sorting is the responsibility
  of child components. This is necessary because the expenses on the History page must remain unsorted, 
  otherwise a datetime change will be updated and sorted in the store, then filter back down to
  History causing a rerender (and the expense whose datetime was changed will suddenly move, possibly out
  of view)
*/

interface IGlobalContext {
  allExpensesUnfiltered: IExpense[];
  recentExpensesUnfiltered: IExpense[];
  allExpensesFiltered: IExpense[];
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
  reorderCategories: (reorderedCategories: ICategory[]) => void;
  dedupeCategories: (originalCategoryId: Uuid, renamedCategoryId: Uuid) => void;
  savingsPercentRateGoal: number | undefined;
  setSavingsPercentRateGoal: (rate: number) => void;
  monthlyBudgetLimit: Dollar | undefined;
  setMonthlyBudgetLimit: (limit: Dollar) => void;
  updateExpense: (updatedExpense: IExpense) => void;
  deleteExpense: (deletedExpense: IExpense) => void;  
  getGlobalNow: () => Date;  
}

export const GlobalContext = createContext({} as IGlobalContext);

const initialState = {
  allExpenses: [],
  allCategories: DefaultCategories,
  filteredOutCategoriesIds: [],
}

interface ISavedState {
  // DO NOT change these keys, they're used in localStorage so if these change user can lose data
  allExpenses: IExpense[];
  categories: ICategory[];
  filteredOutCategoriesIds: CategoryId[];
  monthlyBudgetLimit?: Dollar;
  savingsPercentRateGoal?: number;
}

interface IProps {
  children?: ReactNode;
}

function tsObjectGuard(value: unknown): value is Record<PropertyKey, unknown> {
  return typeof value === 'object' && value !== null
}

function hasAmount(value: unknown): value is { amount: number | string } {
  // don't want 0
  return tsObjectGuard(value) && 'amount' in value && value.amount !== 0;
}

function hasCategoryId(value: unknown): value is { categoryId: CategoryId } {
  return tsObjectGuard(value) && 'categoryId' in value;
}

// value here should be IExpense[], array of IExpense objs
const parseAllExpenses = (value: unknown) => {
  let parsedExpenses = [];
  if (Array.isArray(value)) {
    parsedExpenses = value.map(expense => {
      if (hasAmount(expense)) {
        try {
          const parsedAmount = parseStoredAmount(expense.amount);
          expense.amount = parsedAmount;
        } catch (e) {
          console.error(e);
        }
      }

      // TODO move datetime parsing here

      if (hasCategoryId(expense)) {
        if (expense.categoryId === null || expense.categoryId === 'null') {  
          expense.categoryId = UNCATEGORIZED;
        } 
      }

      return expense;
    })
  } 

  return parsedExpenses as IExpense[];
}

const parseState = (k: string, v: unknown) => {
  /*  
    categories and filteredOutCategoriesIds are ICategory[] and CategoryId[], which are arrays of strings
    but allExpenses is IExpense[], where amount is a number but used to be a string. So if a string
    is stored for amount in localStorage, we want to parse it to a number
  */
  if (k === 'allExpenses') {
    parseAllExpenses(v);
  }
  return v;
};

const sortExpenses = (expenses: IExpense[]) => {
  const sortedExpenses = [...expenses];
  sortedExpenses.sort(function(a, b) {
    const dateA = new Date(a.datetime), dateB = new Date(b.datetime);
    return compareAsc(dateB, dateA);
  });
  return sortedExpenses;
}


export const AppProvider: React.FC = (props: IProps) => {
  // TODO this will need to change based on what's in localStorage
  const [allExpensesUnfiltered, setAllExpensesUnfiltered] = useState<IExpense[]>([]);
  // working expenses that may have some expenses filtered out
  const [allExpensesFiltered, setAllExpensesFiltered] = useState<IExpense[]>([]);
  const [allCategories, setAllCategories] = useState<ICategory[]>(initialState.allCategories);
  // note that these are arrays of categories that are excluded, not categories included after filter
  const [filteredOutCategoriesIds, setFilteredOutCategoriesIds] = useState<CategoryId[]>([]);
  const [filteredOutCategories, setFilteredOutCategories] = useState<ICategory[]>([]);
  const [filteredCategories, setFilteredCategories] = useState<ICategory[]>([]);

  const [monthlyBudgetLimit, setMonthlyBudgetLimit] = useState<Dollar | undefined>();
  const [savingsPercentRateGoal, setSavingsPercentRateGoal] = useState<number | undefined>();

  // TODO add isLoading state in here
  // load saved data if it exists
  useEffect(() => {
    let savedState: ISavedState | undefined = undefined;
    try { 
      const serializedState = localStorage.getItem('state') ?? 'false';
      // TODO change tests so they always to manually import data instead
      savedState = JSON.parse(serializedState, parseState);
    } catch (err) { 
      if (process.env.REACT_APP_TESTING === 'development') {
        savedState = test_state as ISavedState;
      } else {
        console.error(err); 
      }
    }

    if (savedState) {
      const { allExpenses, categories, filteredOutCategoriesIds, monthlyBudgetLimit, savingsPercentRateGoal } = savedState;
      const migrateLocalStorageCategories = () => {
        let migratedCategories = addUncategorizedToCategories(categories);
        migratedCategories = removeLegacyNullUncategorized(migratedCategories)
        migratedCategories = migratedCategories.map((category: ICategory, index: number) => {
          if (!category?.order) {
            category.order = index;
          }
          return category;
        });

        migratedCategories = migratedCategories.sort((a: ICategory, b: ICategory) => a.order - b.order);
        
        return migratedCategories;
      } 

      const allCategories = migrateLocalStorageCategories(); // TODO: decouple keys from state variables

      // the Uncategorized category originally had id === null, this covers legacy
      const allExpensesFixLegacyNull: IExpense[] = allExpenses.map((expense: IExpense) => {
        if (expense.categoryId === null || expense.categoryId === 'null') {
          expense.categoryId = UNCATEGORIZED;
        }
        return expense;
      });

      // only setState if serializedState exists
      setAllExpensesUnfiltered(allExpensesFixLegacyNull);
      setAllCategories(allCategories); // TODO: decouple keys from state variables
      setFilteredOutCategoriesIds(filteredOutCategoriesIds || []);
      setMonthlyBudgetLimit(monthlyBudgetLimit);
      setSavingsPercentRateGoal(savingsPercentRateGoal);
    }
  }, []);

  // save data to localStorage whenever it changes
  useEffect(() => {
    try {
      const state: ISavedState = {
        allExpenses: allExpensesUnfiltered,
        categories: allCategories,  // TODO: decouple keys from state variables
        filteredOutCategoriesIds,
        monthlyBudgetLimit,
        savingsPercentRateGoal,
      }
      const serializedState = JSON.stringify(state);
      //if (process.env.REACT_APP_TESTING !== 'development') {    // don't save test data to localStorage
        localStorage.setItem('state', serializedState);
      //}
    } catch (err) { console.error(err); }
  }, [allExpensesUnfiltered, allCategories, filteredOutCategoriesIds, monthlyBudgetLimit, savingsPercentRateGoal]);

  // keep allExpenses updated to filter out selected categories
  useEffect(() => {
    const filteredExpenses = allExpensesUnfiltered.filter((expense) => {
      return !filteredOutCategoriesIds.includes(expense.categoryId);
    });
    setAllExpensesFiltered(filteredExpenses);
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
    setAllExpensesUnfiltered((prev: IExpense[]) => ([  newExpense, ...prev ]));
  }, []);

  const addCategory = useCallback((addedCategory: ICategory) => {
    // logic to prevent adding a category with the same name is at calling site(s)
    setAllCategories((prev: ICategory[]) => {
      const order = prev.length;
      const newCategory = { ...addedCategory, order };
      const categories = [ ...prev, newCategory ];
      console.log({ categories })
      return ensureUncategorizedCategoryIsLast(categories);
    });
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

  const reorderCategories = useCallback((reorderedCategories: ICategory[]) => {
    // actual reordering is done at calling site, this just saves the changes
    setAllCategories(reorderedCategories);
  }, []);

  /* if a user renames a category to have the same name as an already existing category
    we dedupe the allCategories by just using the original category (id and name) */
  const dedupeCategories = useCallback((originalCategoryId: Uuid, renamedCategoryId: Uuid) => {
    // first update expenses that have category id being renamed to use original category's id
    setAllExpensesUnfiltered((prev: IExpense[]) => {
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
  
  /* if a category is deleted, the category id value for any expense
    that had that category id should be set to "Uncategorized"
  */
  const deleteCategory = useCallback((deletedCategoryId: Uuid) => {
    // set any expenses with deleted category to have a categoryId of UNCATEGORIZED
    setAllExpensesUnfiltered((prev: IExpense[]) => {
      const updatedExpenses = prev.map((expense) => {
        if (expense.categoryId === deletedCategoryId) {   
          expense.categoryId = UNCATEGORIZED;
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

  const updateExpense = useCallback((updatedExpense: IExpense) => {
    setAllExpensesUnfiltered((prev: IExpense[]) => {
      let updatedExpenses = prev.map(expense => {
        if (expense.id === updatedExpense.id) {
          expense = updatedExpense;
        }
        return expense;
      });  
      // re-sort expenses by date here since this is the only way
      // they can get unsorted by date
      updatedExpenses = sortExpenses(updatedExpenses);

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
      const lastTestDate = allExpensesUnfiltered[0]?.datetime;
      if (lastTestDate) now = new Date(lastTestDate);
    }
    return now;
  }, [allExpensesUnfiltered]);

  const recentExpensesUnfiltered = useMemo(() => {    
    return allExpensesUnfiltered.slice(0, NUM_OF_RECENT_EXPENSES);
  }, [allExpensesUnfiltered]);

  const context = {
    allExpensesUnfiltered,
    recentExpensesUnfiltered,
    allExpensesFiltered,
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
    reorderCategories,
    dedupeCategories,
    savingsPercentRateGoal,
    setSavingsPercentRateGoal,
    monthlyBudgetLimit,
    setMonthlyBudgetLimit,
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
