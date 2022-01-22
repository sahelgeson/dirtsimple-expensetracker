import { ICategory } from 'interfaces';
import cuid from 'cuid';
import { UNCATEGORIZED } from 'lib/constants';

export const DefaultCategoriesNames = [
  'Food',
  'Bars/Restaurants',
  'Alcohol',
  'Home',
  'Medicine/Health',
  'Clothes',
  'Charity',
  'Entertainment',
  'Books',
  'Transportation',
  'Other',
];

export const DefaultCategories: ICategory[] = DefaultCategoriesNames.map((name) => {
  return {
    id: cuid(),
    name,
  };
});


export const getDefaultCategories = (DefaultCategoriesNames: string[]) => {
  const categories: ICategory[] = DefaultCategoriesNames.map((name: string) => {
    return {
      id: cuid(),
      name,
    };
  });

  /* special case if user deletes a category that is already used by one or more expenses 
      this category is only system level and should not show up in any category options
      (users should not be able to delete, rename or view it on the options page), but 
      should be editable on the expense level (e.g. change an 'Uncategorized' expense to the
      'Food' category)
  */
  const uncategorized = {
    id: null, // TODO change this
    name: UNCATEGORIZED
  }
  
  categories.push(uncategorized);
  return categories;
}
