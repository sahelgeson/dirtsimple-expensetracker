import DefaultCategoriesNames from "../redux/constants/DefaultCategoriesNames";
import { createUncategorizedCategory } from "./CreateUncategorizedCategory.jsx";
import cuid from 'cuid';

// these are data migrations to move expenses to the new redux store

export const dataMigration = () => {
  let categories = JSON.parse(localStorage.getItem('myCategories'));
  let allExpenses = JSON.parse(localStorage.getItem('myExpenses'));

  /* if there are categories saved already, set them up with an id
     to save categories and also be able to save the ids to related expenses
  */
  if (categories !== undefined) {
    categories = categories.map((category) => {
      let newCategory = {
        id: cuid(),
        name: category,
      }
      return newCategory;
    });
    categories = createUncategorizedCategory(categories);
  } else if (categories === undefined && allExpenses !== undefined) {
    /* myCategories is only saved if there was a change to the categories
      so you could have myExpenses with no myCategories, the following
      generates categories with ids to be used in the legacy myExpenses
    */
    categories = DefaultCategoriesNames.map((category) => {
      let newCategory = {
        id: cuid(),
        name: category,
      }
      return newCategory;
    });
  }
  localStorage.removeItem('myCategories');

  if (allExpenses !== undefined) {
    allExpenses = allExpenses.map((expense) => {
      const id = cuid();
      const {amount, datetime} = expense;
      const categoryName = expense.category;
      let categoryId = null;

      // categories will have been set above if there are allExpenses
      categories.forEach((category) => {
        if (category.name === categoryName) {
          categoryId = category.id;
        }
      });

      const updatedExpense = {
        id,
        datetime,
        amount,
        categoryId
      }
      return updatedExpense;
    });

    localStorage.removeItem('myExpenses');
  }

  const state = {
    allExpenses,
    categories,
  }

  return state;
}


